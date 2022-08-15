export interface MarketId {
  marketId: string
}

export interface QueryMarketIdPayload {
  subaccountId: string
}

export interface QueryMarketIdResponse {
  market_id: string
}

export interface RegisteredVault {
  masterSubaccountId: string
  vaultAddress: string
}

export interface QueryRegisteredVaultResponse {
  registered_vaults: {
    master_subaccount_id: string
    vault_address: string
  }[]
}

export interface TotalLpSupply {
  totalSupply: string
}

export interface QueryTotalLpSupplyPayload {
  subaccountId: string
}

export interface QueryTotalLpSupplyResponse {
  total_supply: string
}

export interface UserLpBalance {
  balance: string
}

export interface QueryUserLpBalancePayload {
  subaccountId: string
  userAddress: string
}

export interface QueryUserLpBalanceResponse {
  balance: string
}

export interface Config {
  distributionContract: string
  ninjaToken: string
  owner: string
}

export interface GetConfigResponse {
  distribution_contract: string
  ninja_token: string
  owner: string
}

export type WasmQueryPayload =
  | QueryMarketIdPayload
  | QueryTotalLpSupplyPayload
  | QueryUserLpBalancePayload

export interface WasmContractQueryResponse {
  data: string
}
