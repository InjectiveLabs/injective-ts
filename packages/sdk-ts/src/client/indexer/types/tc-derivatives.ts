import type * as InjectiveTCDerivativesRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_tc_derivatives_rpc_pb'

export interface TCPositionDelta {
  tradeDirection: string
  executionPrice: string
  executionQuantity: string
  executionMargin: string
}

export interface TCDerivativeOrderHistory {
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

export interface TCDerivativeTrade {
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
  tradeExecutionType: string
  positionDelta?: TCPositionDelta
}

export interface TCDerivativePosition {
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

export interface TCDerivativesOrdersHistoryResponse {
  next: string[]
  orders: TCDerivativeOrderHistory[]
}

export interface TCDerivativesTradesResponse {
  next: string[]
  trades: TCDerivativeTrade[]
}

export interface TCDerivativesPositionsResponse {
  next: string[]
  positions: TCDerivativePosition[]
}

export type GrpcTCPositionDelta = InjectiveTCDerivativesRpcPb.PositionDelta
export type GrpcTCDerivativeTrade = InjectiveTCDerivativesRpcPb.DerivativeTrade
export type GrpcTCDerivativePosition =
  InjectiveTCDerivativesRpcPb.DerivativePositionV2
export type GrpcTCDerivativeOrderHistory =
  InjectiveTCDerivativesRpcPb.TCDerivativeOrderHistoryType
export type GrpcTCDerivativesTradesResponse =
  InjectiveTCDerivativesRpcPb.TradesResponse
export type GrpcTCDerivativesPositionsResponse =
  InjectiveTCDerivativesRpcPb.PositionsResponse
export type GrpcTCDerivativesOrdersHistoryResponse =
  InjectiveTCDerivativesRpcPb.OrdersHistoryResponse
