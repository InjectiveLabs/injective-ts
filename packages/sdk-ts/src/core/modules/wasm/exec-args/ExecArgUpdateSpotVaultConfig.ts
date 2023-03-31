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
    fairPriceTailDeviationRatio: string
    minHeadToTailDeviationRatio: string
    minVolatilityRatio: string
    signedMinHeadToFairPriceDeviationRatio: string
    signedMinHeadToTobDeviationRatio: string
    targetBaseWeight: string
    tradeVolatilityGroupSec: number
    minTradeVolatilitySampleSize: number
    defaultMidPriceVolatilityRatio: string
    oracleType: number
    allowedRedemptionTypes: number
    imbalanceAdjustmentExponent: string
    rewardDiminishingFactor: string
    baseDecimals: number
    quoteDecimals: number
    baseOracleSymbol: string
    quoteOracleSymbol: string
    masterAddress: string
    owner: string
    notionalValueCap: string
  }

  export interface Data {
    market_id: string
    order_density: number
    reservation_price_sensitivity_ratio: string
    reservation_spread_sensitivity_ratio: string
    max_active_capital_utilization_ratio: string
    head_change_tolerance_ratio: string
    fair_price_tail_deviation_ratio: string
    min_head_to_tail_deviation_ratio: string
    min_volatility_ratio: string
    signed_min_head_to_fair_price_deviation_ratio: string
    signed_min_head_to_tob_deviation_ratio: string
    target_base_weight: string
    trade_volatility_group_sec: number
    min_trade_volatility_sample_size: number
    default_mid_price_volatility_ratio: string
    oracle_type: number
    allowed_redemption_types: number
    imbalance_adjustment_exponent: string
    reward_diminishing_factor: string
    base_decimals: number
    quote_decimals: number
    base_oracle_symbol: string
    quote_oracle_symbol: string
    master_address: string
    owner: string
    notional_value_cap: string
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
      fair_price_tail_deviation_ratio: params.fairPriceTailDeviationRatio,
      min_head_to_tail_deviation_ratio: params.minHeadToTailDeviationRatio,
      min_volatility_ratio: params.minVolatilityRatio,
      signed_min_head_to_fair_price_deviation_ratio:
        params.signedMinHeadToFairPriceDeviationRatio,
      signed_min_head_to_tob_deviation_ratio:
        params.signedMinHeadToTobDeviationRatio,
      target_base_weight: params.targetBaseWeight,
      trade_volatility_group_sec: params.tradeVolatilityGroupSec,
      min_trade_volatility_sample_size: params.minTradeVolatilitySampleSize,
      default_mid_price_volatility_ratio: params.defaultMidPriceVolatilityRatio,
      oracle_type: params.oracleType,
      allowed_redemption_types: params.allowedRedemptionTypes,
      imbalance_adjustment_exponent: params.imbalanceAdjustmentExponent,
      reward_diminishing_factor: params.rewardDiminishingFactor,
      base_decimals: params.baseDecimals,
      quote_decimals: params.quoteDecimals,
      base_oracle_symbol: params.baseOracleSymbol,
      quote_oracle_symbol: params.quoteOracleSymbol,
      master_address: params.masterAddress,
      owner: params.owner,
      notional_value_cap: params.notionalValueCap,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgUpdateSpotVaultConfig.Data> {
    return dataToExecData('update_vault_config', this.toData())
  }
}
