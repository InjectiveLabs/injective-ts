import { sleep } from '@injectivelabs/utils'
import { AccountAddress } from '@injectivelabs/ts-types'
import { Web3Exception } from '@injectivelabs/exceptions'
import ProviderEngine from 'web3-provider-engine'
import NonceTrackerSubprovider from 'web3-provider-engine/subproviders/nonce-tracker'
import SanitizingSubprovider from 'web3-provider-engine/subproviders/sanitizer'
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc'
import WebSocketSubprovider from 'web3-provider-engine/subproviders/websocket'
import { provider } from 'web3-core'
import {
  ConcreteWeb3Strategy,
  Eip1993ProviderWithMetamask,
  WindowWithEip1193Provider,
} from '../types/index'

const Window = (window as unknown) as WindowWithEip1193Provider

const isMetamaskInstalled = Boolean(
  Window && Window.ethereum && Window.ethereum.isMetaMask,
)

export default class Metamask implements ConcreteWeb3Strategy {
  private ethereum: Eip1993ProviderWithMetamask

  constructor() {
    if (!isMetamaskInstalled) {
      throw new Web3Exception('Metamask is not installed.')
    }

    this.ethereum = Window.ethereum
  }

  async getAddresses(): Promise<string[]> {
    return this.ethereum.request({
      method: 'eth_requestAccounts',
    })
  }

  async confirm(address: AccountAddress): Promise<string> {
    return this.ethereum.request({
      method: 'personal_sign',
      params: [address, `Confirmation for ${address} at time: ${Date.now()}`],
    })
  }

  async sendTransaction(
    transaction: unknown,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _address: AccountAddress,
  ): Promise<string> {
    return this.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transaction],
    })
  }

  async signTypedDataV4(
    eip712json: string,
    address: AccountAddress,
  ): Promise<string> {
    return this.ethereum.request({
      method: 'eth_signTypedData_v4',
      params: [address, eip712json],
    })
  }

  async getNetworkId(): Promise<string> {
    return this.ethereum.request({ method: 'net_version' })
  }

  async getChainId(): Promise<string> {
    return this.ethereum.request({ method: 'eth_chainId' })
  }

  async getTransactionReceipt(txHash: string) {
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

    return transactionReceiptRetry()
  }

  onChainChanged(callback: () => void) {
    this.ethereum.on('chainChanged', callback)
  }

  onAccountChanged(callback: (account: AccountAddress) => void) {
    this.ethereum.on('accountsChanged', callback)
  }

  getWeb3ProviderEngineForRpc = ({
    rpcUrl,
    pollingInterval,
  }: {
    rpcUrl: string
    pollingInterval: number
  }) => {
    const engine = new ProviderEngine({
      pollingInterval,
    })

    engine.addProvider(new NonceTrackerSubprovider())
    engine.addProvider(new SanitizingSubprovider())
    engine.addProvider(new RpcSubprovider({ rpcUrl }))
    engine.start()

    return engine as provider
  }

  getWeb3WsProviderEngineForRpc = ({
    wsRpcUrl,
    pollingInterval,
  }: {
    wsRpcUrl: string
    pollingInterval: number
  }) => {
    const engine = new ProviderEngine({
      pollingInterval,
    })

    engine.addProvider(new WebSocketSubprovider({ rpcUrl: wsRpcUrl }))
    engine.start()

    return engine as provider
  }

  isWeb3Connected = (): boolean => {
    return isMetamaskInstalled
  }

  isMetamask = (): boolean => {
    return true
  }
}
