import Web3 from 'web3'
import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'

export default abstract class BaseConcreteStrategy {
  protected ethereumChainId: EthereumChainId

  protected chainId: ChainId

  protected web3: Web3

  protected constructor({
    ethereumChainId,
    chainId,
    web3,
  }: {
    ethereumChainId: EthereumChainId
    chainId: ChainId
    web3: Web3
  }) {
    this.ethereumChainId = ethereumChainId
    this.chainId = chainId
    this.web3 = web3
  }

  getWeb3(): Web3 {
    return this.web3
  }
}
