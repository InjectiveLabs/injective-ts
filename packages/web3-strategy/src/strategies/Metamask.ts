import { isServerSide, sleep } from '@injectivelabs/utils'
import { AccountAddress, ChainId } from '@injectivelabs/ts-types'
import { Web3Exception } from '@injectivelabs/exceptions'
import {
  ConcreteStrategyOptions,
  ConcreteWeb3Strategy,
  Eip1993ProviderWithMetamask,
  WindowWithEip1193Provider,
} from '../types'
import BaseConcreteStrategy from '../BaseConcreteStrategy'

const $window = ((isServerSide()
  ? {}
  : window) as unknown) as WindowWithEip1193Provider

const isMetamaskInstalled = Boolean(
  $window && $window.ethereum && $window.ethereum.isMetaMask,
)

const removeMetamaskFromErrorString = (message: string): string =>
  message.replace('Metamask', '').replace('MetaMask', '')

export default class Metamask
  extends BaseConcreteStrategy
  implements ConcreteWeb3Strategy {
  private ethereum: Eip1993ProviderWithMetamask

  constructor({
    chainId,
    options,
  }: {
    chainId: ChainId
    options: ConcreteStrategyOptions
  }) {
    super({ chainId, options })

    if (!$window || !isMetamaskInstalled) {
      throw new Web3Exception('Metamask: You need Metamask extension installed')
    }

    this.ethereum = $window.ethereum
  }

  async getAddresses(): Promise<string[]> {
    try {
      return await this.ethereum.request({
        method: 'eth_requestAccounts',
      })
    } catch (e: any) {
      throw new Web3Exception(`Metamask: ${e.message}`)
    }
  }

  async confirm(address: AccountAddress): Promise<string> {
    try {
      return await this.ethereum.request({
        method: 'personal_sign',
        params: [address, `Confirmation for ${address} at time: ${Date.now()}`],
      })
    } catch (e: any) {
      throw new Web3Exception(
        `Metamask: ${removeMetamaskFromErrorString(e.message)}`,
      )
    }
  }

  async sendTransaction(
    transaction: unknown,
    _options: { address: AccountAddress; chainId: ChainId },
  ): Promise<string> {
    try {
      return await this.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transaction],
      })
    } catch (e: any) {
      throw new Web3Exception(
        `Metamask: ${removeMetamaskFromErrorString(e.message)}`,
      )
    }
  }

  async signTypedDataV4(
    eip712json: string,
    address: AccountAddress,
  ): Promise<string> {
    try {
      return await this.ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [address, eip712json],
      })
    } catch (e: any) {
      throw new Web3Exception(
        `Metamask: ${removeMetamaskFromErrorString(e.message)}`,
      )
    }
  }

  async getNetworkId(): Promise<string> {
    try {
      return this.ethereum.request({ method: 'net_version' })
    } catch (e: any) {
      throw new Web3Exception(
        `Metamask: ${removeMetamaskFromErrorString(e.message)}`,
      )
    }
  }

  async getChainId(): Promise<string> {
    try {
      return this.ethereum.request({ method: 'eth_chainId' })
    } catch (e: any) {
      throw new Web3Exception(
        `Metamask: ${removeMetamaskFromErrorString(e.message)}`,
      )
    }
  }

  async getTransactionReceipt(txHash: string): Promise<string> {
    const interval = 1000
    const transactionReceiptRetry = async () => {
      const receipt = await this.ethereum.request({
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
      throw new Web3Exception(
        `Metamask: ${removeMetamaskFromErrorString(e.message)}`,
      )
    }
  }

  onChainChanged(callback: () => void): void {
    this.ethereum.on('chainChanged', callback)
  }

  onAccountChanged(callback: (account: AccountAddress) => void): void {
    this.ethereum.on('accountsChanged', callback)
  }

  setOptions = (_options: ConcreteStrategyOptions): void => {
    //
  }

  isWeb3Connected = (): boolean => isMetamaskInstalled

  isMetamask = (): boolean => true
}
