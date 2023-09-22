import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase'

export declare namespace ExecArgUpdateDerivativeVaultConfig {
  export interface Params {
    marketId: string
    leverage: string
    orderDensity: number
    signedMinHeadToFairPriceDeviationRatio: string
    signedMinHeadToTobDeviationRatio: string
    reservationPriceSensitivityRatio: string
    reservationSpreadSensitivityRatio: string
    maxActiveCapitalUtilizationRatio: string
    headChangeToleranceRatio: string
    headToTailDeviationRatio: string
    minProximityToLiquidation: string
    minOracleVolatilitySampleSize: number
    emergencyOracleVolatilitySampleSize: number
    defaultMidPriceVolatilityRatio: string
    minVolatilityRatio: string
    lastValidMarkPrice: string
    allowedRedemptionTypes: number
    notionalValueCap: string
    oracleStaleTime: number
    oracleVolatilityMaxAge: number
  }

  export interface Data {
    market_id: string
    leverage: string
    order_density: number
    signed_min_head_to_fair_price_deviation_ratio: string
    signed_min_head_to_tob_deviation_ratio: string
    reservation_price_sensitivity_ratio: string
    reservation_spread_sensitivity_ratio: string
    max_active_capital_utilization_ratio: string
    head_change_tolerance_ratio: string
    head_to_tail_deviation_ratio: string
    min_proximity_to_liquidation: string
    min_oracle_volatility_sample_size: number
    emergency_oracle_volatility_sample_size: number
    default_mid_price_volatility_ratio: string
    min_volatility_ratio: string
    last_valid_mark_price: string
    allowed_redemption_types: number
    notional_value_cap: string
    oracle_stale_time: number
    oracle_volatility_max_age: number
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgUpdateDerivativeVaultConfig extends ExecArgBase<
  ExecArgUpdateDerivativeVaultConfig.Params,
  ExecArgUpdateDerivativeVaultConfig.Data
> {
  static fromJSON(
    params: ExecArgUpdateDerivativeVaultConfig.Params,
  ): ExecArgUpdateDerivativeVaultConfig {
    return new ExecArgUpdateDerivativeVaultConfig(params)
  }

  toData(): ExecArgUpdateDerivativeVaultConfig.Data {
    const { params } = this

    return {
      market_id: params.marketId,
      leverage: params.leverage,
      order_density: params.orderDensity,
      signed_min_head_to_fair_price_deviation_ratio:
        params.signedMinHeadToFairPriceDeviationRatio,
      signed_min_head_to_tob_deviation_ratio:
        params.signedMinHeadToTobDeviationRatio,
      reservation_price_sensitivity_ratio:
        params.reservationPriceSensitivityRatio,
      reservation_spread_sensitivity_ratio:
        params.reservationSpreadSensitivityRatio,
      max_active_capital_utilization_ratio:
        params.maxActiveCapitalUtilizationRatio,
      head_change_tolerance_ratio: params.headChangeToleranceRatio,
      head_to_tail_deviation_ratio: params.headToTailDeviationRatio,
      min_proximity_to_liquidation: params.minProximityToLiquidation,
      min_oracle_volatility_sample_size: params.minOracleVolatilitySampleSize,
      emergency_oracle_volatility_sample_size:
        params.emergencyOracleVolatilitySampleSize,
      default_mid_price_volatility_ratio: params.defaultMidPriceVolatilityRatio,
      min_volatility_ratio: params.minVolatilityRatio,
      last_valid_mark_price: params.lastValidMarkPrice,
      allowed_redemption_types: params.allowedRedemptionTypes,
      notional_value_cap: params.notionalValueCap,
      oracle_stale_time: params.oracleStaleTime,
      oracle_volatility_max_age: params.oracleVolatilityMaxAge,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgUpdateDerivativeVaultConfig.Data> {
    return dataToExecData('update_vault_config', this.toData())
  }
}
