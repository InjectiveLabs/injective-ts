import { sleep } from '@injectivelabs/utils'
import { AccountAddress, ChainId } from '@injectivelabs/ts-types'
import { Web3Exception } from '@injectivelabs/exceptions'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3 from 'web3'
// @ts-ignore
import ProviderEngine from 'web3-provider-engine'
import { TransactionConfig } from 'web3-core'
import { ConcreteWeb3Strategy } from '../types'

export default class WalletConnect implements ConcreteWeb3Strategy {
  private connected = false

  private readonly walletConnectProvider: WalletConnectProvider

  private readonly web3: Web3

  // private readonly chainId: ChainId

  constructor({ chainId, rpcUrl }: { chainId: ChainId; rpcUrl: string }) {
    // this.chainId = chainId
    this.walletConnectProvider = new WalletConnectProvider({
      rpc: {
        [chainId]: rpcUrl,
      },
    })
    this.web3 = new Web3(this.walletConnectProvider as ProviderEngine)
  }

  private async connect(): Promise<void> {
    if (this.connected) {
      return
    }
    await this.walletConnectProvider.enable()
    this.connected = true
  }

  async disconnect(): Promise<void> {
    await this.walletConnectProvider.disconnect()
    this.connected = false
  }

  getWeb3(): Web3 {
    return this.web3
  }

  async getAddresses(): Promise<string[]> {
    await this.connect()

    // try {
    //   return await this.web3.eth.getAccounts()
    // } catch (e: any) {
    //   throw new Web3Exception(`WalletConnect: ${e.message}`)
    // }
    try {
      return await this.walletConnectProvider.request({
        method: 'eth_requestAccounts',
      })
    } catch (e: any) {
      throw new Web3Exception(`Metamask: ${e.message}`)
    }
  }

  // @ts-ignore
  async confirm(address: AccountAddress): Promise<string> {
    await this.connect()
    return Promise.resolve(
      `0x${Buffer.from(
        `Confirmation for ${address} at time: ${Date.now()}`,
      ).toString('hex')}`,
    )
  }

  async sendTransaction(
    transaction: unknown,
    _options: { address: AccountAddress; chainId: ChainId },
  ): Promise<string> {
    await this.connect()
    console.log(transaction)
    try {
      const txHash = await this.web3.eth.sendTransaction(
        transaction as TransactionConfig,
      )
      // const txHash = await this.walletConnectProvider.request(transaction)
      // const txHash = await this.web3.eth.sendTransaction(transaction)
      return txHash.toString()
    } catch (e: any) {
      throw new Web3Exception(`WalletConnect: ${e.message}`)
    }
    // const { ethereum } = this
    //
    // if (!ethereum) {
    //   throw new Web3Exception('Metamask: You need Metamask extension installed')
    // }
    //
    // try {
    //   return await ethereum.request({
    //     method: 'eth_sendTransaction',
    //     params: [transaction],
    //   })
    // } catch (e: any) {
    //   throw new Web3Exception(
    //     `Metamask: ${removeMetamaskFromErrorString(e.message)}`,
    //   )
    // }
  }

  async signTypedDataV4(
    eip712json: string,
    address: AccountAddress,
  ): Promise<string> {
    await this.connect()
    console.log(eip712json)
    console.log(address)

    try {
      return await this.walletConnectProvider.request({
        method: 'eth_signTypedData_v4',
        params: [address, eip712json],
      })
    } catch (e: any) {
      throw new Web3Exception(`WalletConnect: ${e.message}`)
    }
  }

  async getTransactionReceipt(txHash: string): Promise<string> {
    await this.connect()

    const interval = 1000
    const transactionReceiptRetry = async () => {
      const receipt = await this.walletConnectProvider.request({
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
      const result = await this.web3.eth.net.getId()
      return result.toString()
    } catch (e: any) {
      throw new Web3Exception(e.message)
    }
  }

  async getChainId(): Promise<string> {
    await this.connect()
    try {
      const result = await this.web3.eth.getChainId()
      return result.toString()
    } catch (e: any) {
      throw new Web3Exception(e.message)
    }
  }

  // onChainIdChanged(_callback: () => void): void {
  //   // const { ethereum } = this
  //   //
  //   // if (!ethereum) {
  //   //   return
  //   // }
  //   //
  //   // ethereum.on('chainChanged', callback)
  // }

  // eslint-disable-next-line class-methods-use-this
  onAccountChange(callback: (account: AccountAddress) => void): void {
    this.walletConnectProvider.on('accountsChanged', callback)
  }

  // eslint-disable-next-line class-methods-use-this
  cancelOnChainIdChange(): void {
    // const { ethereum } = this
    //
    // if (ethereum) {
    //   // ethereum.removeListener('chainChanged', handler)
    // }
  }

  // eslint-disable-next-line class-methods-use-this
  cancelOnAccountChange(): void {
    // const { ethereum } = this
    //
    // if (ethereum) {
    //   // ethereum.removeListener('chainChanged', handler)
    // }
  }

  // eslint-disable-next-line class-methods-use-this
  cancelAllEvents(): void {
    // const { ethereum } = this
    //
    // if (ethereum) {
    //   ethereum.removeAllListeners()
    // }
  }

  isWeb3Connected = (): boolean => this.connected

  isMetamask = (): boolean => true
}
