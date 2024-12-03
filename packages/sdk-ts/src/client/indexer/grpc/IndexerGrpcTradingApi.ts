import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { InjectiveTradingRpc } from '@injectivelabs/indexer-proto-ts'
import BaseGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import { IndexerModule, MarketType, GridStrategyType } from '../types/index.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcTradingApi extends BaseGrpcConsumer {
  protected module: string = IndexerModule.Trading

  protected client: InjectiveTradingRpc.InjectiveTradingRPCClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new InjectiveTradingRpc.InjectiveTradingRPCClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchTradingStats() {
    const request = InjectiveTradingRpc.GetTradingStatsRequest.create()

    try {
      const response =
        await this.retry<InjectiveTradingRpc.GetTradingStatsResponse>(() =>
          this.client.GetTradingStats(request),
        )

      return response
    } catch (e: unknown) {
      if (e instanceof InjectiveTradingRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'TradingStats',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'TradingStats',
        contextModule: this.module,
      })
    }
  }

  async fetchGridStrategies({
    skip,
    state,
    limit,
    withTvl,
    endTime,
    marketId,
    startTime,
    marketType,
    strategyType,
    subaccountId,
    accountAddress,
    withPerformance,
    pendingExecution,
    lastExecutedTime,
    isTrailingStrategy,
  }: {
    skip?: number
    state?: string
    limit?: number
    endTime?: number
    withTvl?: boolean
    marketId?: string
    startTime?: number
    marketType?: MarketType
    subaccountId?: string
    strategyType?: GridStrategyType[]
    accountAddress?: string
    withPerformance?: boolean
    pendingExecution?: boolean
    lastExecutedTime?: number
    isTrailingStrategy?: boolean
  }) {
    const request = InjectiveTradingRpc.ListTradingStrategiesRequest.create()

    if (accountAddress) {
      request.accountAddress = accountAddress
    }

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    if (strategyType) {
      request.strategyType = strategyType
    }

    if (marketType) {
      request.marketType = marketType
    }

    if (state) {
      request.state = state
    }

    if (limit) {
      request.limit = limit
    }

    if (skip) {
      request.skip = skip.toString()
    }

    if (marketId) {
      request.marketId = marketId
    }

    if (withTvl) {
      request.withTvl = withTvl
    }

    if (withPerformance) {
      request.withPerformance = withPerformance
    }

    if (isTrailingStrategy) {
      request.isTrailingStrategy = isTrailingStrategy
    }

    if (startTime) {
      request.startTime = startTime.toString()
    }

    if (endTime) {
      request.endTime = endTime.toString()
    }

    if (pendingExecution) {
      request.pendingExecution = pendingExecution
    }

    if (lastExecutedTime) {
      request.lastExecutedTime = lastExecutedTime.toString()
    }

    try {
      const response =
        await this.retry<InjectiveTradingRpc.ListTradingStrategiesResponse>(
          () => this.client.ListTradingStrategies(request),
        )

      return response
    } catch (e: unknown) {
      if (e instanceof InjectiveTradingRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'GridStrategies',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GridStrategies',
        contextModule: this.module,
      })
    }
  }
}
