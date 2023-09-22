export interface QueryRouteResponse {
  steps: string[]
  source_denom: string
  target_denom: string
}

export interface QueryQuantityAndFeesResponse {
  expected_fees: { amount: string; denom: string }[]
  result_quantity: string
}
