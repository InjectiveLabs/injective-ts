export interface MarketId {
  marketId: string
}

export interface GetMarketIdPayload {
  subaccountId: string
}

export interface GetMarketIdResponse {
  market_id: string
}

export interface RegisteredVault {
  masterSubaccountId: string
  vaultAddress: string
}

export interface RegisteredVaultResponse {
  registered_vaults: {
    master_subaccount_id: string
    vault_address: string
  }[]
}

export interface TotalLpSupply {
  totalSupply: string
}

export interface GetTotalLpSupplyPayload {
  subaccountId: string
}

export interface GetTotalLpSupplyResponse {
  total_supply: string
}

export interface UserLpBalance {
  balance: string
}

export interface GetUserLpBalancePayload {
  subaccountId: string
  userAddress: string
}

export interface GetUserLpBalanceResponse {
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
  | GetMarketIdPayload
  | GetTotalLpSupplyPayload
  | GetUserLpBalancePayload

export interface WasmContractQueryResponse {
  data: string
}
