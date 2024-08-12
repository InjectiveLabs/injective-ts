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
import { FoxWallet } from '../../../utils/wallets/fox-wallet'
import { ConcreteCosmosWalletStrategy } from '../../types/strategy'
import { WalletAction, WalletDeviceType } from '../../../types/enums'
import { SendTransactionOptions } from '../../wallet-strategy'
import { createCosmosSignDocFromSignDoc } from '../../../utils/cosmos'

export default class Fox implements ConcreteCosmosWalletStrategy {
  public chainId: CosmosChainId

  private foxWallet: FoxWallet

  constructor(args: { chainId: CosmosChainId }) {
    this.chainId = args.chainId || CosmosChainId.Injective
    this.foxWallet = new FoxWallet(args.chainId)
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return WalletDeviceType.Browser
  }

  async enable() {
    return await FoxWallet.isChainIdSupported(this.chainId)
  }

  async getAddresses(): Promise<string[]> {
    const foxWallet = this.getFoxWallet()

    try {
      const accounts = await foxWallet.getAccounts()

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
    const { foxWallet } = this
    const txRaw = createTxRawFromSigResponse(transaction)

    if (!options.endpoints) {
      throw new CosmosWalletException(
        new Error(
          'You have to pass endpoints within the options to broadcast transaction',
        ),
      )
    }

    try {
      const txHash = await foxWallet.broadcastTx(txRaw)

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
    const foxWallet = this.getFoxWallet()
    const signer = await foxWallet.getOfflineSigner()
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

  async signAminoTransaction(_transaction: {
    address: string
    stdSignDoc: StdSignDoc
  }): Promise<AminoSignResponse> {
    throw new CosmosWalletException(
      new Error('signAminoTransaction not supported on FoxWallet'),
    )
  }

  async getPubKey(): Promise<string> {
    const foxWallet = this.getFoxWallet()

    try {
      const key = await foxWallet.getKey()

      return Buffer.from(key.pubKey).toString('base64')
    } catch (e) {
      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: WalletAction.GetAccounts,
      })
    }
  }

  private getFoxWallet(): FoxWallet {
    const { foxWallet } = this

    if (!foxWallet) {
      throw new CosmosWalletException(
        new Error('Please install the FoxWallet extension'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
          context: WalletAction.SignTransaction,
        },
      )
    }

    return foxWallet
  }
}
