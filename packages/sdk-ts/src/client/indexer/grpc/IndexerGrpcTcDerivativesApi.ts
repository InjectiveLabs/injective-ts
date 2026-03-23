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
    perPage?: number
    marketId?: string
    direction?: string
    accountAddress?: string
  }) {
    const { marketId, direction, perPage, token, accountAddress } = params || {}

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

    if (perPage) {
      request.perPage = perPage
    }

    if (token) {
      request.token = token
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
    direction?: string
    withCount?: boolean
    accountAddress?: string
  }) {
    const { marketId, direction, perPage, token, accountAddress, withCount } =
      params || {}

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
}
