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
    direction?: string
    marketIds?: string[]
  }) {
    const { marketIds, direction, perPage, token } = params || {}

    const request = InjectiveTCDerivativesRpcPb.OrdersHistoryRequest.create()

    if (marketIds) {
      request.marketIds = marketIds
    }

    if (direction) {
      request.direction = direction
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

  async fetchTrades(params?: {
    token?: string
    perPage?: number
    direction?: string
    marketIds?: string[]
  }) {
    const { marketIds, direction, perPage, token } = params || {}

    const request = InjectiveTCDerivativesRpcPb.TradesRequest.create()

    if (marketIds) {
      request.marketIds = marketIds
    }

    if (direction) {
      request.direction = direction
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
    direction?: string
    marketIds?: string[]
  }) {
    const { marketIds, direction, perPage, token } = params || {}

    const request = InjectiveTCDerivativesRpcPb.PositionsRequest.create()

    if (marketIds) {
      request.marketIds = marketIds
    }

    if (direction) {
      request.direction = direction
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
}
