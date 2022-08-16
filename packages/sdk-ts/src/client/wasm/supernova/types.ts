export interface QueryMastContractConfigResponse {
  distribution_contract: string
  ninja_token: string
  owner: string
}

export interface QueryVaultMarketIdResponse {
  market_id: string
}

export interface QueryVaultTotalLpSupplyResponse {
  total_supply: string
}

export interface QueryVaultUserLpBalanceResponse {
  balance: string
}

export interface QueryRegisteredVaultResponse {
  registered_vaults: {
    master_subaccount_id: string
    vault_address: string
  }[]
}

export interface WasmContractQueryResponse {
  data: string
}
