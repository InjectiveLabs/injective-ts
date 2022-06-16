import {
  StreamOrderbookResponse,
  StreamTradesResponse,
  StreamPositionsResponse,
  StreamOrdersResponse,
} from '@injectivelabs/exchange-api/injective_derivative_exchange_rpc_pb'
import { StreamOperation } from '../../../types/index'
import { ExchangeGrpcBinaryOptionsTransformer } from './ExchangeGrpcBinaryOptionsTransformer'

export class BinaryOptionsStreamTransformer {
  static orderbookStreamCallback = (response: StreamOrderbookResponse) => {
    const orderbook = response.getOrderbook()

    return {
      orderbook: orderbook
        ? ExchangeGrpcBinaryOptionsTransformer.grpcOrderbookToOrderbook({
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
        ? ExchangeGrpcBinaryOptionsTransformer.grpcTradeToTrade(trade)
        : undefined,
      operation: response.getOperationType() as StreamOperation,
      timestamp: response.getTimestamp(),
    }
  }

  static positionStreamCallback = (response: StreamPositionsResponse) => {
    const position = response.getPosition()

    return {
      position: position
        ? ExchangeGrpcBinaryOptionsTransformer.grpcPositionToPosition(position)
        : undefined,
      timestamp: response.getTimestamp(),
    }
  }

  static ordersStreamCallback = (response: StreamOrdersResponse) => {
    const order = response.getOrder()

    return {
      order: order
        ? ExchangeGrpcBinaryOptionsTransformer.grpcOrderToOrder(order)
        : undefined,
      operation: response.getOperationType() as StreamOperation,
      timestamp: response.getTimestamp(),
    }
  }
}
