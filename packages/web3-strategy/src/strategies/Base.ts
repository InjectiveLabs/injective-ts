import Web3 from 'web3'
import { ChainId } from '@injectivelabs/ts-types'

export default abstract class BaseConcreteStrategy {
  protected chainId: ChainId

  protected web3: Web3

  protected rpcEndpoints?: {
    wsRpcUrl: string
    rpcUrl: string
  }

  protected constructor({
    chainId,
    web3,
    rpcEndpoints,
  }: {
    chainId: ChainId
    web3: Web3
    rpcEndpoints?: {
      wsRpcUrl: string
      rpcUrl: string
    }
  }) {
    this.chainId = chainId
    this.web3 = web3
    this.rpcEndpoints = rpcEndpoints
  }

  getWeb3(): Web3 {
    return this.web3
  }
}
