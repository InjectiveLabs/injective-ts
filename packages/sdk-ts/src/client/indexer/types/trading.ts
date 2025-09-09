import type { InjectiveTradingRpc } from '@injectivelabs/indexer-proto-ts'

export type ListTradingStrategiesResponse =
  InjectiveTradingRpc.ListTradingStrategiesResponse

export type TradingStrategy = InjectiveTradingRpc.TradingStrategy

export type MarketType = 'spot' | 'derivative'

export const MarketType = {
  Spot: 'spot',
  Derivative: 'derivative',
} as const

export type GridStrategyType = 'geometric' | 'arithmetic' | 'perpetual'
// Trailing Arithmetic

export const GridStrategyType = {
  Geometric: 'geometric',
  Arithmetic: 'arithmetic',
  Perpetual: 'perpetual',
  // Trailing Arithmetic
} as const

export type GridStrategyStreamResponse =
  InjectiveTradingRpc.StreamStrategyResponse
