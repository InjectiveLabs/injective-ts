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

export interface FeeDiscountTierTTL {
  tier: number
  ttlTimestamp: number
}

export interface FeeDiscountAccountInfo {
  tierLevel: number
  accountInfo?: FeeDiscountTierInfo
  accountTtl?: FeeDiscountTierTTL
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

export interface ChainCrossMarginPoolSnapshot {
  quoteDenom: string
  quoteBalance: string
  positionMarginTotal: string
  unrealizedPnl: string
  unrealizedPnlEffective: string
  equityAdmission: string
  equityLiquidation: string
  initialMarginTotal: string
  maintenanceMarginTotal: string
  initialMarginWithOrdersTotal: string
  entryLossTotal: string
  feeReserveTotal: string
  orderLockRequirement: string
  positiveUpnlHaircutRate: string
  healthFactor: string
}

export interface ChainOrderbookLevel {
  price: string
  quantity: string
}

export interface ChainL3Orderbook {
  bids: Array<{
    price: string
    quantity: string
    orderHash: string
    subaccountId: string
  }>
  asks: Array<{
    price: string
    quantity: string
    orderHash: string
    subaccountId: string
  }>
  sequence: number
}

export interface ChainOrderbook {
  buys: ChainOrderbookLevel[]
  sells: ChainOrderbookLevel[]
  sequence: number
}

export interface ChainTrimmedSpotLimitOrder {
  price: string
  quantity: string
  fillable: string
  isBuy: boolean
  orderHash: string
  cid: string
}

export interface ChainTrimmedDerivativeLimitOrder extends ChainTrimmedSpotLimitOrder {
  margin: string
}

export interface ChainTrimmedDerivativeConditionalOrder {
  price: string
  quantity: string
  margin: string
  triggerPrice: string
  isBuy: boolean
  isLimit: boolean
  orderHash: string
  cid: string
}

export interface ChainSubaccountOrderData {
  order?: {
    price: string
    quantity: string
    isReduceOnly: boolean
    cid: string
  }
  orderHash: string
}

export interface ChainOpenInterest {
  marketId: string
  balance: string
}

export interface ChainDeposit {
  availableBalance: string
  totalBalance: string
}

export interface ChainMarketVolume {
  marketId: string
  volume?: {
    makerVolume: string
    takerVolume: string
  }
}

export interface ChainAggregateAccountVolume {
  account: string
  marketVolumes: ChainMarketVolume[]
}

export interface ChainMidPriceAndTob {
  midPrice: string
  bestBuyPrice: string
  bestSellPrice: string
}

export interface ChainDerivativeMarketAddress {
  address: string
  subaccountId: string
}

export interface ChainSubaccountRiskProfile {
  mode: number
  reservationPolicy: number
  creditLineId: string
}

export interface ChainEffectivePosition {
  isLong: boolean
  quantity: string
  entryPrice: string
  effectiveMargin: string
}

export interface ChainPerpetualMarketInfo {
  marketId: string
  hourlyFundingRateCap: string
  hourlyInterestRate: string
  nextFundingTimestamp: number
  fundingInterval: number
}

export interface ChainExpiryFuturesMarketInfo {
  marketId: string
  expirationTimestamp: number
  twapStartTimestamp: number
  expirationTwapStartPriceCumulative: string
  settlementPrice: string
  expirationTwapStartBaseCumulativePrice: string
  expirationTwapStartQuoteCumulativePrice: string
}

export interface ChainPerpetualMarketFunding {
  cumulativeFunding: string
  cumulativePrice: string
  lastTimestamp: number
}

export interface ChainTierStatistic {
  tier: number
  count: number
}

export interface ChainGrantAuthorization {
  grantee: string
  amount: string
}

export interface ChainMarketBalance {
  marketId: string
  balance: string
}

export interface ChainSubaccountOrderbookMetadata {
  marketId: string
  isBuy: boolean
  metadata?: {
    vanillaLimitOrderCount: number
    reduceOnlyLimitOrderCount: number
    aggregateReduceOnlyQuantity: string
    aggregateVanillaQuantity: string
    vanillaConditionalOrderCount: number
    reduceOnlyConditionalOrderCount: number
  }
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
export type GrpcChainPosition = InjectiveExchangeV1Beta1ExchangePb.Position
export type GrpcChainDerivativePosition =
  InjectiveExchangeV1Beta1GenesisPb.DerivativePosition
export type GrpcFeeDiscountAccountInfo =
  InjectiveExchangeV1Beta1QueryPb.QueryFeeDiscountAccountInfoResponse
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
