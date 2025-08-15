export type TradeExecutionTypeType =
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

export type TradeExecutionSideType = 'maker' | 'taker'

export const TradeExecutionSide = {
  Maker: 'maker',
  Taker: 'taker',
} as const

export type TradeDirectionType = 'buy' | 'sell' | 'long' | 'short'

export const TradeDirection = {
  Buy: 'buy',
  Sell: 'sell',
  Long: 'long',
  Short: 'short',
} as const

export type OrderStateType =
  | 'unfilled'
  | 'booked'
  | 'partial_filled'
  | 'partially_filled'
  | 'filled'
  | 'canceled'
  | 'triggered'

export const OrderState = {
  Unfilled: 'unfilled',
  Booked: 'booked',
  PartialFilled: 'partial_filled',
  PartiallyFilled: 'partially_filled',
  Filled: 'filled',
  Canceled: 'canceled',
  Triggered: 'triggered',
} as const

export type OrderSideType =
  | 'unspecified'
  | 'buy'
  | 'sell'
  | 'stop_buy'
  | 'stop_sell'
  | 'take_buy'
  | 'take_sell'
  | 'buy_po'
  | 'sell_po'
  | 'buy_atomic'
  | 'sell_atomic'
  | 'unrecognized'

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
