import Web3 from 'web3'
import { ChainId } from '@injectivelabs/ts-types'
import { createAlchemyWeb3 } from '@alch/alchemy-web3'
import { ConcreteStrategyOptions } from '../types'

export default abstract class BaseConcreteStrategy {
  protected chainId: ChainId

  protected rpcUrl: string

  protected wsRpcUrl: string

  web3: Web3

  constructor({
    chainId,
    options,
  }: {
    chainId: ChainId
    options: ConcreteStrategyOptions
  }) {
    this.chainId = chainId
    this.rpcUrl = options.rpcUrl
    this.wsRpcUrl = options.wsRpcUrl
    this.web3 = createAlchemyWeb3(
      this.wsRpcUrl || this.rpcUrl,
    ) as unknown as Web3
  }

  public getWeb3(): Web3 {
    return this.web3
  }
}
