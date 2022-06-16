export type ChronosBinaryOptionsMarketSummary = {
  change: number
  high: number
  low: number
  open: number
  price: number
  volume: number
}

export type AllChronosBinaryOptionsMarketSummary = {
  change: number
  high: number
  low: number
  open: number
  price: number
  volume: number
  marketId: string
}

export interface ChronosBinaryOptionsMarketSummaryResponse {
  data: ChronosBinaryOptionsMarketSummary
}

export interface AllBinaryOptionsMarketSummaryResponse {
  data: AllChronosBinaryOptionsMarketSummary[]
}
