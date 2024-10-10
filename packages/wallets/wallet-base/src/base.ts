import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'
import { WalletEventListener, WalletStrategyArguments } from './types'

export default abstract class BaseConcreteStrategy {
  protected chainId: ChainId

  protected ethereumChainId?: EthereumChainId

  protected listeners: Partial<Record<WalletEventListener, any>> = {}

  protected constructor({ chainId, ethereumOptions }: WalletStrategyArguments) {
    this.ethereumChainId = ethereumOptions
      ? ethereumOptions.ethereumChainId
      : undefined
    this.chainId = chainId
  }
}
