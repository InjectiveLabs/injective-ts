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
import { OWalletBase } from '../../../utils/wallets/owallet'
import { ConcreteCosmosWalletStrategy } from '../../types/strategy'
import { WalletAction, WalletDeviceType } from '../../../types/enums'
import { SendTransactionOptions } from '../../wallet-strategy'
import { createCosmosSignDocFromSignDoc } from '../../../utils/cosmos'

export default class OWallet implements ConcreteCosmosWalletStrategy {
  public chainId: CosmosChainId

  private owallet: OWalletBase

  constructor(args: { chainId: CosmosChainId }) {
    this.chainId = args.chainId || CosmosChainId.Injective
    this.owallet = new OWalletBase(args.chainId)
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    const owallet = this.getOWalletBase()
    const key = await owallet.getKey()

    return key.isNanoLedger
      ? Promise.resolve(WalletDeviceType.Hardware)
      : Promise.resolve(WalletDeviceType.Browser)
  }

  async enable() {
    return await OWalletBase.isChainIdSupported(this.chainId)
  }

  async getAddresses(): Promise<string[]> {
    const owallet = this.getOWalletBase()

    try {
      const accounts = await owallet.getAccounts()

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
    const { owallet } = this
    const txRaw = createTxRawFromSigResponse(transaction)

    if (!options.endpoints) {
      throw new CosmosWalletException(
        new Error(
          'You have to pass endpoints within the options to broadcast transaction',
        ),
      )
    }

    try {
      const txHash = await owallet.broadcastTx(txRaw)

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
    const owallet = this.getOWalletBase()
    const signer = await owallet.getOfflineSigner()
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
    const owallet = this.getOWalletBase()
    const signer = await owallet.getOfflineAminoSigner()
    const walletDeviceType = await this.getWalletDeviceType()

    if (walletDeviceType !== WalletDeviceType.Hardware) {
      throw new CosmosWalletException(
        new Error(
          'signAminoTransaction is only supported when using OWallet + Ledger',
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
    const owallet = this.getOWalletBase()

    try {
      const key = await owallet.getKey()

      return Buffer.from(key.pubKey).toString('base64')
    } catch (e) {
      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: WalletAction.GetAccounts,
      })
    }
  }

  private getOWalletBase(): OWalletBase {
    const { owallet } = this

    if (!owallet) {
      throw new CosmosWalletException(
        new Error('Please install the OWallet wallet extension'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
          context: WalletAction.SignTransaction,
        },
      )
    }

    return owallet
  }
}
