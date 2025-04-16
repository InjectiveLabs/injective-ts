import {
  InjectiveExchangeV1Beta1Exchange,
  InjectiveExchangeV1Beta1Query,
  InjectiveExchangeV1Beta1Genesis,
} from '@injectivelabs/core-proto-ts'
import { Coin } from '@injectivelabs/ts-types'

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

export type GrpcOrderInfo = InjectiveExchangeV1Beta1Exchange.OrderInfo
export type GrpcSpotMarket = InjectiveExchangeV1Beta1Exchange.SpotMarket
export type GrpcSpotMarketOrder =
  InjectiveExchangeV1Beta1Exchange.SpotMarketOrder
export type GrpcSpotOrder = InjectiveExchangeV1Beta1Exchange.SpotOrder
export type GrpcExchangeParams = InjectiveExchangeV1Beta1Exchange.Params
export type GrpcFeeDiscountTierInfo =
  InjectiveExchangeV1Beta1Exchange.FeeDiscountTierInfo
export type GrpcFeeDiscountTierTTL =
  InjectiveExchangeV1Beta1Exchange.FeeDiscountTierTTL
export type GrpcFeeDiscountSchedule =
  InjectiveExchangeV1Beta1Exchange.FeeDiscountSchedule
export type GrpcPointsMultiplier =
  InjectiveExchangeV1Beta1Exchange.PointsMultiplier
export type GrpcTradingRewardCampaignBoostInfo =
  InjectiveExchangeV1Beta1Exchange.TradingRewardCampaignBoostInfo
export type GrpcTradingRewardCampaignInfo =
  InjectiveExchangeV1Beta1Exchange.TradingRewardCampaignInfo
export type GrpcCampaignRewardPool =
  InjectiveExchangeV1Beta1Exchange.CampaignRewardPool
export type GrpcChainPosition = InjectiveExchangeV1Beta1Exchange.Position
export type GrpcChainDerivativePosition =
  InjectiveExchangeV1Beta1Genesis.DerivativePosition
export type GrpcFeeDiscountAccountInfo =
  InjectiveExchangeV1Beta1Query.QueryFeeDiscountAccountInfoResponse
export type GrpcTradeRewardCampaign =
  InjectiveExchangeV1Beta1Query.QueryTradeRewardCampaignResponse
export type GrpcDenomDecimals = InjectiveExchangeV1Beta1Exchange.DenomDecimals
export type GrpcDenomMinNotional =
  InjectiveExchangeV1Beta1Exchange.DenomMinNotional
export type GrpcChainFullDerivativeMarket =
  InjectiveExchangeV1Beta1Query.FullDerivativeMarket
export type GrpcChainFullSpotMarket =
  InjectiveExchangeV1Beta1Query.FullSpotMarket
export type GrpcChainDerivativeMarket =
  InjectiveExchangeV1Beta1Exchange.DerivativeMarket
export type GrpcChainSpotMarket =
  InjectiveExchangeV1Beta1Exchange.SpotMarket

export type GrpcOrderType = InjectiveExchangeV1Beta1Exchange.OrderType
export const GrpcOrderTypeMap = InjectiveExchangeV1Beta1Exchange.OrderType
export type OrderType = InjectiveExchangeV1Beta1Exchange.OrderType
export const OrderTypeMap = InjectiveExchangeV1Beta1Exchange.OrderType
export type GrpcMarketStatus = InjectiveExchangeV1Beta1Exchange.MarketStatus
export const GrpcMarketStatusMap = InjectiveExchangeV1Beta1Exchange.MarketStatus
