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

export interface QueryVaultContractBaseConfig {
  owner: string
  market_id: string
  subaccount_id: string
  fee_recipient: string
  master_address: string
  order_density: number
  notional_value_cap: string
}

export interface QueryVaultContractMarketMaking {
  reservation_price_sensitivity_ratio: string
  reservation_spread_sensitivity_ratio: string
  max_active_capital_utilization_ratio: string
  head_change_tolerance_ratio: string
  head_to_tail_deviation_ratio: string
  signed_min_head_to_fair_price_deviation_ratio: string
  signed_min_head_to_tob_deviation_ratio: string
  default_mid_price_volatility_ratio: string
  min_volatility_ratio: string
  min_oracle_volatility_sample_size: number
  oracle_volatility_max_age: number
  emergency_oracle_volatility_sample_size: number
  last_valid_mark_price: string
  oracle_stale_time: number
}

export interface QueryVaultContractDerivativeConfigResponse {
  config: {
    base: QueryVaultContractBaseConfig
    market_making: QueryVaultContractMarketMaking
    leverage: string
    min_proximity_to_liquidation: string
    allowed_redemption_types: number
    position_pnl_penalty: string
  }
}

export interface QueryVaultContractSpotConfigResponse {
  config: {
    base: QueryVaultContractBaseConfig
    market_making: QueryVaultContractMarketMaking
    oracle_type: number
    target_base_weight: string
    allowed_redemption_types: number
    base_decimals: number
    quote_decimals: number
    base_oracle_symbol: string
    quote_oracle_symbol: string
  }
}

export interface QueryVaultContractAMMConfigResponse {
  config: {
    base: QueryVaultContractBaseConfig
    price_tick_size: string
    max_invariant_sensitivity: string
    base_decimals: number
    quote_decimals: number
    fee_bps: number
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

export interface QueryLockedLpFundsResponse {
  amount: string
  lock_time: string
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

export interface QueryOffChainVaultSpotResponse {
  Spot: {
    oracle_type: number
    base_oracle_symbol: string
    quote_oracle_symbol: string
    base_decimals: number
    quote_decimals: number
  }
}
export interface QueryOffChainVaultDerivativeResponse {
  Derivative: {
    position_pnl_penalty: string
    allowed_derivative_redemption_types: number
  }
}

export interface QueryOffChainVaultResponse {
  admin: string
  market_id: string
  vault_subaccount_id: string
  oracle_stale_time: string
  notional_value_cap: string
  vault_type:
    | QueryOffChainVaultSpotResponse
    | QueryOffChainVaultDerivativeResponse
}

export type VaultBaseConfig = {
  owner: string
  marketId: string
  subaccountId: string
  feeRecipient: string
  masterAddress: string
  orderDensity: number
  notionalValueCap: string
}

export type VaultMarketMakingConfig = {
  reservationPriceSensitivityRatio: string
  reservationSpreadSensitivityRatio: string
  maxActiveCapitalUtilizationRatio: string
  headChangeToleranceRatio: string
  headToTailDeviationRatio: string
  signedMinHeadToFairPriceDeviationRatio: string
  signedMinHeadToTobDeviationRatio: string
  defaultMidPriceVolatilityRatio: string
  minVolatilityRatio: string
  minOracleVolatilitySampleSize: number
  oracleVolatilityMaxAge: number
  emergencyOracleVolatilitySampleSize: number
  lastValidMarkPrice: string
  oracleStaleTime: number
}

export type VaultAMMConfig = {
  base: VaultBaseConfig
  priceTickSize: string
  maxInvariantSensitivity: string
  baseDecimals: number
  quoteDecimals: number
  feeBps: number
}

export type VaultDerivativeConfig = {
  base: VaultBaseConfig
  marketMaking: VaultMarketMakingConfig
  leverage: string
  minProximityToLiquidation: string
  allowedRedemptionTypes: number
  positionPnlPenalty: string
}

export type VaultSpotConfig = {
  base: VaultBaseConfig
  marketMaking: VaultMarketMakingConfig
  oracleType: number
  targetBaseWeight: string
  allowedRedemptionTypes: number
  baseDecimals: number
  quoteDecimals: number
  baseOracleSymbol: string
  quoteOracleSymbol: string
}

export type OffChainVaultBaseConfig = {
  admin: string
  marketId: string
  vaultSubaccountId: string
  oracleStaleTime: number
  notionalValueCap: string
}

export type OffChainVaultSpotConfig = {
  base: OffChainVaultBaseConfig
  oracleType: number
  baseOracleSymbol: string
  quoteOracleSymbol: string
  baseDecimals: number
  quoteDecimals: number
}

export type OffChainVaultDerivativeConfig = {
  base: OffChainVaultBaseConfig
  positionPnlPenalty: string
  allowedDerivativeRedemptionTypes: number
}

export type QueryStakingConfigResponse = {
  owner?: string
  lockup_period?: number
  allocator_contract_address?: string
}

export type QueryAllocatorConfigResponse = {
  owner?: string
  staking_contract_address?: string
  max_reward_denoms_per_gauge?: number
  min_gauge_duration_in_seconds?: number
  max_active_gauges_per_lp_token?: number
  gauge_allocation_fee?: {
    denom: string
    amount: string
  }
}

export type StakingConfig = {
  owner?: string
  lockupPeriod?: number
  allocatorContractAddress?: string
}

export type AllocatorConfig = {
  owner?: string
  stakingContractAddress?: string
  maxRewardDenomsPerGauge?: number
  minGaugeDurationInSeconds?: number
  maxActiveGaugesPerLpToken?: number
  gaugeAllocationFeeDenom?: string
  gaugeAllocationFeeAmount?: string
}
