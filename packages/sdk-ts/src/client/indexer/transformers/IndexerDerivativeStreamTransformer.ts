import {
  StreamOrderbookResponse,
  StreamTradesResponse,
  StreamPositionsResponse,
  StreamOrdersResponse,
  StreamOrdersHistoryResponse,
} from '@injectivelabs/indexer-api/injective_derivative_exchange_rpc_pb'
import {
  StreamOrderbookV2Response,
  StreamOrderbookUpdateResponse,
} from '@injectivelabs/indexer-api/injective_spot_exchange_rpc_pb'
import { StreamOperation } from '../../../types/index'
import { IndexerGrpcDerivativeTransformer } from './IndexerGrpcDerivativeTransformer'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerDerivativeStreamTransformer {
  static orderbookStreamCallback = (response: StreamOrderbookResponse) => {
    const orderbook = response.getOrderbook()

    return {
      orderbook: orderbook
        ? IndexerGrpcDerivativeTransformer.grpcOrderbookToOrderbook({
            buys: orderbook.getBuysList(),
            sells: orderbook.getSellsList(),
          })
        : undefined,
      operation: response.getOperationType() as StreamOperation,
      marketId: response.getMarketId(),
      timestamp: response.getTimestamp(),
    }
  }

  static tradesStreamCallback = (response: StreamTradesResponse) => {
    const trade = response.getTrade()

    return {
      trade: trade
        ? IndexerGrpcDerivativeTransformer.grpcTradeToTrade(trade)
        : undefined,
      operation: response.getOperationType() as StreamOperation,
      timestamp: response.getTimestamp(),
    }
  }

  static positionStreamCallback = (response: StreamPositionsResponse) => {
    const position = response.getPosition()

    return {
      position: position
        ? IndexerGrpcDerivativeTransformer.grpcPositionToPosition(position)
        : undefined,
      timestamp: response.getTimestamp(),
    }
  }

  static ordersStreamCallback = (response: StreamOrdersResponse) => {
    const order = response.getOrder()

    return {
      order: order
        ? IndexerGrpcDerivativeTransformer.grpcOrderToOrder(order)
        : undefined,
      operation: response.getOperationType() as StreamOperation,
      timestamp: response.getTimestamp(),
    }
  }

  static orderHistoryStreamCallback = (
    response: StreamOrdersHistoryResponse,
  ) => {
    const order = response.getOrder()

    return {
      order: order
        ? IndexerGrpcDerivativeTransformer.grpcOrderHistoryToOrderHistory(order)
        : undefined,
      operation: response.getOperationType() as StreamOperation,
      timestamp: response.getTimestamp(),
    }
  }

  static orderbookV2StreamCallback = (response: StreamOrderbookV2Response) => {
    const orderbook = response.getOrderbook()

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
