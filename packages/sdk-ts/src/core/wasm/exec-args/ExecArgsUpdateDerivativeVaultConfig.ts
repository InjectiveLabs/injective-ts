import {
  dataToExecData,
  ExecArgsBase,
  ExecDataRepresentation,
} from '../../ExecArgsBase'

export declare namespace ExecArgsUpdateDerivativeVaultConfig {
  export interface Params {
    marketId: string
    leverage: string
    orderDensity: string
    reservationPriceSensitivityRatio: string
    reservationSpreadSensitivityRatio: string
    maxActiveCapitalUtilizationRatio: string
    leveragedActiveCapitalToMaxPositionExposureRatio: string
    headChangeToleranceRatio: string
    headToTailDeviationRatio: string
    minProximityToLiquidation: string
    postReductionPercOfMaxPosition: string
    oracleVolatilityGroupSec: string
    minOracleVolatilitySampleSize: string
    emergencyOracleVolatilitySampleSize: string
    tradeVolatilityGroupSec: string
    minTradeVolatilitySampleSize: string
    defaultMidPriceVolatilityRatio: string
    minVolatilityRatio: string
    lastValidMarkPrice: string
    origin: string
  }

  export interface Data {
    market_id: string
    leverage: string
    order_density: string
    reservation_price_sensitivity_ratio: string
    reservation_spread_sensitivity_ratio: string
    max_active_capital_utilization_ratio: string
    leveraged_active_capital_to_max_position_exposure_ratio: string
    head_change_tolerance_ratio: string
    head_to_tail_deviation_ratio: string
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
  }
}

export default class ExecArgsUpdateDerivativeVaultConfig extends ExecArgsBase<
  ExecArgsUpdateDerivativeVaultConfig.Params,
  ExecArgsUpdateDerivativeVaultConfig.Data
> {
  static fromJSON(
    params: ExecArgsUpdateDerivativeVaultConfig.Params,
  ): ExecArgsUpdateDerivativeVaultConfig {
    return new ExecArgsUpdateDerivativeVaultConfig(params)
  }

  toData(): ExecArgsUpdateDerivativeVaultConfig.Data {
    const { params } = this

    return {
      market_id: params.marketId,
      leverage: params.leverage,
      order_density: params.orderDensity,
      reservation_price_sensitivity_ratio:
        params.reservationPriceSensitivityRatio,
      reservation_spread_sensitivity_ratio:
        params.reservationSpreadSensitivityRatio,
      max_active_capital_utilization_ratio:
        params.maxActiveCapitalUtilizationRatio,
      leveraged_active_capital_to_max_position_exposure_ratio:
        params.leveragedActiveCapitalToMaxPositionExposureRatio,
      head_change_tolerance_ratio: params.headChangeToleranceRatio,
      head_to_tail_deviation_ratio: params.headToTailDeviationRatio,
      min_proximity_to_liquidation: params.minProximityToLiquidation,
      post_reduction_perc_of_max_position:
        params.postReductionPercOfMaxPosition,
      oracle_volatility_group_sec: params.oracleVolatilityGroupSec,
      min_oracle_volatility_sample_size: params.minOracleVolatilitySampleSize,
      emergency_oracle_volatility_sample_size:
        params.emergencyOracleVolatilitySampleSize,
      trade_volatility_group_sec: params.tradeVolatilityGroupSec,
      min_trade_volatility_sample_size: params.minTradeVolatilitySampleSize,
      default_mid_price_volatility_ratio: params.defaultMidPriceVolatilityRatio,
      min_volatility_ratio: params.minVolatilityRatio,
      last_valid_mark_price: params.lastValidMarkPrice,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgsUpdateDerivativeVaultConfig.Data> {
    const { params } = this

    return dataToExecData(this.toData(), {
      origin: params.origin,
      name: 'UpdateDerivativeVaultConfig',
      action: 'update_derivative_vault_config',
    })
  }
}
