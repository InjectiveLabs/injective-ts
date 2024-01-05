import { InjectiveExchangeV1Beta1Query } from '@injectivelabs/core-proto-ts'
import {
  IsOptedOutOfRewards,
  FeeDiscountSchedule,
  FeeDiscountTierInfo,
  PointsMultiplier,
  TradingRewardCampaignInfo,
  GrpcTradingRewardCampaignInfo,
  GrpcPointsMultiplier,
  CampaignRewardPool,
  GrpcCampaignRewardPool,
  GrpcTradingRewardCampaignBoostInfo,
  TradingRewardCampaignBoostInfo,
  GrpcFeeDiscountTierInfo,
  TradeRewardCampaign,
  FeeDiscountAccountInfo,
  FeeDiscountTierTTL,
  GrpcFeeDiscountTierTTL,
  ExchangeModuleParams,
  GrpcChainPosition,
  ChainPosition,
  ChainDerivativePosition,
} from '../types/exchange'

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
}
