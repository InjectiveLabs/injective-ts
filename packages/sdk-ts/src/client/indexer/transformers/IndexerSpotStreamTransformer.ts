import {
  StreamTradesResponse,
  StreamOrdersResponse,
  StreamOrderbookResponse,
  StreamOrderbookV2Response,
  StreamOrdersHistoryResponse,
  StreamOrderbookUpdateResponse,
} from '@injectivelabs/indexer-api/injective_spot_exchange_rpc_pb'
import { StreamOperation } from '../../../types'
import { IndexerGrpcSpotTransformer } from './IndexerGrpcSpotTransformer'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerSpotStreamTransformer {
  static orderbookStreamCallback = (response: StreamOrderbookResponse) => {
    const orderbook = response.getOrderbook()

    return {
      orderbook: orderbook
        ? IndexerGrpcSpotTransformer.grpcOrderbookToOrderbook({
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
        ? IndexerGrpcSpotTransformer.grpcTradeToTrade(trade)
        : undefined,
      operation: response.getOperationType() as StreamOperation,
      timestamp: response.getTimestamp(),
    }
  }

  static ordersStreamCallback = (response: StreamOrdersResponse) => {
    const order = response.getOrder()

    return {
      order: order
        ? IndexerGrpcSpotTransformer.grpcOrderToOrder(order)
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
        ? IndexerGrpcSpotTransformer.grpcOrderHistoryToOrderHistory(order)
        : undefined,
      operation: response.getOperationType() as StreamOperation,
      timestamp: response.getTimestamp(),
    }
  }

  static orderbookV2StreamCallback = (response: StreamOrderbookV2Response) => {
    const orderbook = response.getOrderbook()

    return {
      orderbook: orderbook
        ? IndexerGrpcSpotTransformer.grpcOrderbookV2ToOrderbookV2({
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
        ? IndexerGrpcSpotTransformer.grpcOrderbookV2ToOrderbookV2({
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
