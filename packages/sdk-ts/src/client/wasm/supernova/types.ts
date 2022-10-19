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
    cw20_code_id: string
    cw20_label: string
    default_mid_price_volatility_ratio: string
    emergency_oracle_volatility_sample_size: string
    head_change_tolerance_ratio: string
    head_to_tail_deviation_ratio: string
    last_valid_mark_price: string
    leverage: string
    leveraged_active_capital_to_max_position_exposure_ratio: string
    lp_name: string
    lp_symbol: string
    lp_token_address: string
    market_id: string
    master_address: string
    max_active_capital_utilization_ratio: string
    min_oracle_volatility_sample_size: string
    min_proximity_to_liquidation: string
    min_trade_volatility_sample_size: string
    min_volatility_ratio: string
    oracle_volatility_group_sec: string
    order_density: string
    post_reduction_perc_of_max_position: string
    reservation_price_sensitivity_ratio: string
    reservation_spread_sensitivity_ratio: string
    trade_volatility_group_sec: string
    cw20_marketing_info?: any
    fee_recipient: string
    owner: string
    subaccount_id: string
  }
}

export interface QueryVaultContractSpotConfigResponse {
  config: {
    cw20_code_id: string
    cw20_label: string
    default_mid_price_volatility_ratio: string
    inventory_imbalance_market_order_threshold: string
    head_change_tolerance_ratio: string
    lp_name: string
    lp_symbol: string
    lp_token_address: string
    market_id: string
    market_buy_mid_price_deviation_percent: string
    market_sell_mid_price_deviation_percent: string
    master_address: string
    max_active_capital_utilization_ratio: string
    mid_price_tail_deviation_ratio: string
    min_head_to_mid_deviation_ratio: string
    min_head_to_tail_deviation_ratio: string
    min_trade_volatility_sample_size: string
    order_density: string
    reservation_price_sensitivity_ratio: string
    reservation_spread_sensitivity_ratio: string
    subaccount_id: string
    target_base_weight: string
    trade_volatility_group_count: string
    trade_volatility_group_sec: string
    fee_recipient: string
    owner: string
    cw20_marketing_info?: any
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
