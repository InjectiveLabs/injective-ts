import Web3 from 'web3'
import { ChainId } from '@injectivelabs/ts-types'
import { provider } from 'web3-core'
import ProviderEngine from 'web3-provider-engine'
import NonceTrackerSubprovider from 'web3-provider-engine/subproviders/nonce-tracker'
import SanitizingSubprovider from 'web3-provider-engine/subproviders/sanitizer'
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc'
import WebSocketSubprovider from 'web3-provider-engine/subproviders/websocket'
import { Web3Exception } from '@injectivelabs/exceptions'
import { ConcreteStrategyOptions } from '../types'

const DEFAULT_POLLING_INTERVAL_MS = 500
const DEFAULT_BLOCK_TRACKER = true

export default abstract class BaseConcreteStrategy {
  protected chainId: ChainId

  protected rpcUrls?: Record<ChainId, string>

  protected wsRpcUrls?: Record<ChainId, string>

  protected pollingInterval: number

  protected blockTracker: boolean

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
    this.blockTracker =
      options.blockTracker === undefined
        ? DEFAULT_BLOCK_TRACKER
        : options.blockTracker
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

    if (!this.rpcUrls) {
      throw new Web3Exception(`Please provide rpcUrl for chainId: ${chainId}`)
    }

    if (!web3ForChainId[chainId]) {
      web3ForChainId[chainId] = new Web3(
        this.getWeb3ProviderEngineForRpc({
          rpcUrl: this.rpcUrls[chainId],
          pollingInterval: this.pollingInterval,
          blockTracker: this.blockTracker,
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

    if (!this.wsRpcUrls) {
      throw new Web3Exception(`Please provide wsRpcUrl for chainId: ${chainId}`)
    }

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

  public getWeb3ProviderEngineForRpc = ({
    rpcUrl,
    pollingInterval,
    blockTracker,
  }: {
    rpcUrl: string
    pollingInterval: number
    blockTracker: boolean
  }): provider => {
    const engine = new ProviderEngine({
      pollingInterval,
    })

    engine.addProvider(new NonceTrackerSubprovider())
    engine.addProvider(new SanitizingSubprovider())
    engine.addProvider(new RpcSubprovider({ rpcUrl }))
    engine.start()

    /**
     * --> Hacky Code Ahead <--
     * If we dont want to have a blockTracker,
     * i.e we only need the web3-provider to
     * provide signing and contract calls,
     * we stop the engine to stop the blockTracker
     */
    if (!blockTracker) {
      engine.stop()
    }

    return engine as provider
  }

  public getWeb3WsProviderEngineForRpc = ({
    wsRpcUrl,
    pollingInterval,
  }: {
    wsRpcUrl: string
    pollingInterval: number
  }): provider => {
    const engine = new ProviderEngine({
      pollingInterval,
    })

    engine.addProvider(new WebSocketSubprovider({ rpcUrl: wsRpcUrl }))
    engine.start()

    return engine as provider
  }
}
