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
  TradeRewardCampaign,
  GrpcTradeRewardCampaign,
  FeeDiscountAccountInfo,
  GrpcFeeDiscountAccountInfo,
  FeeDiscountTierTTL,
  GrpcFeeDiscountTierTTL,
  GrpcExchangeParams,
  ExchangeParams,
} from './../types/exchange'

export class ExchangeGrpcTransformer {
  static grpcParamsToParams(params: GrpcExchangeParams): ExchangeParams {
    const spotMarketInstantListingFee = params.getSpotMarketInstantListingFee()
    const derivativeMarketInstantListingFee =
      params.getDerivativeMarketInstantListingFee()

    return {
      spotMarketInstantListingFee: spotMarketInstantListingFee
        ? {
            amount: spotMarketInstantListingFee.getAmount(),
            denom: spotMarketInstantListingFee.getDenom(),
          }
        : undefined,
      derivativeMarketInstantListingFee: derivativeMarketInstantListingFee
        ? {
            amount: derivativeMarketInstantListingFee.getAmount(),
            denom: derivativeMarketInstantListingFee.getDenom(),
          }
        : undefined,
      defaultSpotMakerFeeRate: params.getDefaultSpotMakerFeeRate(),
      defaultSpotTakerFeeRate: params.getDefaultSpotTakerFeeRate(),
      defaultDerivativeMakerFeeRate: params.getDefaultDerivativeMakerFeeRate(),
      defaultDerivativeTakerFeeRate: params.getDefaultDerivativeTakerFeeRate(),
      defaultInitialMarginRatio: params.getDefaultInitialMarginRatio(),
      defaultMaintenanceMarginRatio: params.getDefaultMaintenanceMarginRatio(),
      defaultFundingInterval: params.getDefaultFundingInterval(),
      fundingMultiple: params.getFundingMultiple(),
      relayerFeeShareRate: params.getRelayerFeeShareRate(),
      defaultHourlyFundingRateCap: params.getDefaultHourlyFundingRateCap(),
      defaultHourlyInterestRate: params.getDefaultHourlyInterestRate(),
      maxDerivativeOrderSideCount: params.getMaxDerivativeOrderSideCount(),
      injRewardStakedRequirementThreshold:
        params.getInjRewardStakedRequirementThreshold(),
      tradingRewardsVestingDuration: params.getTradingRewardsVestingDuration(),
    }
  }

  static grpcFeeDiscountTierInfoToFeeDiscountTierInfo(
    info?: GrpcFeeDiscountTierInfo,
  ): FeeDiscountTierInfo | undefined {
    if (!info) {
      return
    }

    return {
      makerDiscountRate: info.getMakerDiscountRate(),
      takerDiscountRate: info.getTakerDiscountRate(),
      stakedAmount: info.getStakedAmount(),
      feePaidAmount: info.getFeePaidAmount(),
    }
  }

  static grpcFeeDiscountTierTTLToFeeDiscountTierTTL(
    info?: GrpcFeeDiscountTierTTL,
  ): FeeDiscountTierTTL | undefined {
    if (!info) {
      return
    }

    return {
      tier: info.getTier(),
      ttlTimestamp: info.getTtlTimestamp(),
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
        .map(
          ExchangeGrpcTransformer.grpcFeeDiscountTierInfoToFeeDiscountTierInfo,
        )
        .filter((info) => info) as FeeDiscountTierInfo[],
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
    info?: GrpcTradingRewardCampaignBoostInfo,
  ): TradingRewardCampaignBoostInfo | undefined {
    if (!info) {
      return
    }

    return {
      boostedSpotMarketIdsList: info.getBoostedSpotMarketIdsList(),
      boostedDerivativeMarketIdsList: info.getBoostedDerivativeMarketIdsList(),
      spotMarketMultipliersList: info
        .getSpotMarketMultipliersList()
        .map(ExchangeGrpcTransformer.grpcPointsMultiplierToPointsMultiplier),
      derivativeMarketMultipliersList: info
        .getDerivativeMarketMultipliersList()
        .map(ExchangeGrpcTransformer.grpcPointsMultiplierToPointsMultiplier),
    }
  }

  static grpcTradingRewardCampaignInfoToTradingRewardCampaignInfo(
    info?: GrpcTradingRewardCampaignInfo,
  ): TradingRewardCampaignInfo | undefined {
    if (!info) {
      return
    }

    return {
      campaignDurationSeconds: info.getCampaignDurationSeconds(),
      quoteDenomsList: info.getQuoteDenomsList(),
      tradingRewardBoostInfo:
        ExchangeGrpcTransformer.grpcTradingRewardCampaignBoostInfoToTradingRewardCampaignBoostInfo(
          info.getTradingRewardBoostInfo()!,
        ),
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

  static grpcTradingRewardsCampaignToTradingRewardsCampaign(
    campaign: GrpcTradeRewardCampaign,
  ): TradeRewardCampaign {
    return {
      tradingRewardCampaignInfo:
        ExchangeGrpcTransformer.grpcTradingRewardCampaignInfoToTradingRewardCampaignInfo(
          campaign.getTradingRewardCampaignInfo(),
        ),
      tradingRewardPoolCampaignScheduleList: campaign
        .getTradingRewardPoolCampaignScheduleList()
        .map(
          ExchangeGrpcTransformer.grpcCampaignRewardPoolToCampaignRewardPool,
        ),
      pendingTradingRewardPoolCampaignScheduleList: campaign
        .getPendingTradingRewardPoolCampaignScheduleList()
        .map(
          ExchangeGrpcTransformer.grpcCampaignRewardPoolToCampaignRewardPool,
        ),
      totalTradeRewardPoints: campaign.getTotalTradeRewardPoints(),
      pendingTotalTradeRewardPointsList:
        campaign.getPendingTotalTradeRewardPointsList(),
    }
  }

  static grpcFeeDiscountAccountInfoToFeeDiscountAccountInfo(
    info: GrpcFeeDiscountAccountInfo,
  ): FeeDiscountAccountInfo {
    return {
      tierLevel: info.getTierLevel(),
      accountInfo:
        ExchangeGrpcTransformer.grpcFeeDiscountTierInfoToFeeDiscountTierInfo(
          info.getAccountInfo(),
        ),
      accountTtl:
        ExchangeGrpcTransformer.grpcFeeDiscountTierTTLToFeeDiscountTierTTL(
          info.getAccountTtl()!,
        ),
    }
  }
}
