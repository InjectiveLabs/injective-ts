import type * as InjectiveTCDerivativesRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_tc_derivatives_rpc_pb'
import type {
  OrderSide,
  OrderState,
  TradeDirection,
  TradeExecutionSide,
  TradeExecutionType,
} from '../../../types/index.js'

export interface TcPositionDelta {
  executionPrice: string
  executionMargin: string
  executionQuantity: string
  tradeDirection: TradeDirection
}

export interface TcDerivativeOrderHistory {
  cid: string
  price: string
  margin: string
  txHash: string
  marketId: string
  quantity: string
  state: OrderState
  orderHash: string
  isActive: boolean
  orderType: string
  createdAt: number
  updatedAt: number
  triggerAt: number
  subaccountId: string
  triggerPrice: string
  executionType: string
  isReduceOnly: boolean
  filledQuantity: string
  isConditional: boolean
  placedOrderHash: string
  direction: TradeDirection
}

export interface TcDerivativeTradeHistory {
  fee: string
  cid: string
  pnl: string
  payout: string
  tradeId: string
  marketId: string
  orderHash: string
  executedAt: number
  subaccountId: string
  feeRecipient: string
  isLiquidation: boolean
  executionPrice: string
  executionMargin: string
  executionQuantity: string
  tradeDirection: TradeDirection
  executionSide: TradeExecutionSide
  tradeExecutionType: TradeExecutionType
}

export interface TcDerivativePosition {
  upnl: string
  denom: string
  ticker: string
  margin: string
  marketId: string
  quantity: string
  markPrice: string
  updatedAt: number
  entryPrice: string
  fundingSum: string
  fundingLast: string
  subaccountId: string
  liquidationPrice: string
  direction: TradeDirection
  cumulativeFundingEntry: string
  effectiveCumulativeFundingEntry: string
}

export interface TcDerivativeLimitOrder {
  cid: string
  price: string
  margin: string
  marketId: string
  quantity: string
  state: OrderState
  orderHash: string
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
  placedOrderHash: string
  unfilledQuantity: string
}

export interface TcDerivativesOrdersHistoryResponse {
  next: string[]
  orders: TcDerivativeOrderHistory[]
}

export interface TcDerivativeOrdersResponse {
  next: string[]
  orders: TcDerivativeLimitOrder[]
}

export interface TcDerivativeTradesResponse {
  next: string[]
  trades: TcDerivativeTradeHistory[]
}

export interface TcDerivativesPositionsResponse {
  next: string[]
  total?: number
  positions: TcDerivativePosition[]
}

export type GrpcTcPositionDelta = InjectiveTCDerivativesRpcPb.PositionDelta
export type GrpcTcDerivativeLimitOrder =
  InjectiveTCDerivativesRpcPb.DerivativeLimitOrder
export type GrpcTcDerivativeTradeHistory =
  InjectiveTCDerivativesRpcPb.DerivativeTrade
export type GrpcTcDerivativePosition =
  InjectiveTCDerivativesRpcPb.DerivativePositionV2
export type GrpcTcDerivativeOrderHistory =
  InjectiveTCDerivativesRpcPb.TCDerivativeOrderHistoryType
export type GrpcTcDerivativeOrdersResponse =
  InjectiveTCDerivativesRpcPb.OrdersResponse
export type GrpcTcDerivativeTradesResponse =
  InjectiveTCDerivativesRpcPb.TradesResponse
export type GrpcTcDerivativesPositionsResponse =
  InjectiveTCDerivativesRpcPb.PositionsResponse
export type GrpcTcDerivativesOrdersHistoryResponse =
  InjectiveTCDerivativesRpcPb.OrdersHistoryResponse
