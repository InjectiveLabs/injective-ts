/* eslint-disable class-methods-use-this */
import {
  ChainId,
  CosmosChainId,
  AccountAddress,
  EthereumChainId,
} from '@injectivelabs/ts-types'
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
import { ConcreteWalletStrategy } from '../../types'
import BaseConcreteStrategy from './Base'
import { WalletAction, WalletDeviceType } from '../../../types/enums'
import { WelldoneWallet } from '../../../utils/wallets/welldone'

export default class Welldone
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  private welldoneWallet: WelldoneWallet

  constructor(args: { chainId: ChainId }) {
    super(args)
    this.chainId = args.chainId || CosmosChainId.Injective
    this.welldoneWallet = new WelldoneWallet(args.chainId)
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return Promise.resolve(WalletDeviceType.Browser)
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

  async confirm(address: AccountAddress): Promise<string> {
    return Promise.resolve(
      `0x${Buffer.from(
        `Confirmation for ${address} at time: ${Date.now()}`,
      ).toString('hex')}`,
    )
  }

  // eslint-disable-next-line class-methods-use-this
  async sendEthereumTransaction(
    _transaction: unknown,
    _options: { address: AccountAddress; ethereumChainId: EthereumChainId },
  ): Promise<string> {
    throw new CosmosWalletException(
      new Error(
        'sendEthereumTransaction is not supported. WELLDONE only supports sending cosmos transactions',
      ),
      {
        code: UnspecifiedErrorCode,
        context: WalletAction.SendEthereumTransaction,
      },
    )
  }

  async sendTransaction(
    transaction: DirectSignResponse | TxRaw,
    _options: { address: AccountAddress; chainId: ChainId },
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

  /** @deprecated */
  async signTransaction(
    transaction: { txRaw: TxRaw; accountNumber: number; chainId: string },
    injectiveAddress: AccountAddress,
  ) {
    return this.signCosmosTransaction({
      ...transaction,
      address: injectiveAddress,
    })
  }

  async signCosmosTransaction(transaction: {
    txRaw: TxRaw
    accountNumber: number
    chainId: string
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

  async signEip712TypedData(
    _transaction: string,
    _address: AccountAddress,
  ): Promise<string> {
    throw new CosmosWalletException(
      new Error(
        'WELLDONE wallet does not support signing Ethereum transactions',
      ),
      {
        code: UnspecifiedErrorCode,
        context: WalletAction.SendTransaction,
      },
    )
  }

  async getEthereumChainId(): Promise<string> {
    throw new CosmosWalletException(
      new Error('getEthereumChainId is not supported on WELLDONE Wallet'),
      {
        code: UnspecifiedErrorCode,
        context: WalletAction.GetChainId,
      },
    )
  }

  async getEthereumTransactionReceipt(_txHash: string): Promise<string> {
    throw new CosmosWalletException(
      new Error(
        'getEthereumTransactionReceipt is not supported on WELLDONE Wallet',
      ),
      {
        code: UnspecifiedErrorCode,
        context: WalletAction.GetEthereumTransactionReceipt,
      },
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
