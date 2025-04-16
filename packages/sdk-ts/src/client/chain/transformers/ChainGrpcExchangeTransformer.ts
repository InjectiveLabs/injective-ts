import {
  InjectiveExchangeV1Beta1Query,
  InjectiveExchangeV1Beta1Exchange,
  InjectiveOracleV1Beta1Oracle,
} from '@injectivelabs/core-proto-ts'
import { BigNumberInBase } from '@injectivelabs/utils'
import {
  ChainPosition,
  PointsMultiplier,
  ChainDenomDecimal,
  GrpcChainPosition,
  CampaignRewardPool,
  FeeDiscountTierTTL,
  IsOptedOutOfRewards,
  FeeDiscountSchedule,
  FeeDiscountTierInfo,
  TradeRewardCampaign,
  ChainDenomMinNotional,
  GrpcPointsMultiplier,
  ExchangeModuleParams,
  GrpcCampaignRewardPool,
  FeeDiscountAccountInfo,
  GrpcFeeDiscountTierTTL,
  GrpcFeeDiscountTierInfo,
  ChainDerivativePosition,
  TradingRewardCampaignInfo,
  GrpcTradingRewardCampaignInfo,
  TradingRewardCampaignBoostInfo,
  GrpcTradingRewardCampaignBoostInfo,
  type GrpcChainFullDerivativeMarket,
  type GrpcChainFullSpotMarket,
  type GrpcChainSpotMarket,
} from '../types/exchange.js'
import type { DerivativeMarket } from '../../indexer/types/derivatives.js'
import type { SpotMarket } from '../../indexer/types/spot.js'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcExchangeTransformer {
  static moduleParamsResponseToParams(
    response: InjectiveExchangeV1Beta1Query.QueryExchangeParamsResponse,
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
      defaultFundingInterval: parseInt(params.defaultFundingInterval, 10),
      fundingMultiple: parseInt(params.fundingMultiple, 10),
      relayerFeeShareRate: params.relayerFeeShareRate,
      defaultHourlyFundingRateCap: params.defaultHourlyFundingRateCap,
      defaultHourlyInterestRate: params.defaultHourlyInterestRate,
      maxDerivativeOrderSideCount: params.maxDerivativeOrderSideCount,
      injRewardStakedRequirementThreshold:
        params.injRewardStakedRequirementThreshold,
      tradingRewardsVestingDuration: parseInt(
        params.tradingRewardsVestingDuration,
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
        InjectiveExchangeV1Beta1Exchange.atomicMarketOrderAccessLevelToJSON(
          params.atomicMarketOrderAccessLevel,
        ),
      spotAtomicMarketOrderFeeMultiplier:
        params.spotAtomicMarketOrderFeeMultiplier,
      derivativeAtomicMarketOrderFeeMultiplier:
        params.derivativeAtomicMarketOrderFeeMultiplier,
      binaryOptionsAtomicMarketOrderFeeMultiplier:
        params.binaryOptionsAtomicMarketOrderFeeMultiplier,
      minimalProtocolFeeRate: params.minimalProtocolFeeRate,
      isInstantDerivativeMarketLaunchEnabled:
        params.isInstantDerivativeMarketLaunchEnabled,
      postOnlyModeHeightThreshold: params.postOnlyModeHeightThreshold,
      marginDecreasePriceTimestampThresholdSeconds:
        params.marginDecreasePriceTimestampThresholdSeconds,
      exchangeAdmins: params.exchangeAdmins,
    }
  }

  static feeDiscountScheduleResponseToFeeDiscountSchedule(
    response: InjectiveExchangeV1Beta1Query.QueryFeeDiscountScheduleResponse,
  ): FeeDiscountSchedule {
    const schedule = response.feeDiscountSchedule!

    return {
      bucketCount: parseInt(schedule.bucketCount, 10),
      bucketDuration: parseInt(schedule.bucketDuration, 10),
      quoteDenomsList: schedule.quoteDenoms,
      tierInfosList: schedule.tierInfos
        .map(
          ChainGrpcExchangeTransformer.grpcFeeDiscountTierInfoToFeeDiscountTierInfo,
        )
        .filter((info) => info) as FeeDiscountTierInfo[],
      disqualifiedMarketIdsList: schedule.disqualifiedMarketIds,
    }
  }

  static tradingRewardsCampaignResponseToTradingRewardsCampaign(
    response: InjectiveExchangeV1Beta1Query.QueryTradeRewardCampaignResponse,
  ): TradeRewardCampaign {
    return {
      tradingRewardCampaignInfo:
        ChainGrpcExchangeTransformer.grpcTradingRewardCampaignInfoToTradingRewardCampaignInfo(
          response.tradingRewardCampaignInfo,
        ),
      tradingRewardPoolCampaignScheduleList:
        response.tradingRewardPoolCampaignSchedule.map(
          ChainGrpcExchangeTransformer.grpcCampaignRewardPoolToCampaignRewardPool,
        ),
      pendingTradingRewardPoolCampaignScheduleList:
        response.pendingTradingRewardPoolCampaignSchedule.map(
          ChainGrpcExchangeTransformer.grpcCampaignRewardPoolToCampaignRewardPool,
        ),
      totalTradeRewardPoints: response.totalTradeRewardPoints,
      pendingTotalTradeRewardPointsList: response.pendingTotalTradeRewardPoints,
    }
  }

  static feeDiscountAccountInfoResponseToFeeDiscountAccountInfo(
    response: InjectiveExchangeV1Beta1Query.QueryFeeDiscountAccountInfoResponse,
  ): FeeDiscountAccountInfo {
    return {
      tierLevel: parseInt(response.tierLevel, 10),
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
    info?: GrpcFeeDiscountTierInfo,
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
      tier: parseInt(info.tier, 10),
      ttlTimestamp: parseInt(info.ttlTimestamp, 10),
    }
  }

  static grpcPointsMultiplierToPointsMultiplier(
    point: GrpcPointsMultiplier,
  ): PointsMultiplier {
    return {
      makerPointsMultiplier: point.makerPointsMultiplier,
      takerPointsMultiplier: point.takerPointsMultiplier,
    }
  }

  static grpcTradingRewardCampaignBoostInfoToTradingRewardCampaignBoostInfo(
    info?: GrpcTradingRewardCampaignBoostInfo,
  ): TradingRewardCampaignBoostInfo | undefined {
    if (!info) {
      return
    }

    return {
      boostedSpotMarketIdsList: info.boostedSpotMarketIds,
      boostedDerivativeMarketIdsList: info.boostedDerivativeMarketIds,
      spotMarketMultipliersList: info.spotMarketMultipliers.map(
        ChainGrpcExchangeTransformer.grpcPointsMultiplierToPointsMultiplier,
      ),
      derivativeMarketMultipliersList: info.derivativeMarketMultipliers.map(
        ChainGrpcExchangeTransformer.grpcPointsMultiplierToPointsMultiplier,
      ),
    }
  }

  static grpcTradingRewardCampaignInfoToTradingRewardCampaignInfo(
    info?: GrpcTradingRewardCampaignInfo,
  ): TradingRewardCampaignInfo | undefined {
    if (!info) {
      return
    }

    return {
      campaignDurationSeconds: parseInt(info.campaignDurationSeconds, 10),
      quoteDenomsList: info.quoteDenoms,
      tradingRewardBoostInfo:
        ChainGrpcExchangeTransformer.grpcTradingRewardCampaignBoostInfoToTradingRewardCampaignBoostInfo(
          info.tradingRewardBoostInfo!,
        ),
      disqualifiedMarketIdsList: info.disqualifiedMarketIds,
    }
  }

  static grpcCampaignRewardPoolToCampaignRewardPool(
    pool: GrpcCampaignRewardPool,
  ): CampaignRewardPool {
    return {
      startTimestamp: parseInt(pool.startTimestamp, 10),
      maxCampaignRewardsList: pool.maxCampaignRewards.map((coin) => ({
        amount: coin.amount,
        denom: coin.denom,
      })),
    }
  }

  static grpcPositionToPosition(position: GrpcChainPosition): ChainPosition {
    return {
      islong: position.isLong,
      ...position,
    }
  }

  static positionsResponseToPositions(
    response: InjectiveExchangeV1Beta1Query.QueryPositionsResponse,
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

  static isOptedOutOfRewardsResponseToIsOptedOutOfRewards(
    response: InjectiveExchangeV1Beta1Query.QueryIsOptedOutOfRewardsResponse,
  ): IsOptedOutOfRewards {
    return {
      isOptedOut: response.isOptedOut,
    }
  }

  static activeStakeGrantResponseToActiveStakeGrant(
    response: InjectiveExchangeV1Beta1Query.QueryActiveStakeGrantResponse,
  ): {
    grant: InjectiveExchangeV1Beta1Exchange.ActiveGrant
    effectiveGrant: InjectiveExchangeV1Beta1Exchange.EffectiveGrant
  } {
    return {
      grant: response.grant!,
      effectiveGrant: response.effectiveGrant!,
    }
  }

  static denomMinNotionalResponseToDenomMinNotional(
    response: InjectiveExchangeV1Beta1Query.QueryDenomMinNotionalResponse,
  ): string {
    return response.amount
  }

  static denomDecimalsResponseToDenomDecimals(
    response: InjectiveExchangeV1Beta1Query.QueryDenomDecimalsResponse,
  ): ChainDenomDecimal[] {
    return response.denomDecimals.map((denomDecimals) => ({
      denom: denomDecimals.denom,
      decimals: denomDecimals.decimals,
    }))
  }

  static denomMinNotionalsResponseToDenomMinNotionals(
    response: InjectiveExchangeV1Beta1Query.QueryDenomMinNotionalsResponse,
  ): ChainDenomMinNotional[] {
    return response.denomMinNotionals.map((denomDecimals) => ({
      denom: denomDecimals.denom,
      minNotional: new BigNumberInBase(denomDecimals.minNotional)
        .dividedBy(10 ** 18)
        .toFixed(),
    }))
  }

  static spotMarketsResponseToSpotMarkets(
    response: InjectiveExchangeV1Beta1Query.QuerySpotMarketsResponse,
  ): SpotMarket[] {
    return response.markets.map((market) => {
      return ChainGrpcExchangeTransformer.grpcSpotMarketToSpotMarket(market)
    })
  }

  static grpcSpotMarketToSpotMarket(
    market: GrpcChainSpotMarket,
  ): SpotMarket {
    const marketInfo = market

    return {
      marketId: marketInfo.marketId,
      marketStatus: InjectiveExchangeV1Beta1Exchange.marketStatusToJSON(
        marketInfo.status,
      ),
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

  static fullSpotMarketsResponseToSpotMarkets(
    response: InjectiveExchangeV1Beta1Query.QueryFullSpotMarketsResponse,
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
      marketStatus: InjectiveExchangeV1Beta1Exchange.marketStatusToJSON(
        marketInfo.status,
      ),
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
    response: InjectiveExchangeV1Beta1Query.QueryDerivativeMarketsResponse,
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
      oracleType: InjectiveOracleV1Beta1Oracle.oracleTypeToJSON(
        marketInfo.oracleType,
      ),
      marketId: marketInfo.marketId,
      marketStatus: InjectiveExchangeV1Beta1Exchange.marketStatusToJSON(
        marketInfo.status,
      ),
      ticker: marketInfo.ticker,
      quoteDenom: marketInfo.quoteDenom,
      makerFeeRate: marketInfo.makerFeeRate,
      takerFeeRate: marketInfo.takerFeeRate,
      serviceProviderFee: '',
      quoteToken: undefined,
      minPriceTickSize: Number(marketInfo.minPriceTickSize),
      minQuantityTickSize: Number(marketInfo.minQuantityTickSize),
      minNotional: Number(marketInfo.minNotional),
      initialMarginRatio: marketInfo.initialMarginRatio,
      maintenanceMarginRatio: marketInfo.maintenanceMarginRatio,
      isPerpetual: marketInfo.isPerpetual,
      oracleBase: marketInfo.oracleBase,
      oracleQuote: marketInfo.oracleQuote,
      oracleScaleFactor: marketInfo.oracleScaleFactor,
      perpetualMarketInfo: {
        hourlyFundingRateCap:
          market.perpetualInfo?.marketInfo?.hourlyFundingRateCap ?? '',
        hourlyInterestRate:
          market.perpetualInfo?.marketInfo?.hourlyInterestRate ?? '',
        nextFundingTimestamp: parseInt(
          market.perpetualInfo?.marketInfo?.nextFundingTimestamp ?? '',
          10,
        ),
        fundingInterval: parseInt(
          market.perpetualInfo?.marketInfo?.fundingInterval ?? '',
          10,
        ),
      },
      perpetualMarketFunding: {
        cumulativeFunding:
          market.perpetualInfo?.fundingInfo?.cumulativeFunding ?? '',
        cumulativePrice:
          market.perpetualInfo?.fundingInfo?.cumulativePrice ?? '',
        lastTimestamp: parseInt(
          market.perpetualInfo?.fundingInfo?.lastTimestamp ?? '',
          10,
        ),
      },
    }
  }
}
