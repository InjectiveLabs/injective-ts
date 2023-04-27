import { toUtf8 } from '../../../utils'
import {
  VaultAMMConfig,
  VaultBaseConfig,
  VaultSpotConfig,
  VaultDerivativeConfig,
  VaultMarketMakingConfig,
  WasmContractQueryResponse,
  QueryVaultMarketIdResponse,
  QueryLockedLpFundsResponse,
  QueryRegisteredVaultResponse,
  QueryVaultContractBaseConfig,
  QueryVaultContractMarketMaking,
  QueryContractTokenInfoResponse,
  QueryMastContractConfigResponse,
  QueryVaultTotalLpSupplyResponse,
  QueryVaultUserLpBalanceResponse,
  QueryVaultContractAMMConfigResponse,
  QueryContractMarketingInfoResponse,
  QueryVaultContractSpotConfigResponse,
  QueryVaultUserLpContractAllowanceResponse,
  QueryVaultContractDerivativeConfigResponse,
} from './types'

/**
 * @hidden
 */

const formatToString = (value?: string | number) =>
  value ? value.toString() : ''
export class MitoQueryTransformer {
  static contractMarketingInfoResponseToContractMarketingInfo(
    response: WasmContractQueryResponse,
  ) {
    const data = JSON.parse(
      toUtf8(response.data),
    ) as QueryContractMarketingInfoResponse

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
    const data = JSON.parse(
      toUtf8(response.data),
    ) as QueryContractTokenInfoResponse

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
    const data = JSON.parse(
      toUtf8(response.data),
    ) as QueryMastContractConfigResponse

    return {
      distributionContract: data.distribution_contract,
      ninjaToken: data.ninja_token,
      owner: data.owner,
    }
  }

  static vaultContractBaseConfigResponseToBaseConfig(
    config: QueryVaultContractBaseConfig,
  ): VaultBaseConfig {
    return {
      owner: formatToString(config.owner),
      marketId: formatToString(config.market_id),
      subaccountId: formatToString(config.subaccount_id),
      feeRecipient: formatToString(config.fee_recipient),
      masterAddress: formatToString(config.master_address),
      orderDensity: Number(config.order_density),
      notionalValueCap: formatToString(config.notional_value_cap),
    }
  }

  static vaultContractMarketMakingResponseToMarketMaking(
    config: QueryVaultContractMarketMaking,
  ): VaultMarketMakingConfig {
    return {
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
      tradeVolatilityGroupSec: Number(config.trade_volatility_group_sec),
      minTradeVolatilitySampleSize: Number(
        config.min_trade_volatility_sample_size,
      ),
      defaultMidPriceVolatilityRatio: formatToString(
        config.default_mid_price_volatility_ratio,
      ),
      minVolatilityRatio: formatToString(config.min_volatility_ratio),
    }
  }

  static vaultContractConfigResponseToAMMVaultConfig(
    response: WasmContractQueryResponse,
  ): VaultAMMConfig {
    const { config } = JSON.parse(
      toUtf8(response.data),
    ) as QueryVaultContractAMMConfigResponse

    return {
      base: MitoQueryTransformer.vaultContractBaseConfigResponseToBaseConfig(
        config.base,
      ),
      priceTickSize: formatToString(config.price_tick_size),
      maxInvariantSensitivity: formatToString(config.max_invariant_sensitivity),
      baseDecimals: Number(config.base_decimals),
      quoteDecimals: Number(config.quote_decimals),
    }
  }

