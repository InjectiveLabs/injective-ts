import Web3 from 'web3'
import { ChainId } from '@injectivelabs/ts-types'

export default abstract class BaseConcreteStrategy {
  protected chainId: ChainId

  protected web3: Web3

  protected constructor({
    chainId,
    web3Creator,
  }: {
    chainId: ChainId
    web3Creator: () => Web3
  }) {
    this.chainId = chainId
    this.web3 = web3Creator()
  }

  getWeb3(): Web3 {
    return this.web3
  }
}
