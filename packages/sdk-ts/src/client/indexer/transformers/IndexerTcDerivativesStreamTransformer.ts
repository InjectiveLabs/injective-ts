import { OrderState } from '../../../types/index.js'
import { IndexerGrpcTcDerivativesTransformer } from './IndexerGrpcTcDerivativesTransformer.js'
import type * as InjectiveTCDerivativesRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_tc_derivatives_rpc_pb'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerTcDerivativesStreamTransformer {
  static orderHistoryStreamCallback = (
    response: InjectiveTCDerivativesRpcPb.StreamOrdersHistoryResponse,
  ) => {
    const order = response.order

    if (order?.state === OrderState.Booked) {
      return
    }

    return {
      operationType: response.operationType,
      timestamp: Number(response.timestamp),
      order: order
        ? IndexerGrpcTcDerivativesTransformer.grpcOrderHistoryToOrderHistory(
            order,
          )
        : undefined,
    }
  }

  static tradesStreamCallback = (
    response: InjectiveTCDerivativesRpcPb.StreamTradesResponse,
  ) => {
    const trade = response.trade

    return {
      operationType: response.operationType,
      timestamp: Number(response.timestamp),
      trade: trade
        ? IndexerGrpcTcDerivativesTransformer.grpcTradeToTrade(trade)
        : undefined,
    }
  }

  static positionsStreamCallback = (
    response: InjectiveTCDerivativesRpcPb.StreamPositionsResponse,
  ) => {
    const position = response.position

    return {
      timestamp: Number(response.timestamp),
      operationType: response.operationType,
      position: position
        ? IndexerGrpcTcDerivativesTransformer.grpcPositionToPosition(position)
        : undefined,
    }
  }

  static ordersStreamCallback = (
    response: InjectiveTCDerivativesRpcPb.StreamOrdersResponse,
  ) => {
    const order = response.order

    return {
      operationType: response.operationType,
      timestamp: Number(response.timestamp),
      order: order
        ? IndexerGrpcTcDerivativesTransformer.grpcDerivativeLimitOrderToDerivativeLimitOrder(
            order,
          )
        : undefined,
    }
  }
}
