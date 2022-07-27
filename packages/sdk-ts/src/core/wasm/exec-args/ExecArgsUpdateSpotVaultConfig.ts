import {
  dataToExecData,
  ExecArgsBase,
  ExecDataRepresentation,
} from '../../ExecArgsBase'

export declare namespace ExecArgsUpdateSpotVaultConfig {
  export interface Params {
    marketId: string
    orderDensity: string
    secondThreshold: string
    firstThreshold: string
    reduceProportion: string
    marketOrderUpperBoundRatio: string
    marketOrderLowerBoundRatio: string
    balanceReduceRatio: string
    reservationPriceSensitivityRatio: string
    reservationSpreadSensitivityRatio: string
    maxActiveCapitalUtilizationRatio: string
    headChangeToleranceRatio: string
    midPriceTailDeviationRatio: string
    minHeadToTailDeviationRatio: string
    minHeadToMidDeviationRatio: string
    maxAvgOrdersPriceDeviationRatio: string
    tradeVolatilityGroupCount: string
    tradeVolatilityGroupSec: string
    minTradeVolatilitySampleSize: string
    defaultMidPriceVolatilityRatio: string
    origin: string
  }

  export interface Data {
    market_id: string
    order_density: string
    second_threshold: string
    first_threshold: string
    reduce_proportion: string
    market_order_upper_bound_ratio: string
    market_order_lower_bound_ratio: string
    balance_reduce_ratio: string
    reservation_price_sensitivity_ratio: string
    reservation_spread_sensitivity_ratio: string
    max_active_capital_utilization_ratio: string
    head_change_tolerance_ratio: string
    mid_price_tail_deviation_ratio: string
    min_head_to_tail_deviation_ratio: string
    min_head_to_mid_deviation_ratio: string
    max_avg_orders_price_deviation_ratio: string
    trade_volatility_group_count: string
    trade_volatility_group_sec: string
    min_trade_volatility_sample_size: string
    default_mid_price_volatility_ratio: string
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
      second_threshold: params.secondThreshold,
      first_threshold: params.firstThreshold,
      reduce_proportion: params.reduceProportion,
      market_order_upper_bound_ratio: params.marketOrderUpperBoundRatio,
      market_order_lower_bound_ratio: params.marketOrderLowerBoundRatio,
      balance_reduce_ratio: params.balanceReduceRatio,
      reservation_price_sensitivity_ratio:
        params.reservationPriceSensitivityRatio,
      reservation_spread_sensitivity_ratio:
        params.reservationSpreadSensitivityRatio,
      max_active_capital_utilization_ratio:
        params.maxActiveCapitalUtilizationRatio,
      head_change_tolerance_ratio: params.headChangeToleranceRatio,
      mid_price_tail_deviation_ratio: params.midPriceTailDeviationRatio,
      min_head_to_tail_deviation_ratio: params.minHeadToTailDeviationRatio,
      min_head_to_mid_deviation_ratio: params.minHeadToMidDeviationRatio,
      max_avg_orders_price_deviation_ratio:
        params.maxAvgOrdersPriceDeviationRatio,
      trade_volatility_group_count: params.tradeVolatilityGroupCount,
      trade_volatility_group_sec: params.tradeVolatilityGroupSec,
      min_trade_volatility_sample_size: params.minTradeVolatilitySampleSize,
      default_mid_price_volatility_ratio: params.defaultMidPriceVolatilityRatio,
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
