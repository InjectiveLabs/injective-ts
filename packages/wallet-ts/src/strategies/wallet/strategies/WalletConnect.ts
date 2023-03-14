/* eslint-disable class-methods-use-this */
import { sleep } from '@injectivelabs/utils'
import {
  AccountAddress,
  ChainId,
  EthereumChainId,
} from '@injectivelabs/ts-types'
import {
  ErrorType,
  MetamaskException,
  UnspecifiedErrorCode,
  WalletException,
} from '@injectivelabs/exceptions'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3 from 'web3'
import { provider, TransactionConfig } from 'web3-core'
import { DirectSignResponse } from '@cosmjs/proto-signing'
import { TxRaw, TxResponse } from '@injectivelabs/sdk-ts'
import {
  ConcreteWalletStrategy,
  EthereumWalletStrategyArgs,
  WalletStrategyEthereumOptions,
} from '../../types'
import BaseConcreteStrategy from './Base'
import { WalletAction, WalletDeviceType } from '../../../types/enums'

export default class WalletConnect
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  private walletConnectProvider: WalletConnectProvider

  protected web3: Web3

  private readonly ethereumOptions: WalletStrategyEthereumOptions | undefined

  constructor(args: EthereumWalletStrategyArgs) {
    super(args)
    this.ethereumOptions = args.ethereumOptions
    this.walletConnectProvider = this.createWalletConnectProvider()
    this.web3 = new Web3(this.walletConnectProvider as unknown as provider)
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return Promise.resolve(WalletDeviceType.Browser)
  }

  async disconnect(): Promise<void> {
    const provider = await this.getWalletConnectProvider()

    await provider.disconnect()

    /**
     * WalletConnect will not display QRModal again with the
     * same instance for some reason,
     * so it's necessary to destroy the instance
     */
    this.walletConnectProvider = this.createWalletConnectProvider()
  }

  async getAddresses(): Promise<string[]> {
    await this.getWalletConnectProvider()

    try {
      return await this.web3.eth.getAccounts()
    } catch (e: unknown) {
      throw new MetamaskException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetAccounts,
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
    const provider = await this.getWalletConnectProvider()

    try {
      return await provider.request({
        jsonrpc: '2.0',
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

  async sendEthereumTransaction(
    transaction: unknown,
    _options: { address: AccountAddress; ethereumChainId: EthereumChainId },
  ): Promise<string> {
    await this.getWalletConnectProvider()
    const transactionConfig = transaction as TransactionConfig

    transactionConfig.gas = parseInt(
      transactionConfig.gas as string,
      16,
    ).toString(10)
    transactionConfig.maxFeePerGas = parseInt(
      transactionConfig.maxFeePerGas as string,
      16,
    ).toString(10)

    try {
      const txHash = await this.web3.eth.sendTransaction(transactionConfig)

      return txHash.transactionHash
    } catch (e: unknown) {
      throw new MetamaskException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SendEthereumTransaction,
      })
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async sendTransaction(
    _transaction: unknown,
    _options: { address: AccountAddress; chainId: ChainId },
  ): Promise<TxResponse> {
    throw new MetamaskException(
      new Error(
        'sendTransaction is not supported. WalletConnect only supports sending transaction to Ethereum',
      ),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SendTransaction,
      },
    )
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

  async getEthereumTransactionReceipt(txHash: string): Promise<string> {
    const provider = await this.getWalletConnectProvider()

    const interval = 1000
    const transactionReceiptRetry = async () => {
      const receipt = await provider.request({
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

  async getNetworkId(): Promise<string> {
    await this.getWalletConnectProvider()

    try {
      const result = await this.web3.eth.net.getId()

      return result.toString()
    } catch (e: unknown) {
      throw new MetamaskException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetNetworkId,
      })
    }
  }

  async getChainId(): Promise<string> {
    await this.getWalletConnectProvider()

    try {
      const result = await this.web3.eth.getChainId()

      return result.toString()
    } catch (e: unknown) {
      throw new MetamaskException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetChainId,
      })
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async getPubKey(): Promise<string> {
    throw new WalletException(
      new Error('You can only fetch PubKey from Cosmos native wallets'),
    )
  }

  onAccountChange(callback: (account: AccountAddress) => void): void {
    this.walletConnectProvider?.on('accountsChanged', callback)
  }

  private async getWalletConnectProvider(): Promise<WalletConnectProvider> {
    if (this.walletConnectProvider) {
      /**
       * WalletConnect seems to have a problem with connecting
       * multiple times with the same instance, hence it's necessary
       * to create a new one each time user wants to connect
       */
      if (this.walletConnectProvider.connected) {
        this.walletConnectProvider = this.createWalletConnectProvider()
      }

      await this.walletConnectProvider.enable()

      return this.walletConnectProvider
    }

    throw new WalletException(
      new Error('walletConnectProvider not initialized'),
    )
  }

  private createWalletConnectProvider() {
    const { ethereumOptions } = this

    if (!ethereumOptions) {
      throw new WalletException(new Error('Please provide Ethereum options'))
    }

    return new WalletConnectProvider({
      rpc: {
        [ethereumOptions.ethereumChainId]: ethereumOptions.rpcUrl,
      },
    }) as WalletConnectProvider
  }
}
