import Web3 from 'web3'
import { AccountAddress, ChainId } from '@injectivelabs/ts-types'
import Metamask from './strategies/Metamask'
// import Testnet from './strategies/Testnet'
import {
  Wallet,
  ConcreteWeb3Strategy,
  onAccountChangeCallback,
  onChainIdChangeCallback,
} from './types'

const DEFAULT_POLLING_INTERVAL_MS = 500

export default class Web3Strategy {
  private strategy: ConcreteWeb3Strategy

  private chainId: ChainId

  private wallet: Wallet

  private rpcUrls: Record<ChainId, string>

  private wsRpcUrls: Record<ChainId, string>

  private pollingInterval: number

  private web3ForChainId: Record<ChainId, Web3> = {} as Record<ChainId, Web3>

  constructor({
    wallet,
    chainId,
    rpcUrls,
    wsRpcUrls,
    pollingInterval = DEFAULT_POLLING_INTERVAL_MS,
  }: {
    wallet: Wallet
    chainId: ChainId
    rpcUrls: Record<ChainId, string>
    wsRpcUrls: Record<ChainId, string>
    pollingInterval: number
  }) {
    this.chainId = chainId
    this.wallet = wallet
    this.rpcUrls = rpcUrls
    this.wsRpcUrls = wsRpcUrls
    this.pollingInterval = pollingInterval

    switch (this.wallet) {
      case Wallet.Testnet:
        this.strategy = new Metamask()
        break
      case Wallet.Metamask:
        this.strategy = new Metamask()
        break
      default:
        this.strategy = new Metamask()
        break
    }
  }

  public getWeb3(): Web3 {
    const { web3ForChainId } = this

    if (!web3ForChainId[this.chainId]) {
      return this.getWeb3ForChainId(this.chainId)
    }

    return web3ForChainId[this.chainId]
  }

  public getWeb3ForChainId(chainId: ChainId) {
    const { web3ForChainId } = this

    if (!web3ForChainId[chainId]) {
      web3ForChainId[chainId] = new Web3(
        this.strategy.getWeb3ProviderEngineForRpc({
          rpcUrl: this.rpcUrls[chainId],
          pollingInterval: this.pollingInterval,
        }),
      )
    }

    return web3ForChainId[chainId]
  }

  public getWeb3Ws(): Web3 {
    const { web3ForChainId } = this

    if (!web3ForChainId[this.chainId]) {
      return this.getWeb3WsForChainId(this.chainId)
    }

    return web3ForChainId[this.chainId]
  }

  public getWeb3WsForChainId(chainId: ChainId) {
    const { web3ForChainId } = this

    if (!web3ForChainId[chainId]) {
      web3ForChainId[chainId] = new Web3(
        this.strategy.getWeb3WsProviderEngineForRpc({
          wsRpcUrl: this.wsRpcUrls[chainId],
          pollingInterval: this.pollingInterval,
        }),
      )
    }

    return web3ForChainId[chainId]
  }

  public getStrategy(): ConcreteWeb3Strategy {
    return this.strategy
  }

  public getAddresses(): Promise<AccountAddress[]> {
    return this.strategy.getAddresses()
  }

  public isWeb3Connected(): boolean {
    return this.strategy.isWeb3Connected()
  }

  public getChainId(): Promise<string> {
    return this.strategy.getChainId()
  }

  public getNetworkId(): Promise<string> {
    return this.strategy.getNetworkId()
  }

  public getTransactionReceipt(txHash: string): void {
    return this.strategy.getTransactionReceipt(txHash)
  }

  public async confirm(address: AccountAddress): Promise<string> {
    return this.strategy.confirm(address)
  }

  public async sendTransaction(
    tx: unknown,
    address: AccountAddress,
  ): Promise<string> {
    return this.strategy.sendTransaction(tx, address)
  }

  public async signTypedData(
    data: string,
    address: AccountAddress,
  ): Promise<string> {
    return this.strategy.signTypedDataV4(data, address)
  }

  public onAccountChange(callback: onAccountChangeCallback): void {
    return this.strategy.onAccountChanged(callback)
  }

  public onChainChange(callback: onChainIdChangeCallback): void {
    return this.strategy.onChainChanged(callback)
  }
}
