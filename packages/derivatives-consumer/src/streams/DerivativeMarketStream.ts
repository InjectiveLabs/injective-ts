import {
  OrderbookStream,
  OrderbookStreamCallback,
} from './Streams/OrderbookStream'
import { TradeStream, TradeStreamCallback } from './Streams/TradeStream'
import { OrderStream, OrderStreamCallback } from './Streams/OrderStream'
import BaseConsumer from '../BaseConsumer'

export enum DerivativeMarketStreamType {
  Orderbook = 'derivative-market-orderbook',
  Orders = 'derivative-market-orders',
  Trades = 'derivative-market-trades',
  SubaccountOrders = 'derivative-market-subaccount-orders',
  SubaccountTrades = 'derivative-market-subaccount-trades',
}

export class DerivativeMarketStream extends BaseConsumer {
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
