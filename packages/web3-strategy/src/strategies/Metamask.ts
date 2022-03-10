import { isServerSide, sleep } from '@injectivelabs/utils'
import { AccountAddress, ChainId } from '@injectivelabs/ts-types'
import { Web3Exception } from '@injectivelabs/exceptions'
import Web3 from 'web3'
import {
  ConcreteWeb3Strategy,
  Eip1993ProviderWithMetamask,
  WindowWithEip1193Provider,
} from '../types'
import BaseConcreteStrategy from './Base'

const $window = (isServerSide()
  ? {}
  : window) as unknown as WindowWithEip1193Provider

const isMetamaskInstalled = Boolean(
  $window && $window.ethereum && $window.ethereum.isMetaMask,
)

const removeMetamaskFromErrorString = (message: string): string =>
  message.replace('Metamask', '').replace('MetaMask', '')

export default class Metamask
  extends BaseConcreteStrategy
  implements ConcreteWeb3Strategy
{
  private ethereum: Eip1993ProviderWithMetamask

  constructor({ chainId, web3 }: { chainId: ChainId; web3: Web3 }) {
    super({ chainId, web3 })

    this.ethereum = $window.ethereum
  }

  async getAddresses(): Promise<string[]> {
    const { ethereum } = this

    if (!ethereum) {
      throw new Web3Exception('Metamask: You need Metamask extension installed')
    }

    try {
      return await ethereum.request({
        method: 'eth_requestAccounts',
      })
    } catch (e: any) {
      throw new Web3Exception(`Metamask: ${e.message}`)
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async confirm(address: AccountAddress): Promise<string> {
    const { ethereum } = this

    if (!ethereum) {
      throw new Web3Exception('Metamask: You need Metamask extension installed')
    }

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
    const { ethereum } = this

    if (!ethereum) {
      throw new Web3Exception('Metamask: You need Metamask extension installed')
    }

    try {
      return await ethereum.request({
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
    const { ethereum } = this

    if (!ethereum) {
      throw new Web3Exception('Metamask: You need Metamask extension installed')
    }

    try {
      return await ethereum.request({
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
    const { ethereum } = this

    if (!ethereum) {
      throw new Web3Exception('Metamask: You need Metamask extension installed')
    }

    try {
      return ethereum.request({ method: 'net_version' })
    } catch (e: any) {
      throw new Web3Exception(
        `Metamask: ${removeMetamaskFromErrorString(e.message)}`,
      )
    }
  }

  async getChainId(): Promise<string> {
    const { ethereum } = this

    if (!ethereum) {
      throw new Web3Exception('Metamask: You need Metamask extension installed')
    }

    try {
      return ethereum.request({ method: 'eth_chainId' })
    } catch (e: any) {
      throw new Web3Exception(
        `Metamask: ${removeMetamaskFromErrorString(e.message)}`,
      )
    }
  }

  async getTransactionReceipt(txHash: string): Promise<string> {
    const { ethereum } = this

    if (!ethereum) {
      throw new Web3Exception('Metamask: You need Metamask extension installed')
    }

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
    } catch (e: any) {
      throw new Web3Exception(
        `Metamask: ${removeMetamaskFromErrorString(e.message)}`,
      )
    }
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

  isWeb3Connected = (): boolean => isMetamaskInstalled

  isMetamask = (): boolean => true
}
