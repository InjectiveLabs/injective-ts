import {
  OrderState,
  OrderSide,
  TradeDirection,
  TradeExecutionType,
  TradeExecutionSide,
} from '@injectivelabs/ts-types'
import { GrpcOrderType } from '../../chain/types/exchange'
import { TokenMeta } from './../../../types/token'
import { InjectiveDerivativeExchangeRpc } from '@injectivelabs/indexer-proto-ts'

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

export interface PositionV2
  extends Omit<Position, 'aggregateReduceOnlyQuantity'> {
  denom: string
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
  initialMarginRatio: string
  maintenanceMarginRatio: string
  isPerpetual: boolean
  oracleBase: string
  oracleQuote: string
  oracleScaleFactor: number
  expiryFuturesMarketInfo?: ExpiryFuturesMarketInfo
}

export interface BinaryOptionsMarket
  extends Omit<
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

export type GrpcFundingRate = InjectiveDerivativeExchangeRpc.FundingRate
export type GrpcPositionDelta = InjectiveDerivativeExchangeRpc.PositionDelta
export type GrpcFundingPayment = InjectiveDerivativeExchangeRpc.FundingPayment
export type GrpcDerivativeTrade = InjectiveDerivativeExchangeRpc.DerivativeTrade
export type GrpcDerivativePosition =
  InjectiveDerivativeExchangeRpc.DerivativePosition
export type GrpcDerivativePositionV2 =
  InjectiveDerivativeExchangeRpc.DerivativePositionV2
export type GrpcPerpetualMarketInfo =
  InjectiveDerivativeExchangeRpc.PerpetualMarketInfo
export type GrpcDerivativeMarketInfo =
  InjectiveDerivativeExchangeRpc.DerivativeMarketInfo
export type GrpcDerivativeLimitOrder =
  InjectiveDerivativeExchangeRpc.DerivativeLimitOrder
export type GrpcPerpetualMarketFunding =
  InjectiveDerivativeExchangeRpc.PerpetualMarketFunding
export type GrpcExpiryFuturesMarketInfo =
  InjectiveDerivativeExchangeRpc.ExpiryFuturesMarketInfo
export type GrpcBinaryOptionsMarketInfo =
  InjectiveDerivativeExchangeRpc.BinaryOptionsMarketInfo
export type GrpcDerivativeOrderHistory =
  InjectiveDerivativeExchangeRpc.DerivativeOrderHistory
