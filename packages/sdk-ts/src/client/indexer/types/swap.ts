import { Coin } from '@injectivelabs/ts-types'

export interface Route {
  steps: string[]
  sourceDenom: string
  targetDenom: string
}

export interface ExecutionQuantity {
  fees: Coin[]
  targetQuantity: string
}
