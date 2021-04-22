import {
  SpotMarketOrderbookStream,
  SpotMarketOrderbookStreamCallback,
} from './SpotMarket/SpotMarketOrderbookStream'
import {
  SpotMarketTradeStream,
  SpotMarketTradeStreamCallback,
} from './SpotMarket/SpotMarketTradeStream'
import {
  SpotMarketOrderStream,
  SpotMarketOrderStreamCallback,
} from './SpotMarket/SpotMarketOrderStream'
import BaseConsumer from '../BaseConsumer'

export enum SpotMarketStreamType {
  Orderbook = 'spot-market-orderbook',
  Orders = 'spot-market-orders',
  Trades = 'spot-market-trades',
  SubaccountOrders = 'spot-market-subaccount-orders',
  SubaccountTrades = 'spot-market-subaccount-trades',
}

export class SpotMarketStream extends BaseConsumer {
  orderbook: SpotMarketOrderbookStream

  orders: SpotMarketOrderStream

  trades: SpotMarketTradeStream

  constructor(endpoint: string) {
    super(endpoint)

    this.orderbook = new SpotMarketOrderbookStream(this.endpoint)
    this.orders = new SpotMarketOrderStream(this.endpoint)
    this.trades = new SpotMarketTradeStream(this.endpoint)
  }
}

export {
  SpotMarketOrderbookStreamCallback,
  SpotMarketTradeStreamCallback,
  SpotMarketOrderStreamCallback,
}
