import { BigNumberInWei, BigNumberInBase } from '@injectivelabs/utils'

export interface UiCoin {
  denom: string
  amount: string
}

export enum Change {
  New = 'new',
  NoChange = 'no-change',
  Increase = 'increase',
  Decrease = 'decrease',
}

export enum MarketType {
  Spot = 'Spot',
  Derivative = 'Derivative',
  Perpetual = 'Perpetual',
  Futures = 'Futures',
}

export enum MarketBase {
  Terra = 'terra',
}

export interface UiPriceLevel {
  price: string
  quantity: BigNumberInWei | string
  timestamp: number
  aggregatePrices?: string[]
}

export interface UiOrderbookPriceLevel {
  price: string
  quantity: BigNumberInWei
  timestamp: number
  oldQuantity?: string
  total: BigNumberInBase
  depth: number
  aggregatePrices?: string[]
  aggregatedPrice?: string
}
