import {
  GrpcFeeDiscountSchedule,
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
} from '../types'

export class ExchangeTransformer {
  static grpcFeeDiscountTierInfoToFeeDiscountTierInfo(
    info: GrpcFeeDiscountTierInfo,
  ): FeeDiscountTierInfo {
    return {
      makerDiscountRate: info.getMakerDiscountRate(),
      takerDiscountRate: info.getTakerDiscountRate(),
      stakedAmount: info.getStakedAmount(),
      feePaidAmount: info.getFeePaidAmount(),
    }
  }

  static grpcFeeDiscountScheduleToFeeDiscountSchedule(
    schedule: GrpcFeeDiscountSchedule,
  ): FeeDiscountSchedule {
    return {
      bucketCount: schedule.getBucketCount(),
      bucketDuration: schedule.getBucketDuration(),
      quoteDenomsList: schedule.getQuoteDenomsList(),
      tierInfosList: schedule
        .getTierInfosList()
        .map(ExchangeTransformer.grpcFeeDiscountTierInfoToFeeDiscountTierInfo),
      disqualifiedMarketIdsList: schedule.getDisqualifiedMarketIdsList(),
    }
  }

  static grpcPointsMultiplierToPointsMultiplier(
    point: GrpcPointsMultiplier,
  ): PointsMultiplier {
    return {
      makerPointsMultiplier: point.getMakerPointsMultiplier(),
      takerPointsMultiplier: point.getTakerPointsMultiplier(),
    }
  }

  static grpcTradingRewardCampaignBoostInfoToTradingRewardCampaignBoostInfo(
    info: GrpcTradingRewardCampaignBoostInfo,
  ): TradingRewardCampaignBoostInfo {
    return {
      boostedSpotMarketIdsList: info.getBoostedSpotMarketIdsList(),
      boostedDerivativeMarketIdsList: info.getBoostedDerivativeMarketIdsList(),
      spotMarketMultipliersList: info
        .getSpotMarketMultipliersList()
        .map(ExchangeTransformer.grpcPointsMultiplierToPointsMultiplier),
      derivativeMarketMultipliersList: info
        .getDerivativeMarketMultipliersList()
        .map(ExchangeTransformer.grpcPointsMultiplierToPointsMultiplier),
    }
  }

  static grpcTradingRewardCampaignInfoToTradingRewardCampaignInfo(
    info: GrpcTradingRewardCampaignInfo,
  ): TradingRewardCampaignInfo {
    return {
      campaignDurationSeconds: info.getCampaignDurationSeconds(),
      quoteDenomsList: info.getQuoteDenomsList(),
      tradingRewardBoostInfo: info.hasTradingRewardBoostInfo()
        ? ExchangeTransformer.grpcTradingRewardCampaignBoostInfoToTradingRewardCampaignBoostInfo(
            info.getTradingRewardBoostInfo()!,
          )
        : undefined,
      disqualifiedMarketIdsList: info.getDisqualifiedMarketIdsList(),
    }
  }

  static grpcCampaignRewardPoolToCampaignRewardPool(
    pool: GrpcCampaignRewardPool,
  ): CampaignRewardPool {
    return {
      startTimestamp: pool.getStartTimestamp(),
      maxCampaignRewardsList: pool
        .getMaxCampaignRewardsList()
        .map((coin) => ({ amount: coin.getAmount(), denom: coin.getDenom() })),
    }
  }
}
