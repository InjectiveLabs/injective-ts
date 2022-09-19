export interface DenomBalance {
  denom: string
  amount: string
}

export interface BalancesResponse {
  balances: DenomBalance[]
}
