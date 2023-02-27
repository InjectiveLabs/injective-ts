import {
  StreamOrderbookResponse,
  StreamTradesResponse,
  StreamPositionsResponse,
  StreamOrdersResponse,
  StreamOrdersHistoryResponse,
  StreamOrderbookV2Response,
  StreamOrderbookUpdateResponse,
} from '@injectivelabs/indexer-proto-ts/injective_derivative_exchange_rpc'
import { StreamOperation } from '../../../types/index'
import { IndexerGrpcDerivativeTransformer } from './IndexerGrpcDerivativeTransformer'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerDerivativeStreamTransformer {
  static orderbookStreamCallback = (response: StreamOrderbookResponse) => {
    const orderbook = response.orderbook

    return {
      orderbook: orderbook
        ? IndexerGrpcDerivativeTransformer.grpcOrderbookToOrderbook({
            buys: orderbook.buys,
            sells: orderbook.sells,
          })
        : undefined,
      operation: response.operationType as StreamOperation,
      marketId: response.marketId,
      timestamp: response.timestamp,
    }
  }

  static tradesStreamCallback = (response: StreamTradesResponse) => {
    const trade = response.trade

    return {
      trade: trade
        ? IndexerGrpcDerivativeTransformer.grpcTradeToTrade(trade)
        : undefined,
      operation: response.operationType as StreamOperation,
      timestamp: response.timestamp,
    }
  }

  static positionStreamCallback = (response: StreamPositionsResponse) => {
    const position = response.position

    return {
      position: position
        ? IndexerGrpcDerivativeTransformer.grpcPositionToPosition(position)
        : undefined,
      timestamp: response.timestamp,
    }
  }

  static ordersStreamCallback = (response: StreamOrdersResponse) => {
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
    response: StreamOrdersHistoryResponse,
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

  static orderbookV2StreamCallback = (response: StreamOrderbookV2Response) => {
    const orderbook = response.orderbook

    return {
      orderbook: orderbook
        ? IndexerGrpcDerivativeTransformer.grpcOrderbookV2ToOrderbookV2({
            sequence: orderbook.sequence,
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
    response: StreamOrderbookUpdateResponse,
  ) => {
    const orderbook = response.getOrderbookLevelUpdates()

    return {
      orderbook: orderbook
        ? IndexerGrpcDerivativeTransformer.grpcOrderbookV2ToOrderbookV2({
            sequence: orderbook.getSequence(),
            buys: orderbook.getBuysList(),
            sells: orderbook.getSellsList(),
          })
        : undefined,
      operation: response.getOperationType() as StreamOperation,
      marketId: response.getMarketId(),
      timestamp: response.getTimestamp(),
    }
  }
}
