import {
  StreamTradesResponse,
  StreamOrdersResponse,
  StreamOrderbookResponse,
  StreamOrderbookV2Response,
  StreamOrdersHistoryResponse,
  StreamOrderbookUpdateResponse,
} from '@injectivelabs/indexer-proto-ts/injective_spot_exchange_rpc'
import { StreamOperation } from '../../../types'
import { IndexerGrpcSpotTransformer } from './IndexerGrpcSpotTransformer'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerSpotStreamTransformer {
  static orderbookStreamCallback = (response: StreamOrderbookResponse) => {
    const orderbook = response.orderbook

    return {
      orderbook: orderbook
        ? IndexerGrpcSpotTransformer.grpcOrderbookToOrderbook({
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
        ? IndexerGrpcSpotTransformer.grpcTradeToTrade(trade)
        : undefined,
      operation: response.operationType as StreamOperation,
      timestamp: response.timestamp,
    }
  }

  static ordersStreamCallback = (response: StreamOrdersResponse) => {
    const order = response.order

    return {
      order: order
        ? IndexerGrpcSpotTransformer.grpcOrderToOrder(order)
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
        ? IndexerGrpcSpotTransformer.grpcOrderHistoryToOrderHistory(order)
        : undefined,
      operation: response.operationType as StreamOperation,
      timestamp: response.timestamp,
    }
  }

  static orderbookV2StreamCallback = (response: StreamOrderbookV2Response) => {
    const orderbook = response.orderbook

    return {
      orderbook: orderbook
        ? IndexerGrpcSpotTransformer.grpcOrderbookV2ToOrderbookV2({
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
