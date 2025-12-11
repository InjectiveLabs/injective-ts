import type {
  ChainId,
  EvmChainId,
  CosmosChainId,
} from '@injectivelabs/ts-types'
import type {
  WalletMetadata,
  StrategyEmitter,
  WalletEventListener,
  ConcreteWalletStrategyArgs,
  ConcreteEvmWalletStrategyArgs,
  WalletStrategyEmitterEventType,
  ConcreteCosmosWalletStrategyArgs,
} from './types/index.js'

export default abstract class BaseConcreteStrategy {
  protected chainId: ChainId | CosmosChainId

  protected evmChainId?: EvmChainId

  protected listeners: Partial<Record<WalletEventListener, any>> = {}

  public metadata?: WalletMetadata

  /**
   * Optional emitter passed from parent WalletStrategy.
   * When provided, strategies emit events directly on the parent's emitter.
   */
  protected emitter?: StrategyEmitter

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
    this.emitter = args.emitter
  }

  public setMetadata(metadata?: WalletMetadata) {
    this.metadata = metadata
  }

  /**
   * Emit an event from this strategy.
   * If emitter was provided from parent, events go directly to parent.
   */
  protected emit(
    event: WalletStrategyEmitterEventType,
    data?: Record<string, any>,
  ) {
    this.emitter?.emit(event, data)
  }
}
