import { toHumanReadable } from '@injectivelabs/utils'
import { denomAmountFromGrpcChainDenomAmount } from './../../../utils/numbers.js'
import type * as InjectiveExchangeV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/query_pb'
import type * as InjectiveExchangeV1Beta1GenesisPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/genesis_pb'
import type * as InjectiveExchangeV1Beta1ExchangePb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/exchange_pb'
import type { SpotMarket } from '../../indexer/types/spot.js'
import type { DerivativeMarket } from '../../indexer/types/derivatives.js'
import type {
  GrpcChainSpotMarket,
  GrpcChainFullSpotMarket,
  GrpcChainFullDerivativeMarket,
} from '../types/exchange.js'
import type {
  ChainPosition,
  ChainDenomDecimal,
  GrpcChainPosition,
  FeeDiscountTierTTL,
  FeeDiscountSchedule,
  FeeDiscountTierInfo,
  ExchangeModuleParams,
  ChainDenomMinNotional,
  FeeDiscountAccountInfo,
  GrpcFeeDiscountTierTTL,
  ChainDerivativePosition,
} from '../types/exchange.js'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcExchangeTransformer {
  static moduleStateResponseToModuleState(
    response: InjectiveExchangeV1Beta1QueryPb.QueryModuleStateResponse,
  ): InjectiveExchangeV1Beta1GenesisPb.GenesisState {
    if (!response.state) {
      throw new Error('Exchange module state not found in response')
    }

    return response.state
  }

  static moduleParamsResponseToParams(
    response: InjectiveExchangeV1Beta1QueryPb.QueryExchangeParamsResponse,
  ): ExchangeModuleParams {
    const params = response.params!
    const spotMarketInstantListingFee = params.spotMarketInstantListingFee
    const derivativeMarketInstantListingFee =
      params.derivativeMarketInstantListingFee

    return {
      spotMarketInstantListingFee: spotMarketInstantListingFee
        ? {
            amount: spotMarketInstantListingFee.amount,
            denom: spotMarketInstantListingFee.denom,
          }
        : undefined,
      derivativeMarketInstantListingFee: derivativeMarketInstantListingFee
        ? {
            amount: derivativeMarketInstantListingFee.amount,
            denom: derivativeMarketInstantListingFee.denom,
          }
        : undefined,
      defaultSpotMakerFeeRate: params.defaultSpotMakerFeeRate,
      defaultSpotTakerFeeRate: params.defaultSpotTakerFeeRate,
      defaultDerivativeMakerFeeRate: params.defaultDerivativeMakerFeeRate,
      defaultDerivativeTakerFeeRate: params.defaultDerivativeTakerFeeRate,
      defaultInitialMarginRatio: params.defaultInitialMarginRatio,
      defaultMaintenanceMarginRatio: params.defaultMaintenanceMarginRatio,
      defaultFundingInterval: parseInt(
        params.defaultFundingInterval.toString(),
        10,
      ),
      fundingMultiple: parseInt(params.fundingMultiple.toString(), 10),
      relayerFeeShareRate: params.relayerFeeShareRate,
      defaultHourlyFundingRateCap: params.defaultHourlyFundingRateCap,
      defaultHourlyInterestRate: params.defaultHourlyInterestRate,
      maxDerivativeOrderSideCount: params.maxDerivativeOrderSideCount,
      injRewardStakedRequirementThreshold:
        params.injRewardStakedRequirementThreshold,
      tradingRewardsVestingDuration: parseInt(
        params.tradingRewardsVestingDuration.toString(),
        10,
      ),
      liquidatorRewardShareRate: params.liquidatorRewardShareRate,
      binaryOptionsMarketInstantListingFee:
        params.binaryOptionsMarketInstantListingFee
          ? {
              amount: params.binaryOptionsMarketInstantListingFee.amount,
              denom: params.binaryOptionsMarketInstantListingFee.denom,
            }
          : undefined,
      atomicMarketOrderAccessLevel:
        params.atomicMarketOrderAccessLevel.toString(),
      spotAtomicMarketOrderFeeMultiplier:
        params.spotAtomicMarketOrderFeeMultiplier,
      derivativeAtomicMarketOrderFeeMultiplier:
        params.derivativeAtomicMarketOrderFeeMultiplier,
      binaryOptionsAtomicMarketOrderFeeMultiplier:
        params.binaryOptionsAtomicMarketOrderFeeMultiplier,
      minimalProtocolFeeRate: params.minimalProtocolFeeRate,
      isInstantDerivativeMarketLaunchEnabled:
        params.isInstantDerivativeMarketLaunchEnabled,
      postOnlyModeHeightThreshold:
        params.postOnlyModeHeightThreshold.toString(),
      marginDecreasePriceTimestampThresholdSeconds:
        params.marginDecreasePriceTimestampThresholdSeconds.toString(),
      exchangeAdmins: params.exchangeAdmins,
    }
  }

  static feeDiscountScheduleResponseToFeeDiscountSchedule(
    response: InjectiveExchangeV1Beta1QueryPb.QueryFeeDiscountScheduleResponse,
  ): FeeDiscountSchedule {
    const schedule = response.feeDiscountSchedule!

    return {
      bucketCount: parseInt(schedule.bucketCount.toString(), 10),
      bucketDuration: parseInt(schedule.bucketDuration.toString(), 10),
      quoteDenomsList: schedule.quoteDenoms,
      tierInfosList: schedule.tierInfos
        .map(
          ChainGrpcExchangeTransformer.grpcFeeDiscountTierInfoToFeeDiscountTierInfo,
        )
        .filter(
          (
            info: FeeDiscountTierInfo | undefined,
          ): info is FeeDiscountTierInfo => info !== undefined,
        ) as FeeDiscountTierInfo[],
      disqualifiedMarketIdsList: schedule.disqualifiedMarketIds,
    }
  }

  static feeDiscountAccountInfoResponseToFeeDiscountAccountInfo(
    response: InjectiveExchangeV1Beta1QueryPb.QueryFeeDiscountAccountInfoResponse,
  ): FeeDiscountAccountInfo {
    return {
      tierLevel: Number(response.tierLevel),
      accountInfo:
        ChainGrpcExchangeTransformer.grpcFeeDiscountTierInfoToFeeDiscountTierInfo(
          response.accountInfo,
        ),
      accountTtl:
        ChainGrpcExchangeTransformer.grpcFeeDiscountTierTTLToFeeDiscountTierTTL(
          response.accountTtl!,
        ),
    }
  }

  static grpcFeeDiscountTierInfoToFeeDiscountTierInfo(
    info?: FeeDiscountTierInfo,
  ): FeeDiscountTierInfo | undefined {
    if (!info) {
      return
    }

    return {
      makerDiscountRate: info.makerDiscountRate,
      takerDiscountRate: info.takerDiscountRate,
      stakedAmount: info.stakedAmount,
      volume: info.volume == undefined ? '0' : info.volume,
    }
  }

  static grpcFeeDiscountTierTTLToFeeDiscountTierTTL(
    info?: GrpcFeeDiscountTierTTL,
  ): FeeDiscountTierTTL | undefined {
    if (!info) {
      return
    }

    return {
      tier: parseInt(info.tier.toString(), 10),
      ttlTimestamp: parseInt(info.ttlTimestamp.toString(), 10),
    }
  }

  static grpcPositionToPosition(position: GrpcChainPosition): ChainPosition {
    return {
      islong: position.isLong,
      ...position,
    }
  }

  static positionsResponseToPositions(
    response: InjectiveExchangeV1Beta1QueryPb.QueryPositionsResponse,
  ): ChainDerivativePosition[] {
    return response.state.map((position) => {
      return {
        subaccountId: position.subaccountId,
        marketId: position.marketId,
        position: ChainGrpcExchangeTransformer.grpcPositionToPosition(
          position.position!,
        ),
      }
    })
  }

  static activeStakeGrantResponseToActiveStakeGrant(
    response: InjectiveExchangeV1Beta1QueryPb.QueryActiveStakeGrantResponse,
  ): {
    grant: InjectiveExchangeV1Beta1ExchangePb.ActiveGrant
    effectiveGrant: InjectiveExchangeV1Beta1ExchangePb.EffectiveGrant
  } {
    return {
      grant: response.grant!,
      effectiveGrant: response.effectiveGrant!,
    }
  }

  static denomMinNotionalResponseToDenomMinNotional(
    response: InjectiveExchangeV1Beta1QueryPb.QueryDenomMinNotionalResponse,
  ): string {
    return response.amount
  }

  static denomDecimalsResponseToDenomDecimals(
    response: InjectiveExchangeV1Beta1QueryPb.QueryDenomDecimalsResponse,
  ): ChainDenomDecimal[] {
    return response.denomDecimals.map((denomDecimals) => ({
      denom: denomDecimals.denom,
      decimals: denomDecimals.decimals.toString(),
    }))
  }

  static denomMinNotionalsResponseToDenomMinNotionals(
    response: InjectiveExchangeV1Beta1QueryPb.QueryDenomMinNotionalsResponse,
  ): ChainDenomMinNotional[] {
    return response.denomMinNotionals.map((denomDecimals) => ({
      denom: denomDecimals.denom,
      minNotional: toHumanReadable(denomDecimals.minNotional).toFixed(),
    }))
  }

  static spotMarketsResponseToSpotMarkets(
    response: InjectiveExchangeV1Beta1QueryPb.QuerySpotMarketsResponse,
  ): SpotMarket[] {
    return response.markets.map((market) => {
      return ChainGrpcExchangeTransformer.grpcSpotMarketToSpotMarket(market)
    })
  }

  static grpcSpotMarketToSpotMarket(market: GrpcChainSpotMarket): SpotMarket {
    const marketInfo = market

    return {
      marketId: marketInfo.marketId,
      marketStatus: marketInfo.status.toString(),
      ticker: marketInfo.ticker,
      baseDenom: marketInfo.baseDenom,
      quoteDenom: marketInfo.quoteDenom,
      makerFeeRate: denomAmountFromGrpcChainDenomAmount(
        marketInfo.makerFeeRate,
      ).toFixed(),
      quoteToken: undefined,
      baseToken: undefined,
      takerFeeRate: denomAmountFromGrpcChainDenomAmount(
        marketInfo.takerFeeRate,
      ).toFixed(),
      serviceProviderFee: '',
      minPriceTickSize: denomAmountFromGrpcChainDenomAmount(
        marketInfo.minPriceTickSize,
      ).toNumber(),
      minQuantityTickSize: denomAmountFromGrpcChainDenomAmount(
        marketInfo.minQuantityTickSize,
      ).toNumber(),
      minNotional: denomAmountFromGrpcChainDenomAmount(
        marketInfo.minNotional,
      ).toNumber(),
    }
  }

  static fullSpotMarketsResponseToSpotMarkets(
    response: InjectiveExchangeV1Beta1QueryPb.QueryFullSpotMarketsResponse,
  ): SpotMarket[] {
    return response.markets.map((market) => {
      return ChainGrpcExchangeTransformer.grpcFullSpotMarketToSpotMarket(market)
    })
  }

  static grpcFullSpotMarketToSpotMarket(
    market: GrpcChainFullSpotMarket,
  ): SpotMarket {
    const marketInfo = market.market!

    return {
      marketId: marketInfo.marketId,
      marketStatus: marketInfo.status.toString(),
      ticker: marketInfo.ticker,
      baseDenom: marketInfo.baseDenom,
      quoteDenom: marketInfo.quoteDenom,
      makerFeeRate: marketInfo.makerFeeRate,
      quoteToken: undefined,
      baseToken: undefined,
      takerFeeRate: marketInfo.takerFeeRate,
      serviceProviderFee: '',
      minPriceTickSize: Number(marketInfo.minPriceTickSize),
      minQuantityTickSize: Number(marketInfo.minQuantityTickSize),
      minNotional: Number(marketInfo.minNotional),
    }
  }

  static fullDerivativeMarketsResponseToDerivativeMarkets(
    response: InjectiveExchangeV1Beta1QueryPb.QueryDerivativeMarketsResponse,
  ): DerivativeMarket[] {
    return response.markets.map((market) => {
      return ChainGrpcExchangeTransformer.grpcFullDerivativeMarketToDerivativeMarket(
        market,
      )
    })
  }

  static grpcFullDerivativeMarketToDerivativeMarket(
    market: GrpcChainFullDerivativeMarket,
  ): DerivativeMarket {
    const marketInfo = market.market!

    return {
      oracleType: marketInfo.oracleType.toString(),
      marketId: marketInfo.marketId,
      marketStatus: marketInfo.status.toString(),
      ticker: marketInfo.ticker,
      quoteDenom: marketInfo.quoteDenom,
      makerFeeRate: denomAmountFromGrpcChainDenomAmount(
        marketInfo.makerFeeRate,
      ).toFixed(),
      takerFeeRate: denomAmountFromGrpcChainDenomAmount(
        marketInfo.takerFeeRate,
      ).toFixed(),
      serviceProviderFee: '',
      quoteToken: undefined,
      minPriceTickSize: denomAmountFromGrpcChainDenomAmount(
        marketInfo.minPriceTickSize,
      ).toNumber(),
      minQuantityTickSize: denomAmountFromGrpcChainDenomAmount(
        marketInfo.minQuantityTickSize,
      ).toNumber(),
      minNotional: denomAmountFromGrpcChainDenomAmount(
        marketInfo.minNotional,
      ).toNumber(),
      reduceMarginRatio: denomAmountFromGrpcChainDenomAmount(
        marketInfo.reduceMarginRatio,
      ).toFixed(),
      initialMarginRatio: denomAmountFromGrpcChainDenomAmount(
        marketInfo.initialMarginRatio,
      ).toFixed(),
      maintenanceMarginRatio: denomAmountFromGrpcChainDenomAmount(
        marketInfo.maintenanceMarginRatio,
      ).toFixed(),
      isPerpetual: marketInfo.isPerpetual,
      oracleBase: marketInfo.oracleBase,
      oracleQuote: marketInfo.oracleQuote,
      oracleScaleFactor: marketInfo.oracleScaleFactor,
      perpetualMarketInfo: {
        hourlyFundingRateCap: denomAmountFromGrpcChainDenomAmount(
          market.info?.oneofKind === 'perpetualInfo'
            ? (market.info.perpetualInfo.marketInfo?.hourlyFundingRateCap?.toString() ??
                '0')
            : '0',
        ).toFixed(),
        hourlyInterestRate: denomAmountFromGrpcChainDenomAmount(
          market.info?.oneofKind === 'perpetualInfo'
            ? (market.info.perpetualInfo.marketInfo?.hourlyInterestRate?.toString() ??
                '0')
            : '0',
        ).toFixed(),
        nextFundingTimestamp: parseInt(
          market.info?.oneofKind === 'perpetualInfo'
            ? (market.info.perpetualInfo.marketInfo?.nextFundingTimestamp?.toString() ??
                '')
            : '',
          10,
        ),
        fundingInterval: parseInt(
          market.info?.oneofKind === 'perpetualInfo'
            ? (market.info.perpetualInfo.marketInfo?.fundingInterval?.toString() ??
                '')
            : '',
          10,
        ),
      },
    }
  }
}
