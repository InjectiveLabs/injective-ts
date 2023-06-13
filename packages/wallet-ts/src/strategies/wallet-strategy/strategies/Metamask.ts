/* eslint-disable class-methods-use-this */
import { sleep } from '@injectivelabs/utils'
import {
  AccountAddress,
  ChainId,
  EthereumChainId,
} from '@injectivelabs/ts-types'
import {
  WalletException,
  ErrorType,
  MetamaskException,
  UnspecifiedErrorCode,
  TransactionException,
} from '@injectivelabs/exceptions'
import { DirectSignResponse } from '@cosmjs/proto-signing'
import {
  TxGrpcApi,
  TxRaw,
  TxResponse,
  isServerSide,
} from '@injectivelabs/sdk-ts'
import { ConcreteWalletStrategy, EthereumWalletStrategyArgs } from '../../types'
import {
  Eip1993ProviderWithMetamask,
  WindowWithEip1193Provider,
} from '../types'
import BaseConcreteStrategy from './Base'
import { WalletAction, WalletDeviceType } from '../../../types/enums'

const $window = (isServerSide()
  ? {}
  : window) as unknown as WindowWithEip1193Provider

export default class Metamask
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  private ethereum: Eip1993ProviderWithMetamask

  constructor(args: EthereumWalletStrategyArgs) {
    super(args)
    this.ethereum = $window.ethereum
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return Promise.resolve(WalletDeviceType.Browser)
  }

  async getAddresses(): Promise<string[]> {
    const ethereum = this.getEthereum()

    try {
      return await ethereum.request({
        method: 'eth_requestAccounts',
      })
    } catch (e: unknown) {
      throw new MetamaskException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetAccounts,
      })
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async confirm(address: AccountAddress): Promise<string> {
    return Promise.resolve(
      `0x${Buffer.from(
        `Confirmation for ${address} at time: ${Date.now()}`,
      ).toString('hex')}`,
    )
  }

  async sendEthereumTransaction(
    transaction: unknown,
    _options: { address: AccountAddress; ethereumChainId: EthereumChainId },
  ): Promise<string> {
    const ethereum = this.getEthereum()

    try {
      return await ethereum.request({
        method: 'eth_sendTransaction',
        params: [transaction],
      })
    } catch (e: unknown) {
      throw new MetamaskException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SendEthereumTransaction,
      })
    }
  }

  async sendTransaction(
    transaction: TxRaw,
    options: {
      address: AccountAddress
      chainId: ChainId
      endpoints?: {
        rest: string
        grpc: string
        tm?: string
      }
    },
  ): Promise<TxResponse> {
    const { endpoints } = options

    if (!endpoints) {
      throw new WalletException(
        new Error(
          'You have to pass endpoints within the options for using Ethereum native wallets',
        ),
      )
    }

    const txApi = new TxGrpcApi(endpoints.grpc)
    const response = await txApi.broadcast(transaction)

    if (response.code !== 0) {
      throw new TransactionException(new Error(response.rawLog), {
        code: UnspecifiedErrorCode,
        contextCode: response.code,
        contextModule: response.codespace,
      })
    }

    return response
  }

  /** @deprecated */
  async signTransaction(
    eip712json: string,
    address: AccountAddress,
  ): Promise<string> {
    return this.signEip712TypedData(eip712json, address)
  }

  async signEip712TypedData(
    eip712json: string,
    address: AccountAddress,
  ): Promise<string> {
    const ethereum = this.getEthereum()

    try {
      return await ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [address, eip712json],
      })
    } catch (e: unknown) {
      throw new MetamaskException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignTransaction,
      })
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async signCosmosTransaction(_transaction: {
    txRaw: TxRaw
    accountNumber: number
    chainId: string
    address: string
  }): Promise<DirectSignResponse> {
    throw new WalletException(
      new Error('This wallet does not support signing Cosmos transactions'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SendTransaction,
      },
    )
  }

  async getEthereumChainId(): Promise<string> {
    const ethereum = this.getEthereum()

    try {
      return ethereum.request({ method: 'eth_chainId' })
    } catch (e: unknown) {
      throw new MetamaskException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetChainId,
      })
    }
  }

  async getEthereumTransactionReceipt(txHash: string): Promise<string> {
    const ethereum = this.getEthereum()

    const interval = 1000
    const transactionReceiptRetry = async () => {
      const receipt = await ethereum.request({
        method: 'eth_getTransactionReceipt',
        params: [txHash],
      })

      if (!receipt) {
        await sleep(interval)
        await transactionReceiptRetry()
      }

      return receipt
    }

    try {
      return await transactionReceiptRetry()
    } catch (e: unknown) {
      throw new MetamaskException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetEthereumTransactionReceipt,
      })
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async getPubKey(): Promise<string> {
    throw new WalletException(
      new Error('You can only fetch PubKey from Cosmos native wallets'),
    )
  }

  onChainIdChanged(callback: () => void): void {
    const { ethereum } = this

    if (!ethereum) {
      return
    }

    ethereum.on('chainChanged', callback)
  }

  onAccountChange(callback: (account: AccountAddress) => void): void {
    const { ethereum } = this

    if (!ethereum) {
      return
    }

    ethereum.on('accountsChanged', callback)
  }

  cancelOnChainIdChange(): void {
    const { ethereum } = this

    if (ethereum) {
      // ethereum.removeListener('chainChanged', handler)
    }
  }

  cancelOnAccountChange(): void {
    const { ethereum } = this

    if (ethereum) {
      // ethereum.removeListener('chainChanged', handler)
    }
  }

  cancelAllEvents(): void {
    const { ethereum } = this

    if (ethereum) {
      ethereum.removeAllListeners()
    }
  }

  private getEthereum(): Eip1993ProviderWithMetamask {
    const { ethereum } = this

    if (!ethereum) {
      throw new MetamaskException(
        new Error('Please install the Metamask wallet extension.'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
          contextModule: WalletAction.GetAccounts,
        },
      )
    }

    return ethereum
  }
}
