export interface QueryContractTokenInfoResponse {
  name: string
  symbol: string
  decimals: number
  total_supply: string
}

export interface QueryContractMarketingInfoResponse {
  project: string
  description: string
  logo: string
  marketing: string
}

export interface QueryMastContractConfigResponse {
  distribution_contract: string
  ninja_token: string
  owner: string
}

export interface QueryVaultContractDerivativeConfigResponse {
  config: {
    owner: string
    market_id: string
    subaccount_id: string
    fee_recipient: string
    leverage: string
    order_density: string
    reservation_price_sensitivity_ratio: string
    reservation_spread_sensitivity_ratio: string
    max_active_capital_utilization_ratio: string
    head_change_tolerance_ratio: string
    head_to_tail_deviation_ratio: string
    signed_min_head_to_fair_price_deviation_ratio: string
    signed_min_head_to_tob_deviation_ratio: string
    min_proximity_to_liquidation: string
    post_reduction_perc_of_max_position: string
    oracle_volatility_group_sec: string
    min_oracle_volatility_sample_size: string
    emergency_oracle_volatility_sample_size: string
    trade_volatility_group_sec: string
    min_trade_volatility_sample_size: string
    default_mid_price_volatility_ratio: string
    min_volatility_ratio: string
    last_valid_mark_price: string
    master_address: string
  }
}

export interface QueryVaultContractSpotConfigResponse {
  config: {
    default_mid_price_volatility_ratio: string
    fair_price_tail_deviation_ratio: string
    fee_recipient: string
    head_change_tolerance_ratio: string
    market_id: string
    master_address: string
    max_active_capital_utilization_ratio: string
    min_head_to_tail_deviation_ratio: string
    min_trade_volatility_sample_size: string
    oracle_type: string
    order_density: string
    owner: string
    reservation_price_sensitivity_ratio: string
    reservation_spread_sensitivity_ratio: string
    signed_min_head_to_fair_price_deviation_ratio: string
    signed_min_head_to_tob_deviation_ratio: string
    subaccount_id: string
    target_base_weight: string
    trade_volatility_group_count: string
    trade_volatility_group_sec: string
  }
}

export interface QueryVaultUserLpContractAllowanceResponse {
  allowance: string
  expires: {
    never: {}
  }
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
    vault: {
      spot?: {
        address: string
      }
      derivative?: {
        address: string
      }
    }
  }[]
}

export interface WasmContractQueryResponse {
  data: string
}
