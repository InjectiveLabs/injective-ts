export interface DenomBalance {
  denom: string
  amount: string
}

export interface BalancesResponse {
  balances: DenomBalance[]
}

export interface DenomOwnersResponse {
  denom_owners: {
    address: string
    balance: {
      denom: string
      amount: string
    }
  }[]
}
