import { BigNumberInWei, BigNumberInBase } from '@injectivelabs/utils'

export enum Change {
  New = 'new',
  NoChange = 'no-change',
  Increase = 'increase',
  Decrease = 'decrease',
}

export enum MarketType {
  Favorite = 'Favorite',
  Spot = 'Spot',
  Derivative = 'Derivative',
  Perpetual = 'Perpetual',
  Futures = 'Futures',
  BinaryOptions = 'BinaryOptions',
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

export interface UiOrderbookSummary {
  quantity: BigNumberInBase
  total: BigNumberInBase
}
