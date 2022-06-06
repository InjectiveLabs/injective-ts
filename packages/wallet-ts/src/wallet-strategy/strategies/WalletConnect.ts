import { sleep } from '@injectivelabs/utils'
import {
  AccountAddress,
  ChainId,
  EthereumChainId,
} from '@injectivelabs/ts-types'
import { Web3Exception } from '@injectivelabs/exceptions'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3 from 'web3'
import { TransactionConfig } from 'web3-core'
import { ConcreteWalletStrategy, WalletOptions } from '../types'

export default class WalletConnect implements ConcreteWalletStrategy {
  private walletConnectProvider: WalletConnectProvider | undefined

  private web3: Web3 | undefined

  private readonly walletOptions: WalletOptions

  private createWalletConnectProvider() {
    this.walletConnectProvider = new WalletConnectProvider({
      rpc: this.walletOptions.rpcUrls,
    })
    this.web3 = new Web3(this.walletConnectProvider as any)
  }

  constructor(args: {
    chainId: ChainId
    ethereumChainId: EthereumChainId
    walletOptions: WalletOptions
  }) {
    this.walletOptions = args.walletOptions
    this.createWalletConnectProvider()
  }

  private async connect(): Promise<void> {
    if (!this.walletConnectProvider?.connected) {
      // WalletConnect seems to have a problem with connecting multiple times with the same instance, hence it's necessary
      // to create a new one each time user wants to connect
      this.createWalletConnectProvider()
      await this.walletConnectProvider?.enable()
    }
  }

  async disconnect(): Promise<void> {
    await this.walletConnectProvider?.disconnect()
    // walletConnect will not display QRModal again with the same instance for some reason, so it's necessary to destroy the instance
    this.createWalletConnectProvider()
  }

  getWeb3(): Web3 {
    if (this.web3) {
      return this.web3
    }
    throw new Web3Exception(
      `WalletConnect must be connected before web3 instance can be used`,
    )
  }

  async getAddresses(): Promise<string[]> {
    await this.connect()

    try {
      return await this.web3!.eth.getAccounts()
    } catch (e: any) {
      throw new Web3Exception(`WalletConnect: ${e.message}`)
    }
  }

  async confirm(address: AccountAddress): Promise<string> {
    await this.connect()

    return Promise.resolve(
      `0x${Buffer.from(
        `Confirmation for ${address} at time: ${Date.now()}`,
      ).toString('hex')}`,
    )
  }

  /**
   * When using Ethereum based wallets, the cosmos transaction
   * is being converted to EIP712 and then sent for signing
   */
  async signTransaction(
    eip712json: string,
    address: AccountAddress,
  ): Promise<string> {
    await this.connect()

    try {
      return await this.walletConnectProvider!.request({
        method: 'eth_signTypedData',
        params: [address, eip712json],
      })
    } catch (e: any) {
      throw new Web3Exception(`WalletConnect: ${e.message}`)
    }
  }

  async sendEthereumTransaction(
    transaction: unknown,
    _options: { address: AccountAddress; ethereumChainId: EthereumChainId },
  ): Promise<string> {
    await this.connect()

    const transactionConfig = transaction as TransactionConfig

    transactionConfig.gas = parseInt(
      transactionConfig.gas as string,
      16,
    ).toString(10)
    transactionConfig.maxFeePerGas = parseInt(
      transactionConfig.maxFeePerGas as string,
      16,
    ).toString(10)

    // walletConnect doesn't seem to support hex format, so it's necessay to convert to decimal
    try {
      const txHash = await this.web3!.eth.sendTransaction(transactionConfig)
      return txHash.transactionHash
    } catch (e: any) {
      throw new Web3Exception(`WalletConnect: ${e.message}`)
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async sendTransaction(
    _transaction: unknown,
    _options: { address: AccountAddress; chainId: ChainId },
  ): Promise<string> {
    throw new Error(
      'sendTransaction is not supported. Wallet only supports sending transaction to Ethereum',
    )
  }

  async getEthereumTransactionReceipt(txHash: string): Promise<string> {
    await this.connect()

    const interval = 1000
    const transactionReceiptRetry = async () => {
      const receipt = await this.walletConnectProvider!.request({
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
    } catch (e: any) {
      throw new Web3Exception(`WalletConnect: ${e.message}`)
    }
  }

  async getNetworkId(): Promise<string> {
    await this.connect()

    try {
      const result = await this.web3!.eth.net.getId()

      return result.toString()
    } catch (e: any) {
      throw new Web3Exception(e.message)
    }
  }

  async getChainId(): Promise<string> {
    await this.connect()

    try {
      const result = await this.web3!.eth.getChainId()

      return result.toString()
    } catch (e: any) {
      throw new Web3Exception(e.message)
    }
  }

  onAccountChange(callback: (account: AccountAddress) => void): void {
    this.walletConnectProvider?.on('accountsChanged', callback)
  }
}
