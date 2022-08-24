import {
  StreamOrderbookResponse,
  StreamTradesResponse,
  StreamOrdersResponse,
} from '@injectivelabs/exchange-api/injective_spot_exchange_rpc_pb'
import { StreamOperation } from '../../../types'
import { ExchangeGrpcSpotTransformer } from './ExchangeGrpcSpotTransformer'

/**
 * @category Exchange Grpc Stream Transformer
 */
export class SpotStreamTransformer {
  static orderbookStreamCallback = (response: StreamOrderbookResponse) => {
    const orderbook = response.getOrderbook()

    return {
      orderbook: orderbook
        ? ExchangeGrpcSpotTransformer.grpcOrderbookToOrderbook({
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
        ? ExchangeGrpcSpotTransformer.grpcTradeToTrade(trade)
        : undefined,
      operation: response.getOperationType() as StreamOperation,
      timestamp: response.getTimestamp(),
    }
  }

  static ordersStreamCallback = (response: StreamOrdersResponse) => {
    const order = response.getOrder()

    return {
      order: order
        ? ExchangeGrpcSpotTransformer.grpcOrderToOrder(order)
        : undefined,
      operation: response.getOperationType() as StreamOperation,
      timestamp: response.getTimestamp(),
    }
  }
}
