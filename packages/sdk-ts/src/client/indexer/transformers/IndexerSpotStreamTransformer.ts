import { IndexerGrpcSpotTransformer } from './IndexerGrpcSpotTransformer.js'
import type * as InjectiveSpotExchangeRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_spot_exchange_rpc_pb'
import type { StreamOperation } from '../../../types/index.js'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerSpotStreamTransformer {
  static tradesStreamCallback = (
    response: InjectiveSpotExchangeRpcPb.StreamTradesResponse,
  ) => {
    const trade = response.trade

    return {
      trade: trade
        ? IndexerGrpcSpotTransformer.grpcTradeToTrade(trade)
        : undefined,
      operation: response.operationType as StreamOperation,
      timestamp: response.timestamp,
    }
  }

  static ordersStreamCallback = (
    response: InjectiveSpotExchangeRpcPb.StreamOrdersResponse,
  ) => {
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
    response: InjectiveSpotExchangeRpcPb.StreamOrdersHistoryResponse,
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

  static orderbookV2StreamCallback = (
    response: InjectiveSpotExchangeRpcPb.StreamOrderbookV2Response,
  ) => {
    const orderbook = response.orderbook

    return {
      orderbook: orderbook
        ? IndexerGrpcSpotTransformer.grpcOrderbookV2ToOrderbookV2({
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
    response: InjectiveSpotExchangeRpcPb.StreamOrderbookUpdateResponse,
  ) => {
    const orderbook = response.orderbookLevelUpdates

    return {
      orderbook: orderbook
        ? IndexerGrpcSpotTransformer.grpcOrderbookV2ToOrderbookV2({
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
}
