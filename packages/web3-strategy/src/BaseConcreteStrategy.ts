import Web3 from 'web3'
import { ChainId } from '@injectivelabs/ts-types'
import { provider } from 'web3-core'
import { ConcreteStrategyOptions } from './types'

const DEFAULT_POLLING_INTERVAL_MS = 500

export default abstract class BaseConcreteStrategy {
  protected chainId: ChainId

  protected rpcUrls: Record<ChainId, string>

  protected wsRpcUrls: Record<ChainId, string>

  protected pollingInterval: number

  web3ForChainId: Record<ChainId, Web3> = {} as Record<ChainId, Web3>

  web3WsForChainId: Record<ChainId, Web3> = {} as Record<ChainId, Web3>

  constructor({
    chainId,
    options,
  }: {
    chainId: ChainId
    options: ConcreteStrategyOptions
  }) {
    this.chainId = chainId
    this.rpcUrls = options.rpcUrls
    this.wsRpcUrls = options.wsRpcUrls
    this.pollingInterval =
      options.pollingInterval || DEFAULT_POLLING_INTERVAL_MS
  }

  public getWeb3(): Web3 {
    const { web3ForChainId } = this

    if (!web3ForChainId[this.chainId]) {
      return this.getWeb3ForChainId(this.chainId)
    }

    return web3ForChainId[this.chainId]
  }

  public getWeb3ForChainId(chainId: ChainId): Web3 {
    const { web3ForChainId } = this

    if (!web3ForChainId[chainId]) {
      web3ForChainId[chainId] = new Web3(
        this.getWeb3ProviderEngineForRpc({
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

  public getWeb3WsForChainId(chainId: ChainId): Web3 {
    const { web3WsForChainId } = this

    if (!web3WsForChainId[chainId]) {
      web3WsForChainId[chainId] = new Web3(
        this.getWeb3WsProviderEngineForRpc({
          wsRpcUrl: this.wsRpcUrls[chainId],
          pollingInterval: this.pollingInterval,
        }),
      )
    }

    return web3WsForChainId[chainId]
  }

  protected abstract getWeb3ProviderEngineForRpc({
    rpcUrl,
    pollingInterval,
  }: {
    rpcUrl: string
    pollingInterval: number
  }): provider

  protected abstract getWeb3WsProviderEngineForRpc({
    wsRpcUrl,
    pollingInterval,
  }: {
    wsRpcUrl: string
    pollingInterval: number
  }): provider
}
