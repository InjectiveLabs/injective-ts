import { ChainId, CosmosChainId, EthereumChainId } from '@injectivelabs/ts-types'
import {
  WalletEventListener,
  ConcreteWalletStrategyArgs,
  ConcreteCosmosWalletStrategyArgs,
  ConcreteEthereumWalletStrategyArgs,
} from './types/index.js'

export default abstract class BaseConcreteStrategy {
  protected chainId: ChainId | CosmosChainId

  protected ethereumChainId?: EthereumChainId

  protected listeners: Partial<Record<WalletEventListener, any>> = {}

  protected constructor(args: ConcreteWalletStrategyArgs | ConcreteEthereumWalletStrategyArgs | ConcreteCosmosWalletStrategyArgs) {
    this.ethereumChainId = 'ethereumOptions' in args && args.ethereumOptions
      ? args.ethereumOptions.ethereumChainId
      : undefined
    this.chainId = args.chainId
  }
}
