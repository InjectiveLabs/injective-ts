import * as InjectiveExchangeV1Beta1ExchangePb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/exchange_pb.mjs'

export const TradeExecutionType = {
  Market: 'market',
  LimitFill: 'limitFill',
  LimitMatchRestingOrder: 'limitMatchRestingOrder',
  LimitMatchNewOrder: 'limitMatchNewOrder',
} as const

export type TradeExecutionType =
  (typeof TradeExecutionType)[keyof typeof TradeExecutionType]

export const TradeExecutionSide = {
  Maker: 'maker',
  Taker: 'taker',
} as const

export type TradeExecutionSide =
  (typeof TradeExecutionSide)[keyof typeof TradeExecutionSide]

export const TradeDirection = {
  Buy: 'buy',
  Sell: 'sell',
  Long: 'long',
  Short: 'short',
} as const

export type TradeDirection =
  (typeof TradeDirection)[keyof typeof TradeDirection]

export type OrderMask = InjectiveExchangeV1Beta1ExchangePb.OrderMask
export const OrderMaskMap = InjectiveExchangeV1Beta1ExchangePb.OrderMask
