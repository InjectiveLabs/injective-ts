import type * as InjectiveRFQRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_rpc_pb'

export interface RFQRequestType {
  rfqId: number
  margin: string
  expiry: number
  status: string
  height: number
  clientId: string
  marketId: string
  quantity: string
  direction: string
  createdAt: number
  updatedAt: number
  worstPrice: string
  requestAddress: string
  transactionTime: number
}

export interface RFQRequestInputType {
  margin: string
  expiry: number
  status: string
  clientId: string
  marketId: string
  quantity: string
  direction: string
  worstPrice: string
  requestAddress: string
  transactionTime: number
}

export interface RFQQuoteType {
  rfqId: number
  price: string
  maker: string
  taker: string
  margin: string
  expiry: number
  status: string
  height: number
  chainId: string
  marketId: string
  quantity: string
  signature: string
  createdAt: number
  updatedAt: number
  eventTime: number
  takerDirection: string
  contractAddress: string
  transactionTime: number
}

export interface RFQSettlementLimitActionType {
  price: string
}

export interface RFQSettlementUnfilledActionType {
  limit?: RFQSettlementLimitActionType
  market?: {}
}

export interface RFQSettlementType {
  rfqId: number
  taker: string
  margin: string
  height: number
  marketId: string
  quantity: string
  direction: string
  createdAt: number
  updatedAt: number
  eventTime: number
  worstPrice: string
  fallbackMargin: string
  transactionTime: number
  fallbackQuantity: string
  unfilledAction?: RFQSettlementUnfilledActionType
}

export interface OpenRequestsResponse {
  requests: RFQRequestType[]
}

export interface PendingQuotesResponse {
  quotes: RFQQuoteType[]
}

export interface SettlementsResponse {
  next: string[]
  settlements: RFQSettlementType[]
}

export type GrpcRFQQuote = InjectiveRFQRpcPb.RFQQuoteType
export type GrpcRFQRequest = InjectiveRFQRpcPb.RFQRequestType
export type GrpcRFQSettlement = InjectiveRFQRpcPb.RFQSettlementType
