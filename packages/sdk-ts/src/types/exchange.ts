import * as InjectiveExchangeV1Beta1ExchangePb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/exchange_pb'

/**
 * Trade and Order types
 */

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

export const OrderState = {
  Unfilled: 'unfilled',
  Booked: 'booked',
  PartialFilled: 'partial_filled',
  PartiallyFilled: 'partially_filled',
  Filled: 'filled',
  Canceled: 'canceled',
  Triggered: 'triggered',
} as const

export type OrderState = (typeof OrderState)[keyof typeof OrderState]

export const OrderSide = {
  Unspecified: 'unspecified',
  Buy: 'buy',
  Sell: 'sell',
  StopBuy: 'stop_buy',
  StopSell: 'stop_sell',
  TakeBuy: 'take_buy',
  TakeSell: 'take_sell',
  BuyPO: 'buy_po',
  SellPO: 'sell_po',
  BuyAtomic: 'buy_atomic',
  SellAtomic: 'sell_atomic',
  Unrecognized: 'unrecognized',
} as const

export type OrderSide = (typeof OrderSide)[keyof typeof OrderSide]

export type OrderMask = InjectiveExchangeV1Beta1ExchangePb.OrderMask
export const OrderMaskMap = InjectiveExchangeV1Beta1ExchangePb.OrderMask
