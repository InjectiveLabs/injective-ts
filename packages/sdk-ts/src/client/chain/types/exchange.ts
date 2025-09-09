import { InjectiveExchangeV1Beta1Exchange } from '@injectivelabs/core-proto-ts'
import type { Coin } from '@injectivelabs/ts-types'
import type {
  InjectiveExchangeV1Beta1Query,
  InjectiveExchangeV1Beta1Genesis,
} from '@injectivelabs/core-proto-ts'

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
export type GrpcChainSpotMarket = InjectiveExchangeV1Beta1Exchange.SpotMarket

// IMPROVED ENUM EXPORTS FOR BETTER TREE-SHAKING

// OrderType as union type for better tree-shaking
export type OrderType =
  | 'UNSPECIFIED'
  | 'BUY'
  | 'SELL'
  | 'STOP_BUY'
  | 'STOP_SELL'
  | 'TAKE_BUY'
  | 'TAKE_SELL'
  | 'BUY_PO'
  | 'SELL_PO'
  | 'BUY_ATOMIC'
  | 'SELL_ATOMIC'

export const OrderType = {
  UNSPECIFIED: 'UNSPECIFIED' as const,
  BUY: 'BUY' as const,
  SELL: 'SELL' as const,
  STOP_BUY: 'STOP_BUY' as const,
  STOP_SELL: 'STOP_SELL' as const,
  TAKE_BUY: 'TAKE_BUY' as const,
  TAKE_SELL: 'TAKE_SELL' as const,
  BUY_PO: 'BUY_PO' as const,
  SELL_PO: 'SELL_PO' as const,
  BUY_ATOMIC: 'BUY_ATOMIC' as const,
  SELL_ATOMIC: 'SELL_ATOMIC' as const,
} as const

// MarketStatus as union type for better tree-shaking
export type MarketStatus =
  | 'Unspecified'
  | 'Active'
  | 'Paused'
  | 'Demolished'
  | 'Expired'

export const MarketStatus = {
  Unspecified: 'Unspecified' as const,
  Active: 'Active' as const,
  Paused: 'Paused' as const,
  Demolished: 'Demolished' as const,
  Expired: 'Expired' as const,
} as const

// Helper functions for conversion to/from proto enums
export function orderTypeToProto(
  orderType: OrderType,
): InjectiveExchangeV1Beta1Exchange.OrderType {
  const mapping: Record<OrderType, InjectiveExchangeV1Beta1Exchange.OrderType> =
    {
      UNSPECIFIED: InjectiveExchangeV1Beta1Exchange.OrderType.UNSPECIFIED,
      BUY: InjectiveExchangeV1Beta1Exchange.OrderType.BUY,
      SELL: InjectiveExchangeV1Beta1Exchange.OrderType.SELL,
      STOP_BUY: InjectiveExchangeV1Beta1Exchange.OrderType.STOP_BUY,
      STOP_SELL: InjectiveExchangeV1Beta1Exchange.OrderType.STOP_SELL,
      TAKE_BUY: InjectiveExchangeV1Beta1Exchange.OrderType.TAKE_BUY,
      TAKE_SELL: InjectiveExchangeV1Beta1Exchange.OrderType.TAKE_SELL,
      BUY_PO: InjectiveExchangeV1Beta1Exchange.OrderType.BUY_PO,
      SELL_PO: InjectiveExchangeV1Beta1Exchange.OrderType.SELL_PO,
      BUY_ATOMIC: InjectiveExchangeV1Beta1Exchange.OrderType.BUY_ATOMIC,
      SELL_ATOMIC: InjectiveExchangeV1Beta1Exchange.OrderType.SELL_ATOMIC,
    }
  return mapping[orderType]
}

export function orderTypeFromProto(
  protoOrderType: InjectiveExchangeV1Beta1Exchange.OrderType,
): OrderType {
  const mapping: Record<InjectiveExchangeV1Beta1Exchange.OrderType, OrderType> =
    {
      [InjectiveExchangeV1Beta1Exchange.OrderType.UNSPECIFIED]: 'UNSPECIFIED',
      [InjectiveExchangeV1Beta1Exchange.OrderType.BUY]: 'BUY',
      [InjectiveExchangeV1Beta1Exchange.OrderType.SELL]: 'SELL',
      [InjectiveExchangeV1Beta1Exchange.OrderType.STOP_BUY]: 'STOP_BUY',
      [InjectiveExchangeV1Beta1Exchange.OrderType.STOP_SELL]: 'STOP_SELL',
      [InjectiveExchangeV1Beta1Exchange.OrderType.TAKE_BUY]: 'TAKE_BUY',
      [InjectiveExchangeV1Beta1Exchange.OrderType.TAKE_SELL]: 'TAKE_SELL',
      [InjectiveExchangeV1Beta1Exchange.OrderType.BUY_PO]: 'BUY_PO',
      [InjectiveExchangeV1Beta1Exchange.OrderType.SELL_PO]: 'SELL_PO',
      [InjectiveExchangeV1Beta1Exchange.OrderType.BUY_ATOMIC]: 'BUY_ATOMIC',
      [InjectiveExchangeV1Beta1Exchange.OrderType.SELL_ATOMIC]: 'SELL_ATOMIC',
      [InjectiveExchangeV1Beta1Exchange.OrderType.UNRECOGNIZED]: 'UNSPECIFIED', // Map unrecognized to unspecified
    }
  return mapping[protoOrderType]
}

export function marketStatusToProto(
  marketStatus: MarketStatus,
): InjectiveExchangeV1Beta1Exchange.MarketStatus {
  const mapping: Record<
    MarketStatus,
    InjectiveExchangeV1Beta1Exchange.MarketStatus
  > = {
    Unspecified: InjectiveExchangeV1Beta1Exchange.MarketStatus.Unspecified,
    Active: InjectiveExchangeV1Beta1Exchange.MarketStatus.Active,
    Paused: InjectiveExchangeV1Beta1Exchange.MarketStatus.Paused,
    Demolished: InjectiveExchangeV1Beta1Exchange.MarketStatus.Demolished,
    Expired: InjectiveExchangeV1Beta1Exchange.MarketStatus.Expired,
  }
  return mapping[marketStatus]
}

export function marketStatusFromProto(
  protoMarketStatus: InjectiveExchangeV1Beta1Exchange.MarketStatus,
): MarketStatus {
  const mapping: Record<
    InjectiveExchangeV1Beta1Exchange.MarketStatus,
    MarketStatus
  > = {
    [InjectiveExchangeV1Beta1Exchange.MarketStatus.Unspecified]: 'Unspecified',
    [InjectiveExchangeV1Beta1Exchange.MarketStatus.Active]: 'Active',
    [InjectiveExchangeV1Beta1Exchange.MarketStatus.Paused]: 'Paused',
    [InjectiveExchangeV1Beta1Exchange.MarketStatus.Demolished]: 'Demolished',
    [InjectiveExchangeV1Beta1Exchange.MarketStatus.Expired]: 'Expired',
    [InjectiveExchangeV1Beta1Exchange.MarketStatus.UNRECOGNIZED]: 'Unspecified', // Map unrecognized to unspecified
  }
  return mapping[protoMarketStatus]
}

export type GrpcOrderType = OrderType
export const GrpcOrderTypeMap = OrderType
export type GrpcMarketStatus = MarketStatus
export const GrpcMarketStatusMap = MarketStatus
