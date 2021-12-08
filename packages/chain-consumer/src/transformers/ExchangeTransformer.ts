import {
  QueryCurrentAuctionBasketResponse,
  QueryModuleStateResponse,
} from '@injectivelabs/chain-api/injective/auction/v1beta1/query_pb'
import { GenesisState } from '@injectivelabs/chain-api/injective/auction/v1beta1/genesis_pb'
import {
  AuctionModuleState,
  CurrentBasket,
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

  static grpcCurrentBasketToCurrentBasket(
    basket: QueryCurrentAuctionBasketResponse,
  ): CurrentBasket {
    return {
      amountList: basket
        .getAmountList()
        .map((coin) => ({ amount: coin.getAmount(), denom: coin.getDenom() })),
      auctionRound: basket.getAuctionround(),
      auctionClosingTime: basket.getAuctionclosingtime(),
      highestBidder: basket.getHighestbidder(),
      highestBidAmount: basket.getHighestbidamount(),
    }
  }

  static grpcAuctionModuleStateToAuctionModuleState(
    auctionModuleState: QueryModuleStateResponse,
  ): AuctionModuleState {
    const state = auctionModuleState.getState() as GenesisState
    const bid = state.getHighestBid()
    const params = state.getParams()!

    return {
      params: {
        auctionPeriod: params.getAuctionPeriod(),
        minNextBidIncrementRate: params.getMinNextBidIncrementRate(),
      },
      auctionRound: state.getAuctionRound(),
      highestBid: bid
        ? {
            bidder: bid.getBidder(),
            amount: bid.getAmount(),
          }
        : {
            amount: '',
            bidder: '',
          },
      auctionEndingTimestamp: state.getAuctionEndingTimestamp(),
    }
  }
}
