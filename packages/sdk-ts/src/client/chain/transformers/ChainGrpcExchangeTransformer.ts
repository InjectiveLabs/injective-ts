import {
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
import {
  QueryFeeDiscountAccountInfoResponse,
  QueryTradeRewardCampaignResponse,
  QueryFeeDiscountScheduleResponse,
  QueryExchangeParamsResponse,
  QueryPositionsResponse,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/query_pb'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcExchangeTransformer {
  static moduleParamsResponseToParams(
    response: QueryExchangeParamsResponse,
  ): ExchangeModuleParams {
    const params = response.getParams()!
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

  static feeDiscountScheduleResponseToFeeDiscountSchedule(
    response: QueryFeeDiscountScheduleResponse,
  ): FeeDiscountSchedule {
    const schedule = response.getFeeDiscountSchedule()!

    return {
      bucketCount: schedule.getBucketCount(),
      bucketDuration: schedule.getBucketDuration(),
      quoteDenomsList: schedule.getQuoteDenomsList(),
      tierInfosList: schedule
        .getTierInfosList()
        .map(
          ChainGrpcExchangeTransformer.grpcFeeDiscountTierInfoToFeeDiscountTierInfo,
        )
        .filter((info) => info) as FeeDiscountTierInfo[],
      disqualifiedMarketIdsList: schedule.getDisqualifiedMarketIdsList(),
    }
  }

  static tradingRewardsCampaignResponseToTradingRewardsCampaign(
    response: QueryTradeRewardCampaignResponse,
  ): TradeRewardCampaign {
    return {
      tradingRewardCampaignInfo:
        ChainGrpcExchangeTransformer.grpcTradingRewardCampaignInfoToTradingRewardCampaignInfo(
          response.getTradingRewardCampaignInfo(),
        ),
      tradingRewardPoolCampaignScheduleList: response
        .getTradingRewardPoolCampaignScheduleList()
        .map(
          ChainGrpcExchangeTransformer.grpcCampaignRewardPoolToCampaignRewardPool,
        ),
      pendingTradingRewardPoolCampaignScheduleList: response
        .getPendingTradingRewardPoolCampaignScheduleList()
        .map(
          ChainGrpcExchangeTransformer.grpcCampaignRewardPoolToCampaignRewardPool,
        ),
      totalTradeRewardPoints: response.getTotalTradeRewardPoints(),
      pendingTotalTradeRewardPointsList:
        response.getPendingTotalTradeRewardPointsList(),
    }
  }

  static feeDiscountAccountInfoResponseToFeeDiscountAccountInfo(
    response: QueryFeeDiscountAccountInfoResponse,
  ): FeeDiscountAccountInfo {
    return {
      tierLevel: response.getTierLevel(),
      accountInfo:
        ChainGrpcExchangeTransformer.grpcFeeDiscountTierInfoToFeeDiscountTierInfo(
          response.getAccountInfo(),
        ),
      accountTtl:
        ChainGrpcExchangeTransformer.grpcFeeDiscountTierTTLToFeeDiscountTierTTL(
          response.getAccountTtl()!,
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
      makerDiscountRate: info.getMakerDiscountRate(),
      takerDiscountRate: info.getTakerDiscountRate(),
      stakedAmount: info.getStakedAmount(),
      feePaidAmount:
        // @ts-ignore
        info.getFeePaidAmount !== undefined ? info.getFeePaidAmount() : '0',
      volume: info.getVolume !== undefined ? info.getVolume() : '0',
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
        .map(
          ChainGrpcExchangeTransformer.grpcPointsMultiplierToPointsMultiplier,
        ),
      derivativeMarketMultipliersList: info
        .getDerivativeMarketMultipliersList()
        .map(
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
      campaignDurationSeconds: info.getCampaignDurationSeconds(),
      quoteDenomsList: info.getQuoteDenomsList(),
      tradingRewardBoostInfo:
        ChainGrpcExchangeTransformer.grpcTradingRewardCampaignBoostInfoToTradingRewardCampaignBoostInfo(
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

  static grpcPositionToPosition(position: GrpcChainPosition): ChainPosition {
    return position.toObject()
  }

  static positionsResponseToPositions(
    response: QueryPositionsResponse,
  ): ChainDerivativePosition[] {
    return response.getStateList().map((position) => {
      return {
        subaccountId: position.getSubaccountId(),
        marketId: position.getMarketId(),
        position: ChainGrpcExchangeTransformer.grpcPositionToPosition(
          position.getPosition()!,
        ),
      }
    })
  }
}
