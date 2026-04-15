import type * as InjectiveRFQRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_rpc_pb'
import type { WsState, WsTransportConfig, WsDisconnectReason } from './ws.js'

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
  clientId: string
  marketId: string
  quantity: string
  direction: string
  worstPrice: string
  priceCheck?: boolean
  requestAddress?: string
  transactionTime?: number
}

export interface RFQExpiryType {
  height?: number
  timestamp?: number
}

export interface RFQQuoteType {
  rfqId: number
  price: string
  maker: string
  taker: string
  margin: string
  status: string
  height: number
  chainId: string
  marketId: string
  quantity: string
  clientId: string
  signature: string
  createdAt: number
  updatedAt: number
  eventTime: number
  priceCheck: boolean
  expiry: RFQExpiryType
  takerDirection: string
  contractAddress: string
  transactionTime: number
  minFillQuantity: string
  makerSubaccountNonce: number
}

export interface RFQProcessedQuoteType {
  error: string
  rfqId: number
  price: string
  maker: string
  taker: string
  margin: string
  status: string
  height: number
  chainId: string
  marketId: string
  quantity: string
  signature: string
  createdAt: number
  updatedAt: number
  clientId: string
  eventTime: number
  priceCheck: boolean
  executedMargin: string
  takerDirection: string
  expiry?: RFQExpiryType
  contractAddress: string
  transactionTime: number
  minFillQuantity: string
  executedQuantity: string
  makerSubaccountNonce: number
}

export interface RFQSettlementLimitActionType {
  price: string
}

export interface RFQSettlementUnfilledActionType {
  limit?: RFQSettlementLimitActionType
  market?: {}
}

export interface RFQSettlementType {
  cid: string
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

export interface SettlementsResponse {
  next: string[]
  settlements: RFQSettlementType[]
}

export interface RFQConditionalOrderInput {
  version: number
  chainId: string
  contractAddress: string
  taker: string
  epoch: bigint
  rfqId: bigint
  marketId: string
  subaccountNonce: number
  laneVersion: bigint
  deadlineMs: bigint
  direction: string
  quantity: string
  margin: string
  worstPrice: string
  minTotalFillQuantity: string
  triggerType: string
  triggerPrice: string
  unfilledAction?: string
  cid?: string
  allowedRelayer?: string
}

export interface RFQConditionalOrder {
  rfqId: number
  marketId: string
  direction: string
  margin: string
  quantity: string
  worstPrice: string
  requestAddress: string
  triggerPrice: string
  status: string
  createdAt: number
  updatedAt: number
  expiresAt: number
  triggerType: string
  minTotalFillQuantity: string
}

export interface RFQConditionalOrdersResponse {
  next: string[]
  orders: RFQConditionalOrder[]
}

export type GrpcRFQQuote = InjectiveRFQRpcPb.RFQQuoteType
export type GrpcRFQExpiry = InjectiveRFQRpcPb.RFQExpiryType
export type GrpcRFQRequest = InjectiveRFQRpcPb.RFQRequestType
export type GrpcRFQSettlement = InjectiveRFQRpcPb.RFQSettlementType
export type GrpcRFQProcessedQuote = InjectiveRFQRpcPb.RFQProcessedQuoteType
export type GrpcRFQConditionalOrder =
  InjectiveRFQRpcPb.ConditionalOrderResponseType

// ============================================
// RFQ Taker/Maker WebSocket Stream Types
// ============================================
// # RFQ stream error data
export interface RFQStreamErrorData {
  code: string
  message: string
}

// # RFQ stream acknowledgment data
export interface RFQTakerStreamAckData {
  rfqId: number
  status: string
  clientId: string
}

export interface RFQMakerStreamAckData {
  rfqId: number
  status: string
}

// # Event payloads for TakerStream
export interface TakerStreamEvents {
  /** Received a quote from a maker */
  quote: {
    quote: RFQQuoteType
  }
  /** Request was acknowledged by server */
  request_ack: RFQTakerStreamAckData
  /** Error received from server */
  error: RFQStreamErrorData
  /** Pong received (response to ping) */
  pong: void
  connect: {
    isReconnect: boolean
  }
  disconnect: {
    reason: WsDisconnectReason
    willRetry: boolean
  }
  state_change: {
    from: WsState
    to: WsState
  }
}

export interface TakerStreamConfig {
  url: string
  requestAddress: string
  pingIntervalMs?: number
  connectionTimeoutMs?: number
  reconnect?: WsTransportConfig['reconnect']
}

// # Event payloads for MakerStream
export interface MakerStreamEvents {
  /** Received an RFQ request from a taker */
  request: {
    request: RFQRequestType
  }
  /** Quote was acknowledged by server */
  quote_ack: RFQMakerStreamAckData
  /** Processed quote update for maker */
  processed_quote: {
    processedQuote: RFQProcessedQuoteType
  }
  /** Settlement update for maker */
  settlement: {
    settlement: RFQSettlementType
  }
  /** Error received from server */
  error: RFQStreamErrorData
  /** Pong received (response to ping) */
  pong: void
  connect: {
    isReconnect: boolean
  }
  disconnect: {
    reason: WsDisconnectReason
    willRetry: boolean
  }
  state_change: {
    from: WsState
    to: WsState
  }
}

export interface MakerStreamConfig {
  url: string
  makerAddress: string
  pingIntervalMs?: number
  connectionTimeoutMs?: number
  reconnect?: WsTransportConfig['reconnect']
}
