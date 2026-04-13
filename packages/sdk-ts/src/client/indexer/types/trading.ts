import type * as InjectiveTradingRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_trading_rpc_pb'

export type ListTradingStrategiesResponse =
  InjectiveTradingRpcPb.ListTradingStrategiesResponse

export type TradingStrategy = InjectiveTradingRpcPb.TradingStrategy

export const MarketType = {
  Spot: 'spot',
  Derivative: 'derivative',
} as const

export type MarketType = (typeof MarketType)[keyof typeof MarketType]

export type GridStrategyType = 'geometric' | 'arithmetic' | 'perpetual'
// Trailing Arithmetic

export const GridStrategyType = {
  Geometric: 'geometric',
  Arithmetic: 'arithmetic',
  Perpetual: 'perpetual',
  // Trailing Arithmetic
} as const

export type GridStrategyStreamResponse =
  InjectiveTradingRpcPb.StreamStrategyResponse
