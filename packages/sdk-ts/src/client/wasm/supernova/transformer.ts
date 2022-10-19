import { fromBase64 } from '../../../utils'
import {
  WasmContractQueryResponse,
  QueryContractMarketingInfoResponse,
  QueryContractTokenInfoResponse,
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

const formatToString = (value?: string | number) =>
  value ? value.toString() : ''
export class SupernovaQueryTransformer {
  static contractMarketingInfoResponseToContractMarketingInfo(
    response: WasmContractQueryResponse,
  ) {
    const data = fromBase64(response.data) as QueryContractMarketingInfoResponse

    return {
      project: data.project,
      description: data.description,
      logo: data.logo,
      marketing: data.marketing,
    }
  }

  static contractTokenInfoResponseToContractTokenInfo(
    response: WasmContractQueryResponse,
  ) {
    const data = fromBase64(response.data) as QueryContractTokenInfoResponse

    return {
      name: data.name,
      symbol: data.symbol,
      decimals: data.decimals,
      totalSupply: data.total_supply,
    }
  }

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
      cw20CodeId: formatToString(config.cw20_code_id),
      cw20Label: formatToString(config.cw20_label),
      defaultMidPriceVolatilityRatio: formatToString(
        config.default_mid_price_volatility_ratio,
      ),
      emergencyOracleVolatilitySampleSize: formatToString(
        config.emergency_oracle_volatility_sample_size,
      ),
      headChangeToleranceRatio: formatToString(
        config.head_change_tolerance_ratio,
      ),
      headToTailDeviationRatio: formatToString(
        config.head_to_tail_deviation_ratio,
      ),
      lastValidMarkPrice: formatToString(config.last_valid_mark_price),
      leverage: formatToString(config.leverage),
      leveragedActiveCapitalToMaxPositionExposureRatio: formatToString(
        config.leveraged_active_capital_to_max_position_exposure_ratio,
      ),
      lpName: formatToString(config.lp_name),
      lpSymbol: formatToString(config.lp_symbol),
      lpTokenAddress: formatToString(config.lp_token_address),
      marketId: formatToString(config.market_id),
      masterAddress: formatToString(config.master_address),
      maxActiveCapitalUtilizationRatio: formatToString(
        config.max_active_capital_utilization_ratio,
      ),
      minOracleVolatilitySampleSize: formatToString(
        config.min_oracle_volatility_sample_size,
      ),
      minProximityToLiquidation: formatToString(
        config.min_proximity_to_liquidation,
      ),
      minTradeVolatilitySampleSize: formatToString(
        config.min_trade_volatility_sample_size,
      ),
      minVolatilityRatio: formatToString(config.min_volatility_ratio),
      oracleVolatilityGroupSec: formatToString(
        config.oracle_volatility_group_sec,
      ),
      orderDensity: formatToString(config.order_density),
      postReductionPercOfMaxPosition: formatToString(
        config.post_reduction_perc_of_max_position,
      ),
      reservationPriceSensitivityRatio: formatToString(
        config.reservation_price_sensitivity_ratio,
      ),
      reservationSpreadSensitivityRatio: formatToString(
        config.reservation_spread_sensitivity_ratio,
      ),
      tradeVolatilityGroupSec: formatToString(
        config.trade_volatility_group_sec,
      ),
      cw20MarketingInfo: formatToString(config.cw20_marketing_info),
      feeRecipient: formatToString(config.fee_recipient),
      owner: formatToString(config.owner),
      subaccountId: formatToString(config.subaccount_id),
    }
  }

  static vaultContractConfigResponseToSpotVaultContractConfig(
    response: WasmContractQueryResponse,
  ) {
    const { config } = fromBase64(
      response.data,
    ) as QueryVaultContractSpotConfigResponse

    return {
      cw20CodeId: formatToString(config.cw20_code_id),
      cw20Label: formatToString(config.cw20_label),
      defaultMidPriceVolatilityRatio: formatToString(
        config.default_mid_price_volatility_ratio,
      ),
      inventoryImbalanceMarketOrderThreshold: formatToString(
        config.inventory_imbalance_market_order_threshold,
      ),
      headChangeToleranceRatio: formatToString(
        config.head_change_tolerance_ratio,
      ),
      lpName: formatToString(config.lp_name),
      lpSymbol: formatToString(config.lp_symbol),
      lpTokenAddress: formatToString(config.lp_token_address),
      marketId: formatToString(config.market_id),
      marketBuyMidPriceDeviationPercent: formatToString(
        config.market_buy_mid_price_deviation_percent,
      ),
      marketSellMidPriceDeviationPercent: formatToString(
        config.market_sell_mid_price_deviation_percent,
      ),
      masterAddress: formatToString(config.master_address),
      maxActiveCapitalUtilizationRatio: formatToString(
        config.max_active_capital_utilization_ratio,
      ),
      midPriceTailDeviationRatio: formatToString(
        config.mid_price_tail_deviation_ratio,
      ),
      minHeadToMidDeviationRatio: formatToString(
        config.min_head_to_mid_deviation_ratio,
      ),
      minHeadToTailDeviationRatio: formatToString(
        config.min_head_to_tail_deviation_ratio,
      ),
      minTradeVolatilitySampleSize: formatToString(
        config.min_trade_volatility_sample_size,
      ),
      orderDensity: formatToString(config.order_density),
      reservationPriceSensitivityRatio: formatToString(
        config.reservation_price_sensitivity_ratio,
      ),
      reservationSpreadSensitivityRatio: formatToString(
        config.reservation_spread_sensitivity_ratio,
      ),
      targetBaseWeight: formatToString(config.target_base_weight),
      tradeVolatilityGroupCount: formatToString(
        config.trade_volatility_group_count,
      ),
      tradeVolatilityGroupSec: formatToString(
        config.trade_volatility_group_sec,
      ),
      cw20MarketingInfo: formatToString(),
      feeRecipient: formatToString(config.fee_recipient),
      owner: formatToString(config.owner),
      subaccountId: formatToString(config.subaccount_id),
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
      isDerivative: payload.vault.derivative !== undefined,
      masterSubaccountId: payload.master_subaccount_id,
      vaultAddress:
        payload.vault.derivative?.address || payload.vault.spot?.address,
    }))
  }
}
