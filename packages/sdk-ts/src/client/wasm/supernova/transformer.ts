import { fromBase64 } from '../../../utils'
import {
  WasmContractQueryResponse,
  QueryContractMarketingInfoResponse,
  QueryContractTokenInfoResponse,
  QueryMastContractConfigResponse,
  QueryRegisteredVaultResponse,
  QueryVaultContractBaseConfig,
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

  static vaultContractBaseConfigResponseToBaseConfig(
    config: QueryVaultContractBaseConfig,
  ) {
    return {
      owner: formatToString(config.owner),
      marketId: formatToString(config.market_id),
      subaccountId: formatToString(config.subaccount_id),
      feeRecipient: formatToString(config.fee_recipient),
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
      minHeadToTailDeviationRatio: formatToString(
        config.min_head_to_tail_deviation_ratio,
      ),
      signedMinHeadToFairPriceDeviationRatio: formatToString(
        config.signed_min_head_to_fair_price_deviation_ratio,
      ),
      signedMinHeadToTobDeviationRatio: formatToString(
        config.signed_min_head_to_tob_deviation_ratio,
      ),
      tradeVolatilityGroupSec: formatToString(
        config.trade_volatility_group_sec,
      ),
      defaultMidPriceVolatilityRatio: formatToString(
        config.default_mid_price_volatility_ratio,
      ),
      minTradeVolatilitySampleSize: formatToString(
        config.min_trade_volatility_sample_size,
      ),
      minVolatilityRatio: formatToString(config.min_volatility_ratio),
      masterAddress: formatToString(config.master_address),
      redemptionLockTime: formatToString(config.redemption_lock_time),
    }
  }

  static vaultContractConfigResponseToDerivativeVaultConfig(
    response: WasmContractQueryResponse,
  ) {
    const { config } = fromBase64(
      response.data,
    ) as QueryVaultContractDerivativeConfigResponse

    return {
      ...SupernovaQueryTransformer.vaultContractBaseConfigResponseToBaseConfig(
        config.base_config,
      ),
      leverage: formatToString(config.leverage),
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
      lastValidMarkPrice: formatToString(config.last_valid_mark_price),
      allowedSubscriptionTypes: formatToString(
        config.allowed_subscription_types,
      ),
      allowedRedemptionTypes: formatToString(config.allowed_redemption_types),
    }
  }

  static vaultContractConfigResponseToSpotVaultContractConfig(
    response: WasmContractQueryResponse,
  ) {
    const { config } = fromBase64(
      response.data,
    ) as QueryVaultContractSpotConfigResponse

    return {
      ...SupernovaQueryTransformer.vaultContractBaseConfigResponseToBaseConfig(
        config.base_config,
      ),
      oracleType: formatToString(config.oracle_type),
      fairPriceTailDeviationRatio: formatToString(
        config.fair_price_tail_deviation_ratio,
      ),
      targetBaseWeight: formatToString(config.target_base_weight),
      allowedSubscriptionTypes: formatToString(
        config.allowed_subscription_types,
      ),
      allowedRedemptionTypes: formatToString(config.allowed_redemption_types),
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
