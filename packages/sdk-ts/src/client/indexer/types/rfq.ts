import type * as InjectiveRFQRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfqrpc_pb'

export interface RFQRequest {
  rfqId: string
  marketId: string
  direction: string
  margin: string
  quantity: string
  worstPrice: string
  requestAddress: string
  expiry: number
  status: string
  createdAt: number
  updatedAt: number
  transactionTime: number
  height: number
}

export interface RFQQuote {
  marketId: string
  rfqId: string
  takerDirection: string
  margin: string
  quantity: string
  price: string
  expiry: number
  maker: string
  taker: string
  signature: string
  status: string
  createdAt: number
  updatedAt: number
  height: number
  eventTime: number
  transactionTime: number
}

export interface RFQSettlement {
  rfqId: string
  marketId: string
  taker: string
  direction: string
  margin: string
  quantity: string
  worstPrice: string
  maker: string
  price: string
  createdAt: number
  eventTime: number
  height: number
}

export interface OpenRequestsResponse {
  requests: RFQRequest[]
}

export interface PendingQuotesResponse {
  quotes: RFQQuote[]
}

export interface SettlementsResponse {
  settlements: RFQSettlement[]
  total: number
}

export type GrpcRFQRequest = InjectiveRFQRpcPb.RFQRequestType
export type GrpcRFQQuote = InjectiveRFQRpcPb.RFQQuoteType
export type GrpcRFQSettlement = InjectiveRFQRpcPb.RFQSettlementType
