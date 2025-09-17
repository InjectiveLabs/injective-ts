import type {
  ChainId,
  EvmChainId,
  CosmosChainId,
} from '@injectivelabs/ts-types'
import type {
  WalletMetadata,
  WalletEventListener,
  ConcreteWalletStrategyArgs,
  ConcreteEvmWalletStrategyArgs,
  ConcreteCosmosWalletStrategyArgs,
} from './types/index.js'

export default abstract class BaseConcreteStrategy {
  protected chainId: ChainId | CosmosChainId

  protected evmChainId?: EvmChainId

  protected listeners: Partial<Record<WalletEventListener, any>> = {}

  public metadata?: WalletMetadata

  public constructor(
    args:
      | ConcreteWalletStrategyArgs
      | ConcreteEvmWalletStrategyArgs
      | ConcreteCosmosWalletStrategyArgs,
  ) {
    this.evmChainId =
      'evmOptions' in args && args.evmOptions
        ? args.evmOptions.evmChainId
        : undefined
    this.chainId = args.chainId
    this.metadata = args.metadata
  }
}
