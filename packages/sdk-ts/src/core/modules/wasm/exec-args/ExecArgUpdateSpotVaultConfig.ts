import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase'

export declare namespace ExecArgUpdateSpotVaultConfig {
  export interface Params {
    marketId: string
    orderDensity: number
    reservationPriceSensitivityRatio: string
    reservationSpreadSensitivityRatio: string
    maxActiveCapitalUtilizationRatio: string
    headChangeToleranceRatio: string
    headToTailDeviationRatio: string
    signedMinHeadToFairPriceDeviationRatio: string
    signedMinHeadToTobDeviationRatio: string
    targetBaseWeight: string
    oracleType: number
    defaultMidPriceVolatilityRatio: string
    allowedRedemptionTypes: number
    notionalValueCap: string
    oracleStaleTime: number
    lastValidMarkPrice: string
    minOracleVolatilitySampleSize: number
    emergencyOracleVolatilitySampleSize: number
    minVolatilityRatio: string
    oracleVolatilityMaxAge: number
  }

  export interface Data {
    market_id: string
    order_density: number
    reservation_price_sensitivity_ratio: string
    reservation_spread_sensitivity_ratio: string
    max_active_capital_utilization_ratio: string
    head_change_tolerance_ratio: string
    head_to_tail_deviation_ratio: string
    signed_min_head_to_fair_price_deviation_ratio: string
    signed_min_head_to_tob_deviation_ratio: string
    target_base_weight: string
    oracle_type: number
    default_mid_price_volatility_ratio: string
    allowed_redemption_types: number
    notional_value_cap: string
    oracle_stale_time: number
    last_valid_mark_price: string
    min_oracle_volatility_sample_size: number
    emergency_oracle_volatility_sample_size: number
    min_volatility_ratio: string
    oracle_volatility_max_age: number
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgUpdateSpotVaultConfig extends ExecArgBase<
  ExecArgUpdateSpotVaultConfig.Params,
  ExecArgUpdateSpotVaultConfig.Data
> {
  static fromJSON(
    params: ExecArgUpdateSpotVaultConfig.Params,
  ): ExecArgUpdateSpotVaultConfig {
    return new ExecArgUpdateSpotVaultConfig(params)
  }

  toData(): ExecArgUpdateSpotVaultConfig.Data {
    const { params } = this

    return {
      market_id: params.marketId,
      order_density: params.orderDensity,
      reservation_price_sensitivity_ratio:
        params.reservationPriceSensitivityRatio,
      reservation_spread_sensitivity_ratio:
        params.reservationSpreadSensitivityRatio,
      max_active_capital_utilization_ratio:
        params.maxActiveCapitalUtilizationRatio,
      head_change_tolerance_ratio: params.headChangeToleranceRatio,
      head_to_tail_deviation_ratio: params.headToTailDeviationRatio,
      signed_min_head_to_fair_price_deviation_ratio:
        params.signedMinHeadToFairPriceDeviationRatio,
      signed_min_head_to_tob_deviation_ratio:
        params.signedMinHeadToTobDeviationRatio,
      target_base_weight: params.targetBaseWeight,
      oracle_type: params.oracleType,
      default_mid_price_volatility_ratio: params.defaultMidPriceVolatilityRatio,
      allowed_redemption_types: params.allowedRedemptionTypes,
      notional_value_cap: params.notionalValueCap,
      oracle_stale_time: params.oracleStaleTime,
      last_valid_mark_price: params.lastValidMarkPrice,
      min_oracle_volatility_sample_size: params.minOracleVolatilitySampleSize,
      emergency_oracle_volatility_sample_size:
        params.emergencyOracleVolatilitySampleSize,
      min_volatility_ratio: params.minVolatilityRatio,
      oracle_volatility_max_age: params.oracleVolatilityMaxAge,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgUpdateSpotVaultConfig.Data> {
    return dataToExecData('update_vault_config', this.toData())
  }
}
