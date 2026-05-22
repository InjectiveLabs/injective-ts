import { IndexerGrpcDerivativeTransformer } from './IndexerGrpcDerivativeTransformer.js'
import type * as InjectiveDerivativeExchangeRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_derivative_exchange_rpc_pb'
import type { StreamOperation } from '../../../types/index.js'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerDerivativeStreamTransformer {
  static tradesStreamCallback = (
    response: InjectiveDerivativeExchangeRpcPb.StreamTradesResponse,
  ) => {
    const trade = response.trade

    return {
      trade: trade
        ? IndexerGrpcDerivativeTransformer.grpcTradeToTrade(trade)
        : undefined,
      operation: response.operationType as StreamOperation,
      timestamp: response.timestamp,
    }
  }

  static positionStreamCallback = (
    response: InjectiveDerivativeExchangeRpcPb.StreamPositionsResponse,
  ) => {
    const position = response.position

    return {
      position: position
        ? IndexerGrpcDerivativeTransformer.grpcPositionToPosition(position)
        : undefined,
      timestamp: response.timestamp,
    }
  }

  static ordersStreamCallback = (
    response: InjectiveDerivativeExchangeRpcPb.StreamOrdersResponse,
  ) => {
    const order = response.order

    return {
      order: order
        ? IndexerGrpcDerivativeTransformer.grpcOrderToOrder(order)
        : undefined,
      operation: response.operationType as StreamOperation,
      timestamp: response.timestamp,
    }
  }

  static orderHistoryStreamCallback = (
    response: InjectiveDerivativeExchangeRpcPb.StreamOrdersHistoryResponse,
  ) => {
    const order = response.order

    return {
      order: order
        ? IndexerGrpcDerivativeTransformer.grpcOrderHistoryToOrderHistory(order)
        : undefined,
      operation: response.operationType as StreamOperation,
      timestamp: response.timestamp,
    }
  }

  static orderbookV2StreamCallback = (
    response: InjectiveDerivativeExchangeRpcPb.StreamOrderbookV2Response,
  ) => {
    const orderbook = response.orderbook

    return {
      orderbook: orderbook
        ? IndexerGrpcDerivativeTransformer.grpcOrderbookV2ToOrderbookV2({
            sequence: Number(orderbook.sequence),
            buys: orderbook.buys,
            sells: orderbook.sells,
          })
        : undefined,
      operation: response.operationType as StreamOperation,
      marketId: response.marketId,
      timestamp: response.timestamp,
    }
  }

  static orderbookUpdateStreamCallback = (
    response: InjectiveDerivativeExchangeRpcPb.StreamOrderbookUpdateResponse,
  ) => {
    const orderbook = response.orderbookLevelUpdates

    return {
      orderbook: orderbook
        ? IndexerGrpcDerivativeTransformer.grpcOrderbookV2ToOrderbookV2({
            sequence: Number(orderbook.sequence),
            buys: orderbook.buys,
            sells: orderbook.sells,
          })
        : undefined,
      operation: response.operationType as StreamOperation,
      marketId: response.marketId,
      timestamp: response.timestamp,
    }
  }

  static positionV2StreamCallback = (
    response: InjectiveDerivativeExchangeRpcPb.StreamPositionsV2Response,
  ) => {
    const position = response.position

    return {
      position: position
        ? IndexerGrpcDerivativeTransformer.grpcPositionV2ToPositionV2(position)
        : undefined,
      timestamp: response.timestamp,
      operationType: response.operationType,
    }
  }
}
