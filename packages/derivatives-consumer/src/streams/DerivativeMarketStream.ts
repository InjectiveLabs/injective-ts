import {
  OrderbookStream,
  OrderbookStreamCallback,
} from './Streams/OrderbookStream'
import { TradeStream, TradeStreamCallback } from './Streams/TradeStream'
import { OrderStream, OrderStreamCallback } from './Streams/OrderStream'
import BaseConsumer from '../BaseConsumer'
import {
  PositionStream,
  PositionStreamCallback,
} from './Streams/PositionStream'

export enum DerivativeMarketStreamType {
  Orderbook = 'derivative-market-orderbook',
  Orders = 'derivative-market-orders',
  Trades = 'derivative-market-trades',
  Positions = 'derivative-market-positions',
  SubaccountOrders = 'derivative-market-subaccount-orders',
  SubaccountTrades = 'derivative-market-subaccount-trades',
  SubaccountPositions = 'derivative-market-subaccount-positions',
}

export class DerivativeMarketStream extends BaseConsumer {
  orderbook: OrderbookStream

  orders: OrderStream

  trades: TradeStream

  positions: PositionStream

  constructor(endpoint: string) {
    super(endpoint)

    this.orderbook = new OrderbookStream(this.endpoint)
    this.orders = new OrderStream(this.endpoint)
    this.trades = new TradeStream(this.endpoint)
    this.positions = new PositionStream(this.endpoint)
  }
}

export {
  OrderbookStreamCallback,
  PositionStreamCallback,
  TradeStreamCallback,
  OrderStreamCallback,
}
