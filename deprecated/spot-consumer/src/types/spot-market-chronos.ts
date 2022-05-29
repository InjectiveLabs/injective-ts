export type ChronosSpotMarketSummary = {
  change: number
  high: number
  low: number
  open: number
  price: number
  volume: number
}

export type AllChronosSpotMarketSummary = {
  change: number
  high: number
  low: number
  open: number
  price: number
  volume: number
  marketId: string
}

export interface ChronosSpotMarketSummaryResponse {
  data: ChronosSpotMarketSummary
}

export interface AllSpotMarketSummaryResponse {
  data: AllChronosSpotMarketSummary[]
}
