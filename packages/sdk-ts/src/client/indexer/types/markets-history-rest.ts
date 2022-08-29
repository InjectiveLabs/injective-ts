export type AllChronosMarketHistory = {
  marketID: string
  resolution: string
  t: number[]
  v: number[]
  c: number[]
  h: number[]
  l: number[]
  o: number[]
}

export interface ChronosMarketHistoryResponse {
  data: AllChronosMarketHistory[]
}
