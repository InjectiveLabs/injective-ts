/* eslint-disable class-methods-use-this */
import { CosmosChainId } from '@injectivelabs/ts-types'
import {
  TxRaw,
  TxResponse,
  waitTxBroadcasted,
  createTxRawFromSigResponse,
  createSignDocFromTransaction,
} from '@injectivelabs/sdk-ts'
import type { DirectSignResponse } from '@cosmjs/proto-signing'
import {
  ErrorType,
  TransactionException,
  UnspecifiedErrorCode,
  CosmosWalletException,
} from '@injectivelabs/exceptions'
import { AminoSignResponse, StdSignDoc } from '@cosmjs/launchpad'
import { KeplrWallet } from '../../../utils/wallets/keplr/index.js'
import { ConcreteCosmosWalletStrategy } from '../../types/strategy.js'
import { WalletAction, WalletDeviceType } from '../../../types/enums.js'
import { SendTransactionOptions } from '../../wallet-strategy/index.js'
import { createCosmosSignDocFromSignDoc } from '../../../utils/cosmos.js'

export default class Keplr implements ConcreteCosmosWalletStrategy {
  public chainId: CosmosChainId

  private keplrWallet: KeplrWallet

  constructor(args: { chainId: CosmosChainId }) {
    this.chainId = args.chainId || CosmosChainId.Injective
    this.keplrWallet = new KeplrWallet(args.chainId)
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    const keplrWallet = this.getKeplrWallet()
    const key = await keplrWallet.getKey()

    return key.isNanoLedger
      ? Promise.resolve(WalletDeviceType.Hardware)
      : Promise.resolve(WalletDeviceType.Browser)
  }

  async enable() {
    return await KeplrWallet.isChainIdSupported(this.chainId)
  }

  async getAddresses(): Promise<string[]> {
    const keplrWallet = this.getKeplrWallet()

    try {
      const accounts = await keplrWallet.getAccounts()

      return accounts.map((account) => account.address)
    } catch (e: unknown) {
      if (e instanceof CosmosWalletException) {
        throw e
      }

      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: WalletAction.GetAccounts,
      })
    }
  }

  async sendTransaction(
    transaction: DirectSignResponse | TxRaw,
    options: SendTransactionOptions,
  ): Promise<TxResponse> {
    const { keplrWallet } = this
    const txRaw = createTxRawFromSigResponse(transaction)

    if (!options.endpoints) {
      throw new CosmosWalletException(
        new Error(
          'You have to pass endpoints within the options to broadcast transaction',
        ),
      )
    }

    try {
      const txHash = await keplrWallet.broadcastTx(txRaw)

      return await waitTxBroadcasted(txHash, options)
    } catch (e: unknown) {
      if (e instanceof TransactionException) {
        throw e
      }

      throw new TransactionException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: WalletAction.SendTransaction,
      })
    }
  }

  async signTransaction(transaction: {
    txRaw: TxRaw
    chainId: string
    accountNumber: number
    address: string
  }) {
    const keplrWallet = this.getKeplrWallet()
    const signer = await keplrWallet.getOfflineSigner()
    const signDoc = createSignDocFromTransaction(transaction)

    try {
      return signer.signDirect(
        transaction.address,
        createCosmosSignDocFromSignDoc(signDoc),
      )
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: WalletAction.SendTransaction,
      })
    }
  }

  async signAminoTransaction(transaction: {
    address: string
    stdSignDoc: StdSignDoc
  }): Promise<AminoSignResponse> {
    const keplrWallet = this.getKeplrWallet()
    const signer = await keplrWallet.getOfflineAminoSigner()
    const walletDeviceType = await this.getWalletDeviceType()

    if (walletDeviceType !== WalletDeviceType.Hardware) {
      throw new CosmosWalletException(
        new Error(
          'signAminoTransaction is only supported when using Keplr + Ledger',
        ),
        {
          code: UnspecifiedErrorCode,
          context: WalletAction.SignTransaction,
        },
      )
    }

    try {
      return signer.signAmino(transaction.address, transaction.stdSignDoc)
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: WalletAction.SendTransaction,
      })
    }
  }

  async getPubKey(): Promise<string> {
    const keplrWallet = this.getKeplrWallet()

    try {
      const key = await keplrWallet.getKey()

      return Buffer.from(key.pubKey).toString('base64')
    } catch (e) {
      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: WalletAction.GetAccounts,
      })
    }
  }

  private getKeplrWallet(): KeplrWallet {
    const { keplrWallet } = this

    if (!keplrWallet) {
      throw new CosmosWalletException(
        new Error('Please install the Keplr wallet extension'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
          context: WalletAction.SignTransaction,
        },
      )
    }

    return keplrWallet
  }
}
