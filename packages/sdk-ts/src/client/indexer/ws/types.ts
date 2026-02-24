import type { RFQQuote, RFQRequest } from '../types/rfq.js'

/**
 * WebSocket connection states
 */
export const WsState = {
  /** Initial state before connect() is called */
  Idle: 'idle',
  /** Connecting to the server */
  Connecting: 'connecting',
  /** Connected and ready to send/receive */
  Connected: 'connected',
  /** Connection lost, attempting to reconnect */
  Reconnecting: 'reconnecting',
  /** Connection closed (either by user or after max retries) */
  Disconnected: 'disconnected',
} as const

export type WsState = (typeof WsState)[keyof typeof WsState]

/**
 * Reasons for WebSocket disconnection
 */
export const WsDisconnectReason = {
  /** User explicitly called disconnect() or destroy() */
  UserStopped: 'user-stopped',
  /** Failed to establish initial connection */
  ConnectionFailed: 'connection-failed',
  /** Connection timeout during handshake */
  ConnectionTimeout: 'connection-timeout',
  /** Server closed the connection (e.g., ping timeout on server side) */
  ServerClosed: 'server-closed',
  /** Max reconnection attempts reached */
  MaxRetries: 'max-retries',
  /** WebSocket error occurred */
  Error: 'error',
} as const

export type WsDisconnectReason =
  (typeof WsDisconnectReason)[keyof typeof WsDisconnectReason]

/**
 * Reconnection configuration
 */
export interface WsReconnectConfig {
  /** Enable automatic reconnection (default: true) */
  enabled: boolean
  /** Maximum number of reconnection attempts (default: 10, 0 = infinite) */
  maxAttempts: number
  /** Initial delay before first reconnection attempt in ms (default: 1000) */
  initialDelayMs: number
  /** Maximum delay between reconnection attempts in ms (default: 30000) */
  maxDelayMs: number
  /** Multiplier for exponential backoff (default: 2) */
  backoffMultiplier: number
}

/**
 * WebSocket transport configuration
 */
export interface WsTransportConfig {
  /** WebSocket URL (base URL, stream path will be appended) */
  url: string
  /** WebSocket subprotocol (default: 'grpc-ws') */
  protocol?: string
  /** Connection timeout in milliseconds (default: 10000) */
  connectionTimeoutMs?: number
  /** Reconnection configuration */
  reconnect?: Partial<WsReconnectConfig>
  /** gRPC metadata (e.g., request_address for TakerStream) */
  metadata?: Record<string, string>
}

/**
 * Resolved transport configuration with all defaults applied
 */
export interface ResolvedWsTransportConfig {
  url: string
  protocol: string
  connectionTimeoutMs: number
  reconnect: WsReconnectConfig
  metadata?: Record<string, string>
}

/**
 * Default reconnection configuration
 */
export const DEFAULT_RECONNECT_CONFIG: WsReconnectConfig = {
  enabled: true,
  maxAttempts: 10,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
}

/**
 * Default transport configuration values
 */
export const DEFAULT_TRANSPORT_CONFIG = {
  protocol: 'grpc-ws',
  connectionTimeoutMs: 10000, // 10 seconds
}

// ============================================
// Taker Stream Types
// ============================================

/**
 * Taker stream message types (sent by client)
 */
export const TakerMessageType = {
  Ping: 'ping',
  Request: 'request',
} as const

export type TakerMessageType =
  (typeof TakerMessageType)[keyof typeof TakerMessageType]

/**
 * Taker stream response types (received from server)
 */
export const TakerResponseType = {
  Pong: 'pong',
  Quote: 'quote',
  RequestAck: 'request_ack',
  Error: 'error',
} as const

export type TakerResponseType =
  (typeof TakerResponseType)[keyof typeof TakerResponseType]

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
 * RFQ stream error data
 */
export interface RFQStreamErrorData {
  code: string
  message: string
}

/**
 * Event payloads for TakerStream
 */
export interface TakerStreamEvents {
  /** Received a quote from a maker */
  quote: {
    quote: RFQQuote
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

// ============================================
// Maker Stream Types
// ============================================

/**
 * Maker stream message types (sent by client)
 */
export const MakerMessageType = {
  Ping: 'ping',
  Quote: 'quote',
} as const

export type MakerMessageType =
  (typeof MakerMessageType)[keyof typeof MakerMessageType]

/**
 * Maker stream response types (received from server)
 */
export const MakerResponseType = {
  Pong: 'pong',
  Request: 'request',
  QuoteAck: 'quote_ack',
  Error: 'error',
} as const

export type MakerResponseType =
  (typeof MakerResponseType)[keyof typeof MakerResponseType]

/**
 * Event payloads for MakerStream
 */
export interface MakerStreamEvents {
  /** Received an RFQ request from a taker */
  request: {
    request: RFQRequest
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

// ============================================
// gRPC WebSocket Paths
// ============================================

/**
 * gRPC service paths for RFQ streams
 */
export const RFQ_GRPC_PATHS = {
  TakerStream: '/injective_rfqrpc.InjectiveRFQRPC/TakerStream',
  MakerStream: '/injective_rfqrpc.InjectiveRFQRPC/MakerStream',
} as const

// ============================================
// Transport Types
// ============================================

export type TransportEventType =
  | 'connect'
  | 'disconnect'
  | 'message'
  | 'state_change'
  | 'error'

export interface TransportEvents {
  connect: { isReconnect: boolean }
  disconnect: { reason: WsDisconnectReason; willRetry: boolean }
  message: ArrayBuffer
  state_change: { from: WsState; to: WsState }
  error: Error
}

export type TransportEventListener<T extends TransportEventType> = (
  data: TransportEvents[T],
) => void

export type IsomorphicWebSocket = WebSocket | import('ws')

// ============================================
// Codec Types
// ============================================

export interface GrpcFrame<T> {
  isTrailer: boolean
  message?: T
  payload: Uint8Array
}

export class GrpcDecodeError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GrpcDecodeError'
  }
}
