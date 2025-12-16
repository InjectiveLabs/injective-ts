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
  tradeDirection: TradeDirection
  executionPrice: string
  executionQuantity: string
  executionMargin: string
}

export interface Position {
  marketId: string
  subaccountId: string
  direction: TradeDirection
  quantity: string
  entryPrice: string
  margin: string
  liquidationPrice: string
  markPrice: string
  ticker: string
  aggregateReduceOnlyQuantity: string
  updatedAt: number
}

export interface PositionV2 extends Omit<
  Position,
  'aggregateReduceOnlyQuantity'
> {
  denom: string
  fundingSum: string
}

export interface PerpetualMarketInfo {
  hourlyFundingRateCap: string
  hourlyInterestRate: string
  nextFundingTimestamp: number
  fundingInterval: number
}

export interface PerpetualMarketFunding {
  cumulativeFunding: string
  cumulativePrice: string
  lastTimestamp: number
}

export interface ExpiryFuturesMarketInfo {
  expirationTimestamp: number
  settlementPrice: string
}

export interface BaseDerivativeMarket {
  oracleType: string
  marketId: string
  marketStatus: string
  ticker: string
  quoteDenom: string
  makerFeeRate: string
  quoteToken: TokenMeta | undefined
  takerFeeRate: string
  serviceProviderFee: string
  minPriceTickSize: number
  minQuantityTickSize: number
  minNotional: number
}

export interface PerpetualMarket extends BaseDerivativeMarket {
  reduceMarginRatio: string
  initialMarginRatio: string
  maintenanceMarginRatio: string
  isPerpetual: boolean
  oracleBase: string
  oracleQuote: string
  oracleScaleFactor: number
  perpetualMarketInfo?: PerpetualMarketInfo
  perpetualMarketFunding?: PerpetualMarketFunding
}

export interface ExpiryFuturesMarket extends BaseDerivativeMarket {
  reduceMarginRatio: string
  initialMarginRatio: string
  maintenanceMarginRatio: string
  isPerpetual: boolean
  oracleBase: string
  oracleQuote: string
  oracleScaleFactor: number
  expiryFuturesMarketInfo?: ExpiryFuturesMarketInfo
}

export interface BinaryOptionsMarket extends Omit<
  BaseDerivativeMarket,
  'minPriceTickSize' | 'minQuantityTickSize'
> {
  oracleSymbol: string
  oracleProvider: string
  oracleScaleFactor: number
  expirationTimestamp: number
  settlementTimestamp: number
  serviceProviderFee: string
  minPriceTickSize: number
  minQuantityTickSize: number
  minNotional: number
  settlementPrice: string
}

export type DerivativeMarket =
  | PerpetualMarket
  | ExpiryFuturesMarket
  | BinaryOptionsMarket

export type DerivativeMarketWithoutBinaryOptions =
  | PerpetualMarket
  | ExpiryFuturesMarket

export interface DerivativeLimitOrder {
  orderHash: string
  orderSide: OrderSide
  marketId: string
  cid: string
  subaccountId: string
  isReduceOnly: boolean
  margin: string
  price: string
  quantity: string
  unfilledQuantity: string
  triggerPrice: string
  feeRecipient: string
  state: OrderState
  createdAt: number
  updatedAt: number
  orderNumber: number
  orderType: string
  isConditional: boolean
  triggerAt: number
  placedOrderHash: string
  executionType: string
}

export interface DerivativeOrderHistory {
  orderHash: string
  marketId: string
  cid: string
  isActive: boolean
  subaccountId: string
  executionType: string
  orderType: string
  price: string
  triggerPrice: string
  quantity: string
  filledQuantity: string
  state: string
  createdAt: number
  updatedAt: number
  isReduceOnly: boolean
  direction: string
  isConditional: boolean
  triggerAt: number
  placedOrderHash: string
  margin: string
}

export interface DerivativeTrade extends PositionDelta {
  orderHash: string
  subaccountId: string
  tradeId: string
  cid: string
  marketId: string
  executedAt: number
  tradeExecutionType: TradeExecutionType
  tradeDirection: TradeDirection
  executionSide: TradeExecutionSide
  fee: string
  feeRecipient: string
  isLiquidation: boolean
  payout: string
  pnl: string
}

export interface DerivativeLimitOrderParams {
  orderType: GrpcOrderType
  triggerPrice?: string
  feeRecipient: string
  price: string
  margin: string
  quantity: string
}

export interface DerivativeOrderCancelParams {
  orderHash: string
}

export interface BatchDerivativeOrderCancelParams {
  marketId: string
  subaccountId: string
  orderHash: string
}

export interface FundingPayment {
  marketId: string
  subaccountId: string
  amount: string
  timestamp: number
}

export interface FundingRate {
  marketId: string
  rate: string
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
