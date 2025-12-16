import * as ExchangePb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/exchange_pb'
import type { Coin } from '@injectivelabs/ts-types'
import type * as InjectiveExchangeV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/query_pb'
import type * as InjectiveExchangeV1Beta1GenesisPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/genesis_pb'
import type * as InjectiveExchangeV1Beta1ExchangePb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/exchange_pb'

export interface DepositProposalParams {
  amount: string
  denom: string
}

export interface FeeDiscountTierInfo {
  makerDiscountRate: string
  takerDiscountRate: string
  stakedAmount: string
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

export interface IsOptedOutOfRewards {
  isOptedOut: boolean
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
  liquidatorRewardShareRate: string
  binaryOptionsMarketInstantListingFee?: Coin
  atomicMarketOrderAccessLevel: string
  spotAtomicMarketOrderFeeMultiplier: string
  derivativeAtomicMarketOrderFeeMultiplier: string
  binaryOptionsAtomicMarketOrderFeeMultiplier: string
  minimalProtocolFeeRate: string
  isInstantDerivativeMarketLaunchEnabled: boolean
  postOnlyModeHeightThreshold: string
  marginDecreasePriceTimestampThresholdSeconds: string
  exchangeAdmins: string[]
}

export interface ExchangeModuleParams extends ExchangeParams {
  //
}

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

export interface ChainDenomDecimal {
  denom: string
  decimals: string
}

export interface ChainDenomMinNotional {
  denom: string
  minNotional: string
}

export type GrpcOrderInfo = InjectiveExchangeV1Beta1ExchangePb.OrderInfo
export type GrpcSpotMarket = InjectiveExchangeV1Beta1ExchangePb.SpotMarket
export type GrpcSpotMarketOrder =
  InjectiveExchangeV1Beta1ExchangePb.SpotMarketOrder
export type GrpcSpotOrder = InjectiveExchangeV1Beta1ExchangePb.SpotOrder
export type GrpcExchangeParams = InjectiveExchangeV1Beta1ExchangePb.Params
export type GrpcFeeDiscountTierInfo =
  InjectiveExchangeV1Beta1ExchangePb.FeeDiscountTierInfo
export type GrpcFeeDiscountTierTTL =
  InjectiveExchangeV1Beta1ExchangePb.FeeDiscountTierTTL
export type GrpcFeeDiscountSchedule =
  InjectiveExchangeV1Beta1ExchangePb.FeeDiscountSchedule
export type GrpcPointsMultiplier =
  InjectiveExchangeV1Beta1ExchangePb.PointsMultiplier
export type GrpcTradingRewardCampaignBoostInfo =
  InjectiveExchangeV1Beta1ExchangePb.TradingRewardCampaignBoostInfo
export type GrpcTradingRewardCampaignInfo =
  InjectiveExchangeV1Beta1ExchangePb.TradingRewardCampaignInfo
export type GrpcCampaignRewardPool =
  InjectiveExchangeV1Beta1ExchangePb.CampaignRewardPool
export type GrpcChainPosition = InjectiveExchangeV1Beta1ExchangePb.Position
export type GrpcChainDerivativePosition =
  InjectiveExchangeV1Beta1GenesisPb.DerivativePosition
export type GrpcFeeDiscountAccountInfo =
  InjectiveExchangeV1Beta1QueryPb.QueryFeeDiscountAccountInfoResponse
export type GrpcTradeRewardCampaign =
  InjectiveExchangeV1Beta1QueryPb.QueryTradeRewardCampaignResponse
export type GrpcDenomDecimals = InjectiveExchangeV1Beta1ExchangePb.DenomDecimals
export type GrpcDenomMinNotional =
  InjectiveExchangeV1Beta1ExchangePb.DenomMinNotional
export type GrpcChainFullDerivativeMarket =
  InjectiveExchangeV1Beta1QueryPb.FullDerivativeMarket
export type GrpcChainFullSpotMarket =
  InjectiveExchangeV1Beta1QueryPb.FullSpotMarket
export type GrpcChainDerivativeMarket =
  InjectiveExchangeV1Beta1ExchangePb.DerivativeMarket
export type GrpcChainSpotMarket = InjectiveExchangeV1Beta1ExchangePb.SpotMarket

export type GrpcOrderType = InjectiveExchangeV1Beta1ExchangePb.OrderType
export const GrpcOrderTypeMap = ExchangePb.OrderType
export type OrderType = InjectiveExchangeV1Beta1ExchangePb.OrderType
export const OrderTypeMap = ExchangePb.OrderType
export type GrpcMarketStatus = InjectiveExchangeV1Beta1ExchangePb.MarketStatus
export const GrpcMarketStatusMap = ExchangePb.MarketStatus
