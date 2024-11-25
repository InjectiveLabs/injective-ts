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
    accountAddress,
    subaccountId,
    state,
    marketId,
    limit,
    skip,
    marketType,
    strategyType,
  }: {
    accountAddress?: string
    subaccountId?: string
    state?: string
    marketId?: string
    limit?: number
    skip?: number
    marketType?: MarketType
    strategyType?: GridStrategyType[]
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
