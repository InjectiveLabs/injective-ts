import {
  dataToExecData,
  ExecArgsBase,
  ExecDataRepresentation,
} from '../../ExecArgsBase'

export declare namespace ExecArgsUpdateSpotVaultConfig {
  export interface Params {
    marketId: string
    orderDensity: string
    balanceReduceRatio: string
    marketOrderLowerBoundRatio: string
    marketOrderUpperBoundRatio: string
    reservationPriceSensitivityRatio: string
    reservationSpreadSensitivityRatio: string
    maxActiveCapitalUtilizationRatio: string
    midPriceTailDeviationRatio: string
    minHeadToTailDeviationRatio: string
    headChangeToleranceRatio: string
    minHeadToMidDeviationRatio: string
    maxAvgOrdersPriceDeviationRatio: string
    tradeVolatilityGroupCount: string
    tradeVolatilityGroupSec: string
    minTradeVolatilitySampleSize: string
    defaultMidPriceVolatilityRatio: string
    firstThreshold: string
    secondThreshold: string
    reduceProportion: string
    origin: string
  }

  export interface Data {
    market_id: string
    order_density: string
    balance_reduce_ratio: string
    market_order_lower_bound_ratio: string
    market_order_upper_bound_ratio: string
    reservation_price_sensitivity_ratio: string
    reservation_spread_sensitivity_ratio: string
    max_active_capital_utilization_ratio: string
    mid_price_tail_deviation_ratio: string
    min_head_to_tail_deviation_ratio: string
    head_change_tolerance_ratio: string
    min_head_to_mid_deviation_ratio: string
    max_avg_orders_price_deviation_ratio: string
    trade_volatility_group_count: string
    trade_volatility_group_sec: string
    min_trade_volatility_sample_size: string
    default_mid_price_volatility_ratio: string
    first_threshold: string
    second_threshold: string
    reduce_proportion: string
  }
}

export default class ExecArgsUpdateSpotVaultConfig extends ExecArgsBase<
  ExecArgsUpdateSpotVaultConfig.Params,
  ExecArgsUpdateSpotVaultConfig.Data
> {
  static fromJSON(
    params: ExecArgsUpdateSpotVaultConfig.Params,
  ): ExecArgsUpdateSpotVaultConfig {
    return new ExecArgsUpdateSpotVaultConfig(params)
  }

  toData(): ExecArgsUpdateSpotVaultConfig.Data {
    const { params } = this

    return {
      market_id: params.marketId,
      order_density: params.orderDensity,
      balance_reduce_ratio: params.balanceReduceRatio,
      market_order_lower_bound_ratio: params.marketOrderLowerBoundRatio,
      market_order_upper_bound_ratio: params.marketOrderUpperBoundRatio,
      reservation_price_sensitivity_ratio:
        params.reservationPriceSensitivityRatio,
      reservation_spread_sensitivity_ratio:
        params.reservationSpreadSensitivityRatio,
      max_active_capital_utilization_ratio:
        params.maxActiveCapitalUtilizationRatio,
      mid_price_tail_deviation_ratio: params.midPriceTailDeviationRatio,
      min_head_to_tail_deviation_ratio: params.minHeadToTailDeviationRatio,
      head_change_tolerance_ratio: params.headChangeToleranceRatio,
      min_head_to_mid_deviation_ratio: params.minHeadToMidDeviationRatio,
      max_avg_orders_price_deviation_ratio:
        params.maxAvgOrdersPriceDeviationRatio,
      trade_volatility_group_count: params.tradeVolatilityGroupCount,
      trade_volatility_group_sec: params.tradeVolatilityGroupSec,
      min_trade_volatility_sample_size: params.minTradeVolatilitySampleSize,
      default_mid_price_volatility_ratio: params.defaultMidPriceVolatilityRatio,
      first_threshold: params.firstThreshold,
      second_threshold: params.secondThreshold,
      reduce_proportion: params.reduceProportion,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgsUpdateSpotVaultConfig.Data> {
    const { params } = this

    return dataToExecData(this.toData(), {
      origin: params.origin,
      name: 'UpdateSpotVaultConfig',
      action: 'update_spot_vault_config',
    })
  }
}
