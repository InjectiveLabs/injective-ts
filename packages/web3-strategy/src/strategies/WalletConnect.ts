import { sleep } from '@injectivelabs/utils'
import { AccountAddress, ChainId } from '@injectivelabs/ts-types'
import { Web3Exception } from '@injectivelabs/exceptions'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3 from 'web3'
import { TransactionConfig } from 'web3-core'
import { ConcreteWeb3Strategy } from '../types'
import BaseConcreteStrategy from './Base'

export default class WalletConnect
  extends BaseConcreteStrategy
  implements ConcreteWeb3Strategy
{
  private connected = false

  private readonly provider: WalletConnectProvider

  constructor(args: {
    chainId: ChainId
    web3: Web3
    rpcEndpoints: {
      wsRpcUrl: string
      rpcUrl: string
    }
  }) {
    super(args)
    const { chainId, rpcEndpoints } = args

    this.provider = new WalletConnectProvider({
      rpc: {
        [chainId]: rpcEndpoints.rpcUrl,
      },
    })
    this.web3 = new Web3(this.provider as any)
  }

  private async connect(): Promise<void> {
    if (this.connected) {
      return
    }

    await this.provider.enable()

    this.connected = true
  }

  async disconnect(): Promise<void> {
    await this.provider.disconnect()

    this.connected = false
  }

  getWeb3(): Web3 {
    return this.web3
  }

  async getAddresses(): Promise<string[]> {
    await this.connect()

    try {
      return await this.provider.request({
        method: 'eth_accounts',
      })
    } catch (e: any) {
      throw new Web3Exception(`Metamask: ${e.message}`)
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

  async sendTransaction(
    transaction: unknown,
    _options: { address: AccountAddress; chainId: ChainId },
  ): Promise<string> {
    await this.connect()

    try {
      const txHash = await this.web3.eth.sendTransaction(
        transaction as TransactionConfig,
      )
      return txHash.toString()
    } catch (e: any) {
      throw new Web3Exception(`WalletConnect: ${e.message}`)
    }
  }

  async signTypedDataV4(
    eip712json: string,
    address: AccountAddress,
  ): Promise<string> {
    await this.connect()

    const object = JSON.parse(eip712json)
    const compatibleObject = {
      ...object,
      domain: {
        ...object.domain,
        salt: Date.now().toString(),
      },
    }
    const stringifiedObject = JSON.stringify(compatibleObject)

    try {
      return await this.provider.request({
        method: 'eth_signTypedData',
        params: [address, stringifiedObject],
      })
    } catch (e: any) {
      throw new Web3Exception(`WalletConnect: ${e.message}`)
    }
  }

  async getTransactionReceipt(txHash: string): Promise<string> {
    await this.connect()

    const interval = 1000
    const transactionReceiptRetry = async () => {
      const receipt = await this.provider.request({
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

  onAccountChange(callback: (account: AccountAddress) => void): void {
    this.provider.on('accountsChanged', callback)
  }

  cancelOnChainIdChange = (): void => {
    //
  }

  cancelOnAccountChange = (): void => {
    //
  }

  cancelAllEvents = (): void => {
    //
  }

  isWeb3Connected = (): boolean => this.connected

  isMetamask = (): boolean => false
}
