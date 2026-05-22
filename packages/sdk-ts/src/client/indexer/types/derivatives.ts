import type * as InjectiveDerivativeExchangeRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_derivative_exchange_rpc_pb'
import type { GrpcOrderType } from '../../chain/types/exchange.js'
import type {
  OrderSide,
  TokenMeta,
  OrderState,
  TradeDirection,
  TradeExecutionType,
  TradeExecutionSide,
} from '../../../types/index.js'

export interface PositionDelta {
  executionPrice: string
  executionMargin: string
  executionQuantity: string
  tradeDirection: TradeDirection
}

export interface Position {
  margin: string
  ticker: string
  marketId: string
  quantity: string
  markPrice: string
  updatedAt: number
  entryPrice: string
  subaccountId: string
  liquidationPrice: string
  direction: TradeDirection
  aggregateReduceOnlyQuantity: string
}

export interface PositionV2 extends Omit<
  Position,
  'aggregateReduceOnlyQuantity'
> {
  upnl: string
  denom: string
  fundingSum: string
  fundingLast: string
  cumulativeFundingEntry: string
  effectiveCumulativeFundingEntry: string
}

export interface PerpetualMarketInfo {
  fundingInterval: number
  hourlyInterestRate: string
  hourlyFundingRateCap: string
  nextFundingTimestamp: number
}

export interface PerpetualMarketFunding {
  lastTimestamp: number
  cumulativePrice: string
  cumulativeFunding: string
}

export interface ExpiryFuturesMarketInfo {
  settlementPrice: string
  expirationTimestamp: number
}

export interface BaseDerivativeMarket {
  ticker: string
  marketId: string
  oracleType: string
  quoteDenom: string
  minNotional: number
  marketStatus: string
  makerFeeRate: string
  takerFeeRate: string
  minPriceTickSize: number
  serviceProviderFee: string
  minQuantityTickSize: number
  quoteToken: TokenMeta | undefined
}

export interface PerpetualMarket extends BaseDerivativeMarket {
  oracleBase: string
  oracleQuote: string
  isPerpetual: boolean
  reduceMarginRatio: string
  oracleScaleFactor: number
  initialMarginRatio: string
  maintenanceMarginRatio: string
  perpetualMarketInfo?: PerpetualMarketInfo
  perpetualMarketFunding?: PerpetualMarketFunding
}

export interface ExpiryFuturesMarket extends BaseDerivativeMarket {
  oracleBase: string
  oracleQuote: string
  isPerpetual: boolean
  reduceMarginRatio: string
  oracleScaleFactor: number
  initialMarginRatio: string
  maintenanceMarginRatio: string
  expiryFuturesMarketInfo?: ExpiryFuturesMarketInfo
}

export interface BinaryOptionsMarket extends Omit<
  BaseDerivativeMarket,
  'minPriceTickSize' | 'minQuantityTickSize'
> {
  minNotional: number
  oracleSymbol: string
  oracleProvider: string
  settlementPrice: string
  minPriceTickSize: number
  oracleScaleFactor: number
  serviceProviderFee: string
  expirationTimestamp: number
  settlementTimestamp: number
  minQuantityTickSize: number
}

export type DerivativeMarket =
  | PerpetualMarket
  | ExpiryFuturesMarket
  | BinaryOptionsMarket

export type DerivativeMarketWithoutBinaryOptions =
  | PerpetualMarket
  | ExpiryFuturesMarket

export interface DerivativeLimitOrder {
  cid: string
  price: string
  margin: string
  marketId: string
  quantity: string
  orderHash: string
  state: OrderState
  createdAt: number
  updatedAt: number
  orderType: string
  triggerAt: number
  orderNumber: number
  orderSide: OrderSide
  subaccountId: string
  triggerPrice: string
  feeRecipient: string
  isReduceOnly: boolean
  executionType: string
  isConditional: boolean
  accountAddress: string
  placedOrderHash: string
  unfilledQuantity: string
}

export interface DerivativeOrderHistory {
  cid: string
  price: string
  state: string
  margin: string
  marketId: string
  quantity: string
  orderHash: string
  isActive: boolean
  orderType: string
  createdAt: number
  updatedAt: number
  direction: string
  triggerAt: number
  subaccountId: string
  triggerPrice: string
  executionType: string
  isReduceOnly: boolean
  filledQuantity: string
  isConditional: boolean
  placedOrderHash: string
}

export interface DerivativeTrade extends PositionDelta {
  cid: string
  fee: string
  pnl: string
  payout: string
  tradeId: string
  marketId: string
  orderHash: string
  executedAt: number
  subaccountId: string
  feeRecipient: string
  isLiquidation: boolean
  tradeDirection: TradeDirection
  executionSide: TradeExecutionSide
  tradeExecutionType: TradeExecutionType
}

export interface DerivativeLimitOrderParams {
  price: string
  margin: string
  quantity: string
  feeRecipient: string
  triggerPrice?: string
  orderType: GrpcOrderType
}

export interface DerivativeOrderCancelParams {
  orderHash: string
}

export interface BatchDerivativeOrderCancelParams {
  marketId: string
  orderHash: string
  subaccountId: string
}

export interface FundingPayment {
  amount: string
  marketId: string
  timestamp: number
  subaccountId: string
}

export interface FundingRate {
  rate: string
  marketId: string
  timestamp: number
}

export type GrpcFundingRate = InjectiveDerivativeExchangeRpcPb.FundingRate
export type GrpcPositionDelta = InjectiveDerivativeExchangeRpcPb.PositionDelta
export type GrpcFundingPayment = InjectiveDerivativeExchangeRpcPb.FundingPayment
export type GrpcDerivativeTrade =
  InjectiveDerivativeExchangeRpcPb.DerivativeTrade
export type GrpcDerivativePosition =
  InjectiveDerivativeExchangeRpcPb.DerivativePosition
export type GrpcDerivativePositionV2 =
  InjectiveDerivativeExchangeRpcPb.DerivativePositionV2
export type GrpcPerpetualMarketInfo =
  InjectiveDerivativeExchangeRpcPb.PerpetualMarketInfo
export type GrpcDerivativeMarketInfo =
  InjectiveDerivativeExchangeRpcPb.DerivativeMarketInfo
export type GrpcDerivativeLimitOrder =
  InjectiveDerivativeExchangeRpcPb.DerivativeLimitOrder
export type GrpcPerpetualMarketFunding =
  InjectiveDerivativeExchangeRpcPb.PerpetualMarketFunding
export type GrpcExpiryFuturesMarketInfo =
  InjectiveDerivativeExchangeRpcPb.ExpiryFuturesMarketInfo
export type GrpcBinaryOptionsMarketInfo =
  InjectiveDerivativeExchangeRpcPb.BinaryOptionsMarketInfo
export type GrpcDerivativeOrderHistory =
  InjectiveDerivativeExchangeRpcPb.DerivativeOrderHistory
