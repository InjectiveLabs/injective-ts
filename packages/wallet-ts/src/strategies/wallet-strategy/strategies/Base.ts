import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'
import { WalletStrategyEthereumOptions } from '../../types'

export default abstract class BaseConcreteStrategy {
  protected chainId: ChainId

  protected ethereumChainId?: EthereumChainId

  protected constructor({
    ethereumOptions,
    chainId,
  }: {
    chainId: ChainId
    ethereumOptions?: WalletStrategyEthereumOptions
  }) {
    this.ethereumChainId = ethereumOptions
      ? ethereumOptions.ethereumChainId
      : undefined
    this.chainId = chainId
  }
}
