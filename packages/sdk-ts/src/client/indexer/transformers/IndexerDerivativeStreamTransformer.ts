import { StreamOperation } from '../../../types/index.js'
import { IndexerGrpcDerivativeTransformer } from './IndexerGrpcDerivativeTransformer.js'
import { InjectiveDerivativeExchangeRpc } from '@injectivelabs/indexer-proto-ts'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerDerivativeStreamTransformer {
  static tradesStreamCallback = (
    response: InjectiveDerivativeExchangeRpc.StreamTradesResponse,
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
    response: InjectiveDerivativeExchangeRpc.StreamPositionsResponse,
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
    response: InjectiveDerivativeExchangeRpc.StreamOrdersResponse,
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
    response: InjectiveDerivativeExchangeRpc.StreamOrdersHistoryResponse,
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
    response: InjectiveDerivativeExchangeRpc.StreamOrderbookV2Response,
  ) => {
    const orderbook = response.orderbook

    return {
      orderbook: orderbook
        ? IndexerGrpcDerivativeTransformer.grpcOrderbookV2ToOrderbookV2({
            sequence: parseInt(orderbook.sequence, 10),
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
    response: InjectiveDerivativeExchangeRpc.StreamOrderbookUpdateResponse,
  ) => {
    const orderbook = response.orderbookLevelUpdates

    return {
      orderbook: orderbook
        ? IndexerGrpcDerivativeTransformer.grpcOrderbookV2ToOrderbookV2({
            sequence: parseInt(orderbook.sequence, 10),
            buys: orderbook.buys,
            sells: orderbook.sells,
          })
        : undefined,
      operation: response.operationType as StreamOperation,
      marketId: response.marketId,
      timestamp: response.timestamp,
    }
  }
}
