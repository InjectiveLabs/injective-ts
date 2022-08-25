import { fromBase64 } from '../../../utils'
import {
  WasmContractQueryResponse,
  QueryMastContractConfigResponse,
  QueryRegisteredVaultResponse,
  QueryVaultUserLpContractAllowanceResponse,
  QueryVaultContractDerivativeConfigResponse,
  QueryVaultContractSpotConfigResponse,
  QueryVaultMarketIdResponse,
  QueryVaultTotalLpSupplyResponse,
  QueryVaultUserLpBalanceResponse,
} from './types'

/**
 * @hidden
 */
export class SupernovaQueryTransformer {
  static masterContractConfigResponseToMasterContractConfig(
    response: WasmContractQueryResponse,
  ) {
    const data = fromBase64(response.data) as QueryMastContractConfigResponse

    return {
      distributionContract: data.distribution_contract,
      ninjaToken: data.ninja_token,
      owner: data.owner,
    }
  }

  static vaultContractConfigResponseToDerivativeVaultConfig(
    response: WasmContractQueryResponse,
  ) {
    const { config } = fromBase64(
      response.data,
    ) as QueryVaultContractDerivativeConfigResponse

    return {
      cw20CodeId: config.cw20_code_id || '',
      cw20Label: config.cw20_label || '',
      defaultMidPriceVolatilityRatio:
        config.default_mid_price_volatility_ratio || '',
      emergencyOracleVolatilitySampleSize:
        config.emergency_oracle_volatility_sample_size || '',
      headChangeToleranceRatio: config.head_change_tolerance_ratio || '',
      headToTailDeviationRatio: config.head_to_tail_deviation_ratio || '',
      lastValidMarkPrice: config.last_valid_mark_price || '',
      leverage: config.leverage || '',
      leveragedActiveCapitalToMaxPositionExposureRatio:
        config.leveraged_active_capital_to_max_position_exposure_ratio || '',
      lpName: config.lp_name || '',
      lpSymbol: config.lp_symbol || '',
      lpTokenAddress: config.lp_token_address || '',
      marketId: config.market_id || '',
      masterAddress: config.master_address || '',
      maxActiveCapitalUtilizationRatio:
        config.max_active_capital_utilization_ratio || '',
      minOracleVolatilitySampleSize:
        config.min_oracle_volatility_sample_size || '',
      minProximityToLiquidation: config.min_proximity_to_liquidation || '',
      minTradeVolatilitySampleSize:
        config.min_trade_volatility_sample_size || '',
      minVolatilityRatio: config.min_volatility_ratio || '',
      oracleVolatilityGroupSec: config.oracle_volatility_group_sec || '',
      orderDensity: config.order_density || '',
      postReductionPercOfMaxPosition:
        config.post_reduction_perc_of_max_position || '',
      reservationPriceSensitivityRatio:
        config.reservation_price_sensitivity_ratio || '',
      reservationSpreadSensitivityRatio:
        config.reservation_spread_sensitivity_ratio || '',
      tradeVolatilityGroupSec: config.trade_volatility_group_sec || '',
      cw20MarketingInfo: config.cw20_marketing_info || '',
      feeRecipient: config.fee_recipient || '',
      owner: config.owner || '',
      subaccountId: config.subaccount_id || '',
    }
  }

  static vaultContractConfigResponseToSpotVaultContractConfig(
    response: WasmContractQueryResponse,
  ) {
    const { config } = fromBase64(
      response.data,
    ) as QueryVaultContractSpotConfigResponse

    return {
      balanceReduceRatio: config.balance_reduce_ratio || '',
      cw20CodeId: config.cw20_code_id || '',
      cw20Label: config.cw20_label || '',
      defaultMidPriceVolatilityRatio:
        config.default_mid_price_volatility_ratio || '',
      firstThreshold: config.first_threshold || '',
      headChangeToleranceRatio: config.head_change_tolerance_ratio || '',
      lpName: config.lp_name || '',
      lpSymbol: config.lp_symbol || '',
      lpTokenAddress: config.lp_token_address || '',
      marketId: config.market_id || '',
      marketOrderLowerBoundRatio: config.market_order_lower_bound_ratio || '',
      marketOrderUpperBoundRatio: config.market_order_upper_bound_ratio || '',
      masterAddress: config.master_address || '',
      maxActiveCapitalUtilizationRatio:
        config.max_active_capital_utilization_ratio || '',
      maxAvgOrdersPriceDeviationRatio:
        config.max_avg_orders_price_deviation_ratio || '',
      midPriceTailDeviationRatio: config.mid_price_tail_deviation_ratio || '',
      minHeadToMidDeviationRatio: config.min_head_to_mid_deviation_ratio || '',
      minHeadToTailDeviationRatio:
        config.min_head_to_tail_deviation_ratio || '',
      minTradeVolatilitySampleSize:
        config.min_trade_volatility_sample_size || '',
      orderDensity: config.order_density || '',
      reduceProportion: config.reduce_proportion || '',
      reservationPriceSensitivityRatio:
        config.reservation_price_sensitivity_ratio || '',
      reservationSpreadSensitivityRatio:
        config.reservation_spread_sensitivity_ratio || '',
      secondThreshold: config.second_threshold || '',
      tradeVolatilityGroupCount: config.trade_volatility_group_count || '',
      tradeVolatilityGroupSec: config.trade_volatility_group_sec || '',
      cw20MarketingInfo: config.cw20_marketing_info,
      feeRecipient: config.fee_recipient || '',
      owner: config.owner || '',
      subaccountId: config.subaccount_id || '',
    }
  }

  static vaultUserLpAllowanceResponseToVaultUserLpAllowance(
    response: WasmContractQueryResponse,
  ) {
    const data = fromBase64(
      response.data,
    ) as QueryVaultUserLpContractAllowanceResponse

    return {
      allowance: data.allowance,
    }
  }

  static vaultMarketIdResponseToVaultMarketId(
    response: WasmContractQueryResponse,
  ) {
    const data = fromBase64(response.data) as QueryVaultMarketIdResponse

    return { marketId: data.market_id }
  }

  static vaultTotalLpSupplyResponseToVaultTotalLpSupply(
    response: WasmContractQueryResponse,
  ) {
    const data = fromBase64(response.data) as QueryVaultTotalLpSupplyResponse

    return { totalSupply: data.total_supply }
  }

  static vaultUserLpBalanceResponseToVaultUserLpBalance(
    response: WasmContractQueryResponse,
  ) {
    const data = fromBase64(response.data) as QueryVaultUserLpBalanceResponse

    return { balance: data.balance }
  }

  static registeredVaultsResponseToRegisteredVaults(
    response: WasmContractQueryResponse,
  ) {
    const data = fromBase64(response.data) as QueryRegisteredVaultResponse

    return data.registered_vaults.map((payload) => ({
      masterSubaccountId: payload.master_subaccount_id,
      vaultAddress: payload.vault_address,
    }))
  }
}
