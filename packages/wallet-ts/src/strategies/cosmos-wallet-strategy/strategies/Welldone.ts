/* eslint-disable class-methods-use-this */
import { CosmosChainId } from '@injectivelabs/ts-types'
import {
  TxRaw,
  TxResponse,
  createTxRawFromSigResponse,
  createCosmosSignDocFromSignDoc,
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
import { ConcreteCosmosWalletStrategy } from '../../types/strategy'
import { WalletAction, WalletDeviceType } from '../../../types/enums'
import { WelldoneWallet } from '../../../../src/utils/wallets'

export default class Welldone implements ConcreteCosmosWalletStrategy {
  public chainId: CosmosChainId

  private welldoneWallet: WelldoneWallet

  constructor(args: { chainId: CosmosChainId }) {
    this.chainId = args.chainId || CosmosChainId.Injective
    this.welldoneWallet = new WelldoneWallet(args.chainId)
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return Promise.resolve(WalletDeviceType.Browser)
  }

  async isChainIdSupported(chainId?: CosmosChainId): Promise<boolean> {
    const welldoneWallet = chainId
      ? new WelldoneWallet(chainId)
      : this.getWelldoneWallet()

    return welldoneWallet.checkChainIdSupport()
  }

  async getAddresses(): Promise<string[]> {
    const welldoneWallet = this.getWelldoneWallet()

    try {
      const accounts = await welldoneWallet.getAccounts()

      return [accounts.address]
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        context: WalletAction.GetAccounts,
      })
    }
  }

  async sendTransaction(
    transaction: DirectSignResponse | TxRaw,
  ): Promise<TxResponse> {
    const { welldoneWallet } = this
    const txRaw = createTxRawFromSigResponse(transaction)

    try {
      return await welldoneWallet.waitTxBroadcasted(
        await welldoneWallet.broadcastTx(txRaw),
      )
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
  }): Promise<DirectSignResponse> {
    const welldoneWallet = this.getWelldoneWallet()
    const signDoc = createSignDocFromTransaction(transaction)

    try {
      const result = await welldoneWallet.signTransaction(
        createCosmosSignDocFromSignDoc(signDoc),
      )

      return result
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
      new Error('signAminoTransaction not supported on WELLDONE wallet'),
    )
  }

  async getPubKey(): Promise<string> {
    const welldoneWallet = this.getWelldoneWallet()
    const key = await welldoneWallet.getKey()

    return Buffer.from(key.replace('0x', ''), 'hex').toString('base64')
  }

  private getWelldoneWallet(): WelldoneWallet {
    const { welldoneWallet } = this

    if (!welldoneWallet) {
      throw new CosmosWalletException(
        new Error('Please install the WELLDONE wallet extension'),
      )
    }

    return welldoneWallet
  }
}
