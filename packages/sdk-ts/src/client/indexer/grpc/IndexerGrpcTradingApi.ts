import * as InjectiveTradingRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_trading_rpc_pb'
import { InjectiveTradingRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_trading_rpc_pb.client'
import { IndexerModule } from '../types/index.js'
import BaseIndexerGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import type { MarketType, GridStrategyType } from '../types/index.js'
import type { GrpcWebTransportAdditionalOptions } from '../../../utils/grpc.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcTradingApi extends BaseIndexerGrpcConsumer {
  protected module: string = IndexerModule.Trading

  private client: InjectiveTradingRPCClient

  constructor(endpoint: string, options?: GrpcWebTransportAdditionalOptions) {
    super(endpoint, options)
    this.client = new InjectiveTradingRPCClient(this.transport)
  }

  async fetchTradingStats() {
    const request = InjectiveTradingRpcPb.GetTradingStatsRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveTradingRpcPb.GetTradingStatsRequest,
      InjectiveTradingRpcPb.GetTradingStatsResponse
    >(request, this.client.getTradingStats.bind(this.client))

    return response
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
    const request = InjectiveTradingRpcPb.ListTradingStrategiesRequest.create()

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
      request.skip = BigInt(skip)
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
      request.startTime = BigInt(startTime)
    }

    if (endTime) {
      request.endTime = BigInt(endTime)
    }

    if (pendingExecution) {
      request.pendingExecution = pendingExecution
    }

    if (lastExecutedTime) {
      request.lastExecutedTime = BigInt(lastExecutedTime)
    }

    const response = await this.executeGrpcCall<
      InjectiveTradingRpcPb.ListTradingStrategiesRequest,
      InjectiveTradingRpcPb.ListTradingStrategiesResponse
    >(request, this.client.listTradingStrategies.bind(this.client))

    return response
  }
}
