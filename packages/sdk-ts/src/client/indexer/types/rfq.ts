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

export interface SettlementsResponse {
  next: string[]
  settlements: RFQSettlementType[]
}

export type GrpcRFQQuote = InjectiveRFQRpcPb.RFQQuoteType
export type GrpcRFQRequest = InjectiveRFQRpcPb.RFQRequestType
export type GrpcRFQSettlement = InjectiveRFQRpcPb.RFQSettlementType

// ============================================
// RFQ Taker/Maker WebSocket Stream Types
// ============================================
/**
 * RFQ stream error data
 */
export interface RFQStreamErrorData {
  code: string
  message: string
}

/**
 * RFQ stream acknowledgment data
 */
export interface RFQTakerStreamAckData {
  rfqId: number
  status: string
  clientId: string
}

export interface RFQMakerStreamAckData {
  rfqId: number
  status: string
}

/**
 * Event payloads for TakerStream
 */
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
  /** Connection established */
  connect: {
    isReconnect: boolean
  }
  /** Connection closed */
  disconnect: {
    reason: WsDisconnectReason
    willRetry: boolean
  }
  /** State changed */
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

/**
 * Event payloads for MakerStream
 */
export interface MakerStreamEvents {
  /** Received an RFQ request from a taker */
  request: {
    request: RFQRequestType
  }
  /** Quote was acknowledged by server */
  quote_ack: RFQMakerStreamAckData
  /** Error received from server */
  error: RFQStreamErrorData
  /** Pong received (response to ping) */
  pong: void
  /** Connection established */
  connect: {
    isReconnect: boolean
  }
  /** Connection closed */
  disconnect: {
    reason: WsDisconnectReason
    willRetry: boolean
  }
  /** State changed */
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
