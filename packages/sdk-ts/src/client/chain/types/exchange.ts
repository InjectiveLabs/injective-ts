import {
  SpotMarket as GrpcSpotMarket,
  MarketStatus as GrpcMarketStatus,
  MarketStatusMap as GrpcMarketStatusMap,
  SpotMarketOrder as GrpcSpotMarketOrder,
  SpotOrder as GrpcSpotOrder,
  Params as GrpcExchangeParams,
  FeeDiscountTierInfo as GrpcFeeDiscountTierInfo,
  FeeDiscountTierTTL as GrpcFeeDiscountTierTTL,
  FeeDiscountSchedule as GrpcFeeDiscountSchedule,
  PointsMultiplier as GrpcPointsMultiplier,
  TradingRewardCampaignBoostInfo as GrpcTradingRewardCampaignBoostInfo,
  TradingRewardCampaignInfo as GrpcTradingRewardCampaignInfo,
  CampaignRewardPool as GrpcCampaignRewardPool,
  OrderTypeMap as GrpcOrderTypeMap,
  Position as GrpcChainPosition,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import { DerivativePosition as GrpcChainDerivativePosition } from '@injectivelabs/chain-api/injective/exchange/v1beta1/genesis_pb'
import {
  QueryFeeDiscountAccountInfoResponse as GrpcFeeDiscountAccountInfo,
  QueryTradeRewardCampaignResponse as GrpcTradeRewardCampaign,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/query_pb'
import { Coin } from '@injectivelabs/ts-types'

export interface DepositProposalParams {
  amount: string
  denom: string
}

export interface FeeDiscountTierInfo {
  makerDiscountRate: string
  takerDiscountRate: string
  stakedAmount: string
  feePaidAmount: string
  volume: string
}

export interface FeeDiscountSchedule {
  bucketCount: number
  bucketDuration: number
  quoteDenomsList: Array<string>
  tierInfosList: Array<FeeDiscountTierInfo>
  disqualifiedMarketIdsList: Array<string>
}

export interface PointsMultiplier {
  makerPointsMultiplier: string
  takerPointsMultiplier: string
}

export interface TradingRewardCampaignBoostInfo {
  boostedSpotMarketIdsList: Array<string>
  spotMarketMultipliersList: Array<PointsMultiplier>
  boostedDerivativeMarketIdsList: Array<string>
  derivativeMarketMultipliersList: Array<PointsMultiplier>
}

export interface TradingRewardCampaignInfo {
  campaignDurationSeconds: number
  quoteDenomsList: Array<string>
  tradingRewardBoostInfo?: TradingRewardCampaignBoostInfo
  disqualifiedMarketIdsList: Array<string>
}

export interface CampaignRewardPool {
  startTimestamp: number
  maxCampaignRewardsList: Coin[]
}

export interface FeeDiscountTierTTL {
  tier: number
  ttlTimestamp: number
}

export interface FeeDiscountAccountInfo {
  tierLevel: number
  accountInfo?: FeeDiscountTierInfo
  accountTtl?: FeeDiscountTierTTL
}

export interface TradeRewardCampaign {
  tradingRewardCampaignInfo?: TradingRewardCampaignInfo
  tradingRewardPoolCampaignScheduleList: CampaignRewardPool[]
  totalTradeRewardPoints: string
  pendingTradingRewardPoolCampaignScheduleList: CampaignRewardPool[]
  pendingTotalTradeRewardPointsList: string[]
}

export interface ExchangeParams {
  spotMarketInstantListingFee?: Coin
  derivativeMarketInstantListingFee?: Coin
  defaultSpotMakerFeeRate: string
  defaultSpotTakerFeeRate: string
  defaultDerivativeMakerFeeRate: string
  defaultDerivativeTakerFeeRate: string
  defaultInitialMarginRatio: string
  defaultMaintenanceMarginRatio: string
  defaultFundingInterval: number
  fundingMultiple: number
  relayerFeeShareRate: string
  defaultHourlyFundingRateCap: string
  defaultHourlyInterestRate: string
  maxDerivativeOrderSideCount: number
  injRewardStakedRequirementThreshold: string
  tradingRewardsVestingDuration: number
}

export interface ExchangeModuleParams extends ExchangeParams {
  //
}

export type GrpcOrderType = GrpcOrderTypeMap[keyof GrpcOrderTypeMap]

export interface ChainPosition {
  islong: boolean
  quantity: string
  entryPrice: string
  margin: string
  cumulativeFundingEntry: string
}

export interface ChainDerivativePosition {
  subaccountId: string
  marketId: string
  position?: ChainPosition
}

export {
  GrpcFeeDiscountSchedule,
  GrpcFeeDiscountTierInfo,
  GrpcFeeDiscountTierTTL,
  GrpcTradeRewardCampaign,
  GrpcFeeDiscountAccountInfo,
  GrpcTradingRewardCampaignInfo,
  GrpcTradingRewardCampaignBoostInfo,
  GrpcPointsMultiplier,
  GrpcCampaignRewardPool,
  GrpcSpotMarket,
  GrpcChainPosition,
  GrpcMarketStatus,
  GrpcChainDerivativePosition,
  GrpcMarketStatusMap,
  GrpcSpotMarketOrder,
  GrpcSpotOrder,
  GrpcExchangeParams,
}
