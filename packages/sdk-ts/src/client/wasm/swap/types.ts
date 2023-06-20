export interface QueryRouteResponse {
  steps: string[]
  source_denom: string
  target_denom: string
}

export interface QueryExecutionQuantityResponse {
  fees: { amount: string; denom: string }[]
  target_quantity: string
}
