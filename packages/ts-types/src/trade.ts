/**
 * @deprecated Use TradeExecutionType from @injectivelabs/sdk-ts/types instead
 */
export const TradeExecutionType = {
  Market: 'market',
  LimitFill: 'limitFill',
  LimitMatchRestingOrder: 'limitMatchRestingOrder',
  LimitMatchNewOrder: 'limitMatchNewOrder',
} as const

/**
 * @deprecated Use TradeExecutionType from @injectivelabs/sdk-ts/types instead
 */
export type TradeExecutionType =
  (typeof TradeExecutionType)[keyof typeof TradeExecutionType]

/**
 * @deprecated Use TradeExecutionSide from @injectivelabs/sdk-ts/types instead
 */
export const TradeExecutionSide = {
  Maker: 'maker',
  Taker: 'taker',
} as const

/**
 * @deprecated Use TradeExecutionSide from @injectivelabs/sdk-ts/types instead
 */
export type TradeExecutionSide =
  (typeof TradeExecutionSide)[keyof typeof TradeExecutionSide]

/**
 * @deprecated Use TradeDirection from @injectivelabs/sdk-ts/types instead
 */
export const TradeDirection = {
  Buy: 'buy',
  Sell: 'sell',
  Long: 'long',
  Short: 'short',
} as const

/**
 * @deprecated Use TradeDirection from @injectivelabs/sdk-ts instead
 */
export type TradeDirection =
  (typeof TradeDirection)[keyof typeof TradeDirection]

/**
 * @deprecated Use OrderState from @injectivelabs/sdk-ts/types instead
 */
export const OrderState = {
  Unfilled: 'unfilled',
  Booked: 'booked',
  PartialFilled: 'partial_filled',
  PartiallyFilled: 'partially_filled',
  Filled: 'filled',
  Canceled: 'canceled',
  Triggered: 'triggered',
} as const

/**
 * @deprecated Use OrderState from @injectivelabs/sdk-ts/types instead
 */
export type OrderState = (typeof OrderState)[keyof typeof OrderState]

/**
 * @deprecated Use OrderSide from @injectivelabs/sdk-ts/types instead
 */
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

/**
 * @deprecated Use OrderSide from @injectivelabs/sdk-ts/types instead
 */
export type OrderSide = (typeof OrderSide)[keyof typeof OrderSide]
