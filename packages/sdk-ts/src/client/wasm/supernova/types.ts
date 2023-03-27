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
  order_density: string
  redemption_lock_time: string
  redemption_unlock_time_expiration: string
}

export interface QueryVaultContractMarketMaking {
  reservation_price_sensitivity_ratio: string
  reservation_spread_sensitivity_ratio: string
  max_active_capital_utilization_ratio: string
  head_change_tolerance_ratio: string
  min_head_to_tail_deviation_ratio: string
  signed_min_head_to_fair_price_deviation_ratio: string
  signed_min_head_to_tob_deviation_ratio: string
  trade_volatility_group_sec: string
  min_trade_volatility_sample_size: string
  default_mid_price_volatility_ratio: string
  min_volatility_ratio: string
}

export interface QueryVaultContractDerivativeConfigResponse {
  config: {
    base: QueryVaultContractBaseConfig
    market_making: QueryVaultContractMarketMaking
    leverage: string
    min_proximity_to_liquidation: string
    post_reduction_perc_of_max_position: string
    oracle_volatility_group_sec: string
    min_oracle_volatility_sample_size: string
    emergency_oracle_volatility_sample_size: string
    last_valid_mark_price: string
    allowed_redemption_types: string
    position_pnl_penalty: string
  }
}

export interface QueryVaultContractSpotConfigResponse {
  config: {
    base: QueryVaultContractBaseConfig
    market_making: QueryVaultContractMarketMaking
    oracle_type: string
    fair_price_tail_deviation_ratio: string
    target_base_weight: string
    allowed_redemption_types: string
    imbalance_adjustment_exponent: string
    reward_diminishing_factor: string
    base_decimals: string
    quote_decimals: string
    base_oracle_symbol: string
    quote_oracle_symbol: string
  }
}

export interface QueryVaultContractAMMConfigResponse {
  config: {
    base: QueryVaultContractBaseConfig
    max_invariant_sensitivity: string
    base_decimals: number
    quote_decimals: number
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

export interface WasmContractQueryResponse {
  data: Uint8Array
}

export type VaultBaseConfig = {
  owner: string
  marketId: string
  subaccountId: string
  feeRecipient: string
  masterAddress: string
  orderDensity: number
  redemptionLockTime: number
  redemptionUnlockTimeExpiration: number
}

export type VaultMarketMakingConfig = {
  reservationPriceSensitivityRatio: string
  reservationSpreadSensitivityRatio: string
  maxActiveCapitalUtilizationRatio: string
  headChangeToleranceRatio: string
  minHeadToTailDeviationRatio: string
  signedMinHeadToFairPriceDeviationRatio: string
  signedMinHeadToTobDeviationRatio: string
  tradeVolatilityGroupSec: number
  minTradeVolatilitySampleSize: number
  defaultMidPriceVolatilityRatio: string
  minVolatilityRatio: string
}

export type VaultAMMConfig = {
  base: VaultBaseConfig
  maxInvariantSensitivity: string
  baseDecimals: number
  quoteDecimals: number
}

export type VaultDerivativeConfig = {
  base: VaultBaseConfig
  marketMaking: VaultMarketMakingConfig
  leverage: string
  minProximityToLiquidation: string
  postReductionPercOfMaxPosition: string
  oracleVolatilityGroupSec: number
  minOracleVolatilitySampleSize: number
  emergencyOracleVolatilitySampleSize: number
  lastValidMarkPrice: string
  allowedRedemptionTypes: number
  positionPnlPenalty: string
}

export type VaultSpotConfig = {
  base: VaultBaseConfig
  marketMaking: VaultMarketMakingConfig
  oracleType: number
  fairPriceTailDeviationRatio: string
  targetBaseWeight: string
  allowedRedemptionTypes: number
  imbalanceAdjustmentExponent: string
  rewardDiminishingFactor: string
  baseDecimals: number
  quoteDecimals: number
  baseOracleSymbol: string
  quoteOracleSymbol: string
}
