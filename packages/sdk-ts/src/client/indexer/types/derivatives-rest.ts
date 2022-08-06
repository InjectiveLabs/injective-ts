export type ChronosDerivativeMarketSummary = {
  change: number
  high: number
  low: number
  open: number
  price: number
  volume: number
}

export type AllChronosDerivativeMarketSummary = {
  change: number
  high: number
  low: number
  open: number
  price: number
  volume: number
  marketId: string
}

export interface ChronosDerivativeMarketSummaryResponse {
  data: ChronosDerivativeMarketSummary
}

export interface AllDerivativeMarketSummaryResponse {
  data: AllChronosDerivativeMarketSummary[]
}
