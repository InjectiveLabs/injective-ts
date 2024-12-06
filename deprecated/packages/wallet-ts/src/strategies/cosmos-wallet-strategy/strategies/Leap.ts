/* eslint-disable class-methods-use-this */
import { CosmosChainId } from '@injectivelabs/ts-types'
import {
  ErrorType,
  UnspecifiedErrorCode,
  CosmosWalletException,
  TransactionException,
} from '@injectivelabs/exceptions'
import {
  TxRaw,
  TxResponse,
  waitTxBroadcasted,
  AminoSignResponse,
  DirectSignResponse,
  createTxRawFromSigResponse,
  createSignDocFromTransaction,
} from '@injectivelabs/sdk-ts'
import { StdSignDoc } from '@keplr-wallet/types'
import { LeapWallet } from '../../../utils/wallets/leap/index.js'
import { WalletAction, WalletDeviceType } from '../../../types/enums.js'
import { ConcreteCosmosWalletStrategy } from '../../types/strategy.js'
import { SendTransactionOptions } from '../../wallet-strategy/index.js'
import { createCosmosSignDocFromSignDoc } from '../../../utils/cosmos.js'

export default class Leap implements ConcreteCosmosWalletStrategy {
  public chainId: CosmosChainId

  private leapWallet: LeapWallet

  constructor(args: { chainId: CosmosChainId }) {
    this.chainId = args.chainId || CosmosChainId.Injective
    this.leapWallet = new LeapWallet(args.chainId)
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    const leapWallet = this.getLeapWallet()
    const key = await leapWallet.getKey()

    return key.isNanoLedger
      ? Promise.resolve(WalletDeviceType.Hardware)
      : Promise.resolve(WalletDeviceType.Browser)
  }

  async enable() {
    return await LeapWallet.isChainIdSupported(this.chainId)
  }

  async getAddresses(): Promise<string[]> {
    const leapWallet = this.getLeapWallet()

    try {
      const accounts = await leapWallet.getAccounts()

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
    const { leapWallet } = this
    const txRaw = createTxRawFromSigResponse(transaction)

    if (!options.endpoints) {
      throw new CosmosWalletException(
        new Error(
          'You have to pass endpoints within the options to broadcast transaction',
        ),
      )
    }

    try {
      const txHash = await leapWallet.broadcastTx(txRaw)

      return await waitTxBroadcasted(txHash, options)
    } catch (e: unknown) {
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
    const leapWallet = this.getLeapWallet()
    const signer = await leapWallet.getOfflineSigner()
    const signDoc = createSignDocFromTransaction(transaction)

    try {
      return signer.signDirect(
        transaction.address,
        createCosmosSignDocFromSignDoc(signDoc),
      )
    } catch (e: unknown) {
      if (e instanceof TransactionException) {
        throw e
      }

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
      new Error('signAminoTransaction not supported on Leap'),
    )
  }

  async getPubKey(): Promise<string> {
    const leapWallet = this.getLeapWallet()

    try {
      const key = await leapWallet.getKey()

      return Buffer.from(key.pubKey).toString('base64')
    } catch (e) {
      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: WalletAction.GetAccounts,
      })
    }
  }

  private getLeapWallet(): LeapWallet {
    const { leapWallet } = this

    if (!leapWallet) {
      throw new CosmosWalletException(
        new Error('Please install the Leap wallet extension'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
          context: WalletAction.SignTransaction,
        },
      )
    }

    return leapWallet
  }
}
