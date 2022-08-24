import { OrderMaskMap } from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'

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

export enum OrderMask {
  Unused = 0,
  Any = 1,
  Regular = 2,
  Conditional = 4,
  DirectionBuyOrHigher = 8,
  DirectionSellOrLower = 16,
  TypeMarket = 32,
  TypeLimit = 64,
}

export { OrderMaskMap }
