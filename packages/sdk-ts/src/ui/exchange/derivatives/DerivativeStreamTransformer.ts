import {
  StreamOrderbookResponse,
  StreamTradesResponse,
  StreamPositionsResponse,
  StreamOrdersResponse,
} from './types'
import { StreamOperation } from '../../../types'
import { DerivativeTransformer } from './DerivativeTransformer'

export class DerivativeStreamTransformer {
  static orderbookStreamCallback = (response: StreamOrderbookResponse) => {
    const orderbook = response.getOrderbook()

    return {
      orderbook: orderbook
        ? DerivativeTransformer.grpcOrderbookToOrderbook({
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
      trade: trade ? DerivativeTransformer.grpcTradeToTrade(trade) : undefined,
      operation: response.getOperationType() as StreamOperation,
      timestamp: response.getTimestamp(),
    }
  }

  static positionStreamCallback = (response: StreamPositionsResponse) => {
    const position = response.getPosition()

    return {
      position: position
        ? DerivativeTransformer.grpcPositionToPosition(position)
        : undefined,
      timestamp: response.getTimestamp(),
    }
  }

  static ordersStreamCallback = (response: StreamOrdersResponse) => {
    const order = response.getOrder()

    return {
      order: order ? DerivativeTransformer.grpcOrderToOrder(order) : undefined,
      operation: response.getOperationType() as StreamOperation,
      timestamp: response.getTimestamp(),
    }
  }
}
