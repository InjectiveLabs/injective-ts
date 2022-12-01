import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase'

export declare namespace ExecArgUpdateDerivativeVaultConfig {
  export interface Params {
    marketId: string
    subaccountId: string
    feeRecipient: string
    leverage: string
    orderDensity: number
    reservationPriceSensitivityRatio: string
    reservationSpreadSensitivityRatio: string
    maxActiveCapitalUtilizationRatio: string
    headChangeToleranceRatio: string
    headToTailDeviationRatio: string
    signedMinHeadToFairPriceDeviationRatio: string
    signedMinHeadToTobDeviationRatio: string
    minProximityToLiquidation: string
    postReductionPercOfMaxPosition: string
    oracleVolatilityGroupSec: number
    minOracleVolatilitySampleSize: number
    emergencyOracleVolatilitySampleSize: number
    tradeVolatilityGroupSec: number
    minTradeVolatilitySampleSize: number
    defaultMidPriceVolatilityRatio: string
    minVolatilityRatio: string
    lastValidMarkPrice: string
  }

  export interface Data {
    market_id: string
    subaccount_id: string
    fee_recipient: string
    leverage: string
    order_density: number
    reservation_price_sensitivity_ratio: string
    reservation_spread_sensitivity_ratio: string
    max_active_capital_utilization_ratio: string
    head_change_tolerance_ratio: string
    head_to_tail_deviation_ratio: string
    signed_min_head_to_fair_price_deviation_ratio: string
    signed_min_head_to_tob_deviation_ratio: string
    min_proximity_to_liquidation: string
    post_reduction_perc_of_max_position: string
    oracle_volatility_group_sec: number
    min_oracle_volatility_sample_size: number
    emergency_oracle_volatility_sample_size: number
    trade_volatility_group_sec: number
    min_trade_volatility_sample_size: number
    default_mid_price_volatility_ratio: string
    min_volatility_ratio: string
    last_valid_mark_price: string
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
      subaccount_id: params.subaccountId,
      fee_recipient: params.feeRecipient,
      leverage: params.leverage,
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

  toExecData(): ExecDataRepresentation<ExecArgUpdateDerivativeVaultConfig.Data> {
    return dataToExecData('update_vault_config', this.toData())
  }
}
