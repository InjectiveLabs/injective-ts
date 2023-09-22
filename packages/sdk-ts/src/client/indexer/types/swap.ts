import { Coin } from '@injectivelabs/ts-types'

export interface Route {
  steps: string[]
  sourceDenom: string
  targetDenom: string
}

export interface QuantityAndFees {
  expectedFees: Coin[]
  resultQuantity: string
}
