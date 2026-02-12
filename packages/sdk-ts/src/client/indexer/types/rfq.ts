import type * as InjectiveRFQRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfqrpc_pb'

export interface RFQRequest {
  rfqId: string
  margin: string
  expiry: number
  status: string
  height: number
  marketId: string
  quantity: string
  direction: string
  createdAt: number
  updatedAt: number
  worstPrice: string
  requestAddress: string
  transactionTime: number
}

export interface RFQQuote {
  rfqId: string
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

export interface RFQSettlement {
  rfqId: string
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
}

export interface OpenRequestsResponse {
  requests: RFQRequest[]
}

export interface PendingQuotesResponse {
  quotes: RFQQuote[]
}

export interface SettlementsResponse {
  total: number
  settlements: RFQSettlement[]
}

export type GrpcRFQRequest = InjectiveRFQRpcPb.RFQRequestType
export type GrpcRFQQuote = InjectiveRFQRpcPb.RFQQuoteType
export type GrpcRFQSettlement = InjectiveRFQRpcPb.RFQSettlementType
