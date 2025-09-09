import { InjectiveExchangeV1Beta1Exchange } from '@injectivelabs/core-proto-ts'

export type TradeExecutionType =
  | 'market'
  | 'limitFill'
  | 'limitMatchRestingOrder'
  | 'limitMatchNewOrder'

export const TradeExecutionType = {
  Market: 'market',
  LimitFill: 'limitFill',
  LimitMatchRestingOrder: 'limitMatchRestingOrder',
  LimitMatchNewOrder: 'limitMatchNewOrder',
} as const

export type TradeExecutionSide = 'maker' | 'taker'

export const TradeExecutionSide = {
  Maker: 'maker',
  Taker: 'taker',
} as const

export type TradeDirection = 'buy' | 'sell' | 'long' | 'short'

export const TradeDirection = {
  Buy: 'buy',
  Sell: 'sell',
  Long: 'long',
  Short: 'short',
} as const

export type OrderMask = InjectiveExchangeV1Beta1Exchange.OrderMask
export const OrderMaskMap = InjectiveExchangeV1Beta1Exchange.OrderMask
