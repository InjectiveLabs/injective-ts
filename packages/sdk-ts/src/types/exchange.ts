import { OrderMask } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/exchange'

export enum TradeExecutionType {
  Market = 'market',
  LimitFill = 'limitFill',
  LimitMatchRestingOrder = 'limitMatchRestingOrder',
  LimitMatchNewOrder = 'limitMatchNewOrder',
}

export enum TradeExecutionSide {
  Maker = 'maker',
  Taker = 'taker',
}

export enum TradeDirection {
  Buy = 'buy',
  Sell = 'sell',
  Long = 'long',
  Short = 'short',
}

export { OrderMask }
