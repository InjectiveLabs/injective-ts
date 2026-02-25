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