  static vaultContractConfigResponseToDerivativeVaultConfig(
    response: WasmContractQueryResponse,
  ): VaultDerivativeConfig {
    const { config } = JSON.parse(
      toUtf8(response.data),
    ) as QueryVaultContractDerivativeConfigResponse

    return {
      base: MitoQueryTransformer.vaultContractBaseConfigResponseToBaseConfig(
        config.base,
      ),
      marketMaking:
        MitoQueryTransformer.vaultContractMarketMakingResponseToMarketMaking(
          config.market_making,
        ),
      leverage: formatToString(config.leverage),
      minProximityToLiquidation: formatToString(
        config.min_proximity_to_liquidation,
      ),
      postReductionPercOfMaxPosition: formatToString(
        config.post_reduction_perc_of_max_position,
      ),
      oracleVolatilityGroupSec: Number(config.oracle_volatility_group_sec),
      minOracleVolatilitySampleSize: Number(
        config.min_oracle_volatility_sample_size,
      ),
      emergencyOracleVolatilitySampleSize: Number(
        config.emergency_oracle_volatility_sample_size,
      ),
      lastValidMarkPrice: formatToString(config.last_valid_mark_price),
      allowedRedemptionTypes: Number(config.allowed_redemption_types),
      positionPnlPenalty: formatToString(config.position_pnl_penalty),
      quoteDecimals: Number(config.quote_decimals),
    }
  }

  static vaultContractConfigResponseToSpotVaultContractConfig(
    response: WasmContractQueryResponse,
  ): VaultSpotConfig {
    const { config } = JSON.parse(
      toUtf8(response.data),
    ) as QueryVaultContractSpotConfigResponse

    return {
      base: MitoQueryTransformer.vaultContractBaseConfigResponseToBaseConfig(
        config.base,
      ),
      marketMaking:
        MitoQueryTransformer.vaultContractMarketMakingResponseToMarketMaking(
          config.market_making,
        ),
      oracleType: Number(config.oracle_type),
      reservationPriceTailDeviationRatio: formatToString(
        config.reservation_price_tail_deviation_ratio,
      ),
      targetBaseWeight: formatToString(config.target_base_weight),
      allowedRedemptionTypes: Number(config.allowed_redemption_types),
      baseDecimals: Number(config.base_decimals),
      quoteDecimals: Number(config.quote_decimals),
      baseOracleSymbol: formatToString(config.base_oracle_symbol),
      quoteOracleSymbol: formatToString(config.quote_oracle_symbol),
    }
  }

  static vaultUserLpAllowanceResponseToVaultUserLpAllowance(
    response: WasmContractQueryResponse,
  ) {
    const data = JSON.parse(
      toUtf8(response.data),
    ) as QueryVaultUserLpContractAllowanceResponse

    return {
      allowance: data.allowance,
    }
  }

  static vaultMarketIdResponseToVaultMarketId(
    response: WasmContractQueryResponse,
  ) {
    const data = JSON.parse(toUtf8(response.data)) as QueryVaultMarketIdResponse

    return { marketId: data.market_id }
  }

  static vaultTotalLpSupplyResponseToVaultTotalLpSupply(
    response: WasmContractQueryResponse,
  ) {
    const data = JSON.parse(
      toUtf8(response.data),
    ) as QueryVaultTotalLpSupplyResponse

    return { totalSupply: data.total_supply }
  }

  static vaultUserLpBalanceResponseToVaultUserLpBalance(
    response: WasmContractQueryResponse,
  ) {
    const data = JSON.parse(
      toUtf8(response.data),
    ) as QueryVaultUserLpBalanceResponse

    return { balance: data.balance }
  }

  static vaultUserLockedLpFundsResponseToVaultUserLockedLpFunds(
    response: WasmContractQueryResponse,
  ) {
    const data = JSON.parse(toUtf8(response.data)) as QueryLockedLpFundsResponse

    return { amount: data.amount, lockTime: data.lock_time }
  }

  static registeredVaultsResponseToRegisteredVaults(
    response: WasmContractQueryResponse,
  ) {
    const data = JSON.parse(
      toUtf8(response.data),
    ) as QueryRegisteredVaultResponse

    return data.registered_vaults.map((payload) => ({
      isDerivative: payload.vault.derivative !== undefined,
      masterSubaccountId: payload.master_subaccount_id,
      vaultAddress:
        payload.vault.derivative?.address || payload.vault.spot?.address,
    }))
  }
}
