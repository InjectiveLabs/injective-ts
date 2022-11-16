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
      owner: formatToString(config.owner),
      marketId: formatToString(config.market_id),
      subaccountId: formatToString(config.subaccount_id),
      feeRecipient: formatToString(config.fee_recipient),
      leverage: formatToString(config.leverage),
      orderDensity: formatToString(config.order_density),
      reservationPriceSensitivityRatio: formatToString(
        config.reservation_price_sensitivity_ratio,
      ),
      reservationSpreadSensitivityRatio: formatToString(
        config.reservation_spread_sensitivity_ratio,
      ),
      maxActiveCapitalUtilizationRatio: formatToString(
        config.max_active_capital_utilization_ratio,
      ),
      headChangeToleranceRatio: formatToString(
        config.head_change_tolerance_ratio,
      ),
      headToTailDeviationRatio: formatToString(
        config.head_to_tail_deviation_ratio,
      ),
      signedMinHeadToFairPriceDeviationRatio: formatToString(
        config.signed_min_head_to_fair_price_deviation_ratio,
      ),
      signedMinHeadToTobDeviationRatio: formatToString(
        config.signed_min_head_to_tob_deviation_ratio,
      ),
      minProximityToLiquidation: formatToString(
        config.min_proximity_to_liquidation,
      ),
      postReductionPercOfMaxPosition: formatToString(
        config.post_reduction_perc_of_max_position,
      ),
      oracleVolatilityGroupSec: formatToString(
        config.oracle_volatility_group_sec,
      ),
      minOracleVolatilitySampleSize: formatToString(
        config.min_oracle_volatility_sample_size,
      ),
      emergencyOracleVolatilitySampleSize: formatToString(
        config.emergency_oracle_volatility_sample_size,
      ),
      tradeVolatilityGroupSec: formatToString(
        config.trade_volatility_group_sec,
      ),
      minTradeVolatilitySampleSize: formatToString(
        config.min_trade_volatility_sample_size,
      ),
      defaultMidPriceVolatilityRatio: formatToString(
        config.default_mid_price_volatility_ratio,
      ),
      minVolatilityRatio: formatToString(config.min_volatility_ratio),
      lastValidMarkPrice: formatToString(config.last_valid_mark_price),
      masterAddress: formatToString(config.master_address),
    }
  }

  static vaultContractConfigResponseToSpotVaultContractConfig(
    response: WasmContractQueryResponse,
  ) {
    const { config } = fromBase64(
      response.data,
    ) as QueryVaultContractSpotConfigResponse

    return {
      defaultMidPriceVolatilityRatio: formatToString(
        config.default_mid_price_volatility_ratio,
      ),
      fairPriceTailDeviationRatio: formatToString(
        config.fair_price_tail_deviation_ratio,
      ),
      feeRecipient: formatToString(config.fee_recipient),
      headChangeToleranceRatio: formatToString(
        config.head_change_tolerance_ratio,
      ),
      marketId: formatToString(config.market_id),
      masterAddress: formatToString(config.master_address),
      maxActiveCapitalUtilizationRatio: formatToString(
        config.max_active_capital_utilization_ratio,
      ),
      minHeadToTailDeviationRatio: formatToString(
        config.min_head_to_tail_deviation_ratio,
      ),
      minTradeVolatilitySampleSize: formatToString(
        config.min_trade_volatility_sample_size,
      ),
      oracleType: formatToString(config.oracle_type),
      orderDensity: formatToString(config.order_density),
      owner: formatToString(config.owner),
      reservationPriceSensitivityRatio: formatToString(
        config.reservation_price_sensitivity_ratio,
      ),
      reservationSpreadSensitivityRatio: formatToString(
        config.reservation_spread_sensitivity_ratio,
      ),
      signedMinHeadToFairPriceDeviationRatio: formatToString(
        config.signed_min_head_to_fair_price_deviation_ratio,
      ),
      signedMinHeadToTobDeviationRatio: formatToString(
        config.signed_min_head_to_tob_deviation_ratio,
      ),
      subaccountId: formatToString(config.subaccount_id),
      targetBaseWeight: formatToString(config.target_base_weight),
      tradeVolatilityGroupCount: formatToString(
        config.trade_volatility_group_count,
      ),
      tradeVolatilityGroupSec: formatToString(
        config.trade_volatility_group_sec,
      ),
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
