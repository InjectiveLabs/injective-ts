import { InjectiveExchangeV1Beta1Exchange } from '@injectivelabs/core-proto-ts'

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

export type OrderMask = InjectiveExchangeV1Beta1Exchange.OrderMask
export const OrderMaskMap = InjectiveExchangeV1Beta1Exchange.OrderMask
