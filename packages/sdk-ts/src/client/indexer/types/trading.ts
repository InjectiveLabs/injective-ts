import { InjectiveTradingRpc } from '@injectivelabs/indexer-proto-ts'

export type ListTradingStrategiesResponse =
  InjectiveTradingRpc.ListTradingStrategiesResponse

export type TradingStrategy = InjectiveTradingRpc.TradingStrategy

export enum MarketType {
  Spot = 'spot',
  Derivative = 'derivative',
}

export enum GridStrategyType {
  Geometric = 'geometric',
  Arithmetic = 'arithmetic',
  Perpetual = 'perpetual',
  // Trailing Arithmetic
}
