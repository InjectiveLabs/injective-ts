import {
  OrderbookStream,
  OrderbookStreamCallback,
} from './Streams/OrderbookStream'
import { TradeStream, TradeStreamCallback } from './Streams/TradeStream'
import { OrderStream, OrderStreamCallback } from './Streams/OrderStream'
import BaseConsumer from '../BaseConsumer'

export enum SpotMarketStreamType {
  Orderbook = 'spot-market-orderbook',
  Orders = 'spot-market-orders',
  Trades = 'spot-market-trades',
  SubaccountOrders = 'spot-market-subaccount-orders',
  SubaccountTrades = 'spot-market-subaccount-trades',
}

export class SpotMarketStream extends BaseConsumer {
  orderbook: OrderbookStream

  orders: OrderStream

  trades: TradeStream

  constructor(endpoint: string) {
    super(endpoint)

    this.orderbook = new OrderbookStream(this.endpoint)
    this.orders = new OrderStream(this.endpoint)
    this.trades = new TradeStream(this.endpoint)
  }
}

export { OrderbookStreamCallback, TradeStreamCallback, OrderStreamCallback }
