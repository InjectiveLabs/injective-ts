import type * as InjectiveTCDerivativesRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_tc_derivatives_rpc_pb'

export interface TcPositionDelta {
  tradeDirection: string
  executionPrice: string
  executionQuantity: string
  executionMargin: string
}

export interface TcDerivativeOrderHistory {
  cid: string
  price: string
  state: string
  margin: string
  txHash: string
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
  executionSide: string
  isLiquidation: boolean
  tradeDirection: string
  executionPrice: string
  executionMargin: string
  executionQuantity: string
  tradeExecutionType: string
}

export interface TcDerivativePosition {
  denom: string
  ticker: string
  margin: string
  marketId: string
  quantity: string
  direction: string
  markPrice: string
  updatedAt: number
  entryPrice: string
  fundingSum: string
  fundingLast: string
  subaccountId: string
  liquidationPrice: string
  cumulativeFundingEntry: string
  effectiveCumulativeFundingEntry: string
}

export interface TcDerivativeLimitOrder {
  orderHash: string
  orderSide: string
  marketId: string
  subaccountId: string
  isReduceOnly: boolean
  margin: string
  price: string
  quantity: string
  unfilledQuantity: string
  triggerPrice: string
  feeRecipient: string
  state: string
  createdAt: number
  updatedAt: number
  orderNumber: number
  orderType: string
  isConditional: boolean
  triggerAt: number
  placedOrderHash: string
  executionType: string
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
