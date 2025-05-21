import type { SpotTrade } from '@injectivelabs/sdk-ts'
import type { DerivativeTrade } from '@injectivelabs/sdk-ts'
import type { ChainEvent } from './block'

export type TypedSpotTrade = SpotTrade & { rawChainEvent: ChainEvent }
export type TypedDerivativeTrade = DerivativeTrade & {
  pnl?: string
  rawChainEvent: ChainEvent
}
