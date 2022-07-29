import {
  dataToExecData,
  ExecArgsBase,
  ExecDataRepresentation,
} from '../../ExecArgsBase'

export declare namespace ExecArgsInstantiateDerivativeVault {
  export interface Params {
    masterAddress: string
    marketId: string
    leverage: string
    orderDensity: string
    reservationPriceSensitivityRatio: string
    reservationSpreadSensitivityRatio: string
    maxActiveCapitalUtilizationRatio: string
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
    lastValidMarkPrice: string
    cw20CodeId: number
    lpName: string
    lpSymbol: string
    cw20Label: string
    origin: string
  }

  export interface Data {
    master_address: string
    market_id: string
    leverage: string
    order_density: string
    reservation_price_sensitivity_ratio: string
    reservation_spread_sensitivity_ratio: string
    max_active_capital_utilization_ratio: string
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
    last_valid_mark_price: string
    cw20_code_id: number
    lp_name: string
    lp_symbol: string
    cw20_label: string
  }
}

export default class ExecArgsInstantiateDerivativeVault extends ExecArgsBase<
  ExecArgsInstantiateDerivativeVault.Params,
  ExecArgsInstantiateDerivativeVault.Data
> {
  static fromJSON(
    params: ExecArgsInstantiateDerivativeVault.Params,
  ): ExecArgsInstantiateDerivativeVault {
    return new ExecArgsInstantiateDerivativeVault(params)
  }

  toData(): ExecArgsInstantiateDerivativeVault.Data {
    const { params } = this

    return {
      master_address: params.masterAddress,
      market_id: params.marketId,
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
      last_valid_mark_price: params.lastValidMarkPrice,
      cw20_code_id: params.cw20CodeId,
      lp_name: params.lpName,
      lp_symbol: params.lpSymbol,
      cw20_label: params.cw20Label,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgsInstantiateDerivativeVault.Data> {
    const { params } = this

    return dataToExecData(this.toData(), {
      origin: params.origin,
      name: 'InstantiateDerivativeVaultMsg',
      action: 'instantiate_derivative_vault_msg',
    })
  }
}
