import * as InjectiveTCDerivativesRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_tc_derivatives_rpc_pb'
import { InjectiveTCDerivativesRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_tc_derivatives_rpc_pb.client'
import { IndexerModule } from '../types/index.js'
import BaseIndexerGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import { IndexerGrpcTcDerivativesTransformer } from '../transformers/index.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcTcDerivativesApi extends BaseIndexerGrpcConsumer {
  protected module: string = IndexerModule.TcDerivatives

  private get client() {
    return this.initClient(InjectiveTCDerivativesRPCClient)
  }

  async fetchOrdersHistory(params?: {
    token?: string
    perPage?: number
    marketId?: string
    direction?: string
    accountAddress?: string
  }) {
    const { token, perPage, marketId, direction, accountAddress } = params || {}

    const request = InjectiveTCDerivativesRpcPb.OrdersHistoryRequest.create()

    if (marketId) {
      request.marketIds = [marketId]
    }

    if (direction) {
      request.direction = direction
    }

    if (accountAddress) {
      request.accountAddress = accountAddress
    }

    if (perPage) {
      request.perPage = perPage
    }

    if (token) {
      request.token = token
    }

    const response = await this.executeGrpcCall<
      InjectiveTCDerivativesRpcPb.OrdersHistoryRequest,
      InjectiveTCDerivativesRpcPb.OrdersHistoryResponse
    >(request, this.client.ordersHistory.bind(this.client))

    return IndexerGrpcTcDerivativesTransformer.ordersHistoryResponseToOrdersHistory(
      response,
    )
  }

  async fetchTradesHistory(params?: {
    token?: string
    sortBy?: string
    endTime?: number
    perPage?: number
    withPnl?: boolean
    marketId?: string
    rfqMaker?: string
    startTime?: number
    direction?: string
    participant?: string
    sortDirection?: string
    accountAddress?: string
  }) {
    const {
      token,
      sortBy,
      withPnl,
      endTime,
      perPage,
      marketId,
      startTime,
      direction,
      rfqMaker,
      participant,
      sortDirection,
      accountAddress,
    } = params || {}

    const request = InjectiveTCDerivativesRpcPb.TradesRequest.create()

    if (marketId) {
      request.marketIds = [marketId]
    }

    if (direction) {
      request.direction = direction
    }

    if (accountAddress) {
      request.accountAddress = accountAddress
    }

    if (participant) {
      request.participant = participant
    }

    if (perPage) {
      request.perPage = perPage
    }

    if (token) {
      request.token = token
    }

    if (sortBy) {
      request.sortBy = sortBy
    }

    if (sortDirection) {
      request.sortDirection = sortDirection
    }

    if (withPnl) {
      request.withPnl = withPnl
    }

    if (rfqMaker) {
      request.rfqMaker = rfqMaker
    }

    if (startTime !== undefined) {
      request.startTime = BigInt(startTime)
    }

    if (endTime !== undefined) {
      request.endTime = BigInt(endTime)
    }

    const response = await this.executeGrpcCall<
      InjectiveTCDerivativesRpcPb.TradesRequest,
      InjectiveTCDerivativesRpcPb.TradesResponse
    >(request, this.client.trades.bind(this.client))

    return IndexerGrpcTcDerivativesTransformer.tradesResponseToTrades(response)
  }

  async fetchPositions(params?: {
    token?: string
    perPage?: number
    marketId?: string
    withUpnl?: boolean
    direction?: string
    withCount?: boolean
    accountAddress?: string
  }) {
    const {
      marketId,
      direction,
      perPage,
      token,
      accountAddress,
      withCount,
      withUpnl,
    } = params || {}

    const request = InjectiveTCDerivativesRpcPb.PositionsRequest.create()

    if (marketId) {
      request.marketIds = [marketId]
    }

    if (direction) {
      request.direction = direction
    }

    if (accountAddress) {
      request.accountAddress = accountAddress
    }

    if (withCount !== undefined) {
      request.withCount = withCount
    }

    if (withUpnl !== undefined) {
      request.withUpnl = withUpnl
    }

    if (perPage) {
      request.perPage = perPage
    }

    if (token) {
      request.token = token
    }

    const response = await this.executeGrpcCall<
      InjectiveTCDerivativesRpcPb.PositionsRequest,
      InjectiveTCDerivativesRpcPb.PositionsResponse
    >(request, this.client.positions.bind(this.client))

    return IndexerGrpcTcDerivativesTransformer.positionsResponseToPositions(
      response,
    )
  }

  async fetchOrders(params?: {
    token?: string
    perPage?: number
    marketId?: string
    direction?: string
    accountAddress?: string
  }) {
    const { marketId, direction, perPage, token, accountAddress } = params || {}

    const request = InjectiveTCDerivativesRpcPb.OrdersRequest.create()

    if (marketId) {
      request.marketIds = [marketId]
    }

    if (direction) {
      request.direction = direction
    }

    if (accountAddress) {
      request.accountAddress = accountAddress
    }

    if (perPage) {
      request.perPage = perPage
    }

    if (token) {
      request.token = token
    }

    const response = await this.executeGrpcCall<
      InjectiveTCDerivativesRpcPb.OrdersRequest,
      InjectiveTCDerivativesRpcPb.OrdersResponse
    >(request, this.client.orders.bind(this.client))

    return IndexerGrpcTcDerivativesTransformer.ordersResponseToOrders(response)
  }

  async fetchFundingPayments(params?: {
    token?: string
    perPage?: number
    marketId?: string
  }) {
    const { marketId, perPage, token } = params || {}

    const request = InjectiveTCDerivativesRpcPb.FundingPaymentsRequest.create()

    if (marketId) {
      request.marketIds = [marketId]
    }

    if (perPage) {
      request.perPage = perPage
    }

    if (token) {
      request.token = token
    }

    const response = await this.executeGrpcCall<
      InjectiveTCDerivativesRpcPb.FundingPaymentsRequest,
      InjectiveTCDerivativesRpcPb.FundingPaymentsResponse
    >(request, this.client.fundingPayments.bind(this.client))

    return IndexerGrpcTcDerivativesTransformer.fundingPaymentsResponseToFundingPayments(
      response,
    )
  }
}
