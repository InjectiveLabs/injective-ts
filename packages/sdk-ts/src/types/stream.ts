/**
 * Subscription interface for stream management with event-based lifecycle
 */

/**
 * gRPC Status Codes
 * @see https://grpc.io/docs/guides/status-codes/
 */
export const GrpcStatusCode = {
  OK: 0,
  CANCELLED: 1,
  UNKNOWN: 2,
  INVALID_ARGUMENT: 3,
  DEADLINE_EXCEEDED: 4,
  NOT_FOUND: 5,
  ALREADY_EXISTS: 6,
  PERMISSION_DENIED: 7,
  RESOURCE_EXHAUSTED: 8,
  FAILED_PRECONDITION: 9,
  ABORTED: 10,
  OUT_OF_RANGE: 11,
  UNIMPLEMENTED: 12,
  INTERNAL: 13,
  UNAVAILABLE: 14,
  DATA_LOSS: 15,
  UNAUTHENTICATED: 16,
} as const

export type GrpcStatusCode =
  (typeof GrpcStatusCode)[keyof typeof GrpcStatusCode]

/**
 * Enhanced disconnect reasons with gRPC error code mapping
 */
export const StreamDisconnectReason = {
  /** User explicitly called stop() */
  UserStopped: 'user-stopped',
  /** Stream encountered an error */
  StreamError: 'stream-error',
  /** Network unavailable (gRPC code 14) */
  NetworkError: 'network-error',
  /** Request timeout (gRPC code 4) */
  Timeout: 'timeout',
  /** Authentication/authorization failed (gRPC code 7 or 16) */
  AuthenticationError: 'authentication-error',
  /** Invalid request - non-retryable (gRPC code 3, 5, 6, 11, 12) */
  InvalidRequest: 'invalid-request',
  /** Rate limited (gRPC code 8) */
  RateLimited: 'rate-limited',
  /** Max retry attempts reached */
  MaxRetries: 'max-retries',
  /** Stream ended normally */
  StreamEnded: 'stream-ended',
} as const

export type StreamDisconnectReason =
  (typeof StreamDisconnectReason)[keyof typeof StreamDisconnectReason]

export const StreamEvent = {
  Data: 'data',
  Connect: 'connect',
  Disconnect: 'disconnect',
  Retry: 'retry',
  StateChange: 'state:change',
  Error: 'error',
  Warn: 'warn',
} as const

export type StreamEvent = (typeof StreamEvent)[keyof typeof StreamEvent]
export interface StreamSubscription {
  /** Unsubscribe from the stream and cancel it */
  unsubscribe(): void

  /** Listen for stream errors */
  on(event: 'error', handler: (error: StreamError) => void): void

  /** Listen for stream completion (ended normally) */
  on(event: 'complete', handler: () => void): void

  /** Remove event listener */
  off(event: 'error' | 'complete', handler: (...args: any[]) => void): void
}

/**
 * Error information from stream with gRPC error codes
 *
 * Common gRPC Status Codes:
 * - 0: OK
 * - 1: CANCELLED
 * - 2: UNKNOWN
 * - 3: INVALID_ARGUMENT
 * - 4: DEADLINE_EXCEEDED
 * - 5: NOT_FOUND
 * - 7: PERMISSION_DENIED
 * - 8: RESOURCE_EXHAUSTED
 * - 13: INTERNAL
 * - 14: UNAVAILABLE
 * - 16: UNAUTHENTICATED
 */
export interface StreamError {
  /** gRPC status code */
  code: number
  /** Human-readable error message */
  details: string
  /** Additional error metadata */
  metadata?: any
}

/**
 * StreamManager
 */
export const StreamState = {
  Idle: 'idle',
  Connecting: 'connecting',
  Connected: 'connected',
  Reconnecting: 'reconnecting',
  Stopped: 'stopped',
} as const

export type StreamState = (typeof StreamState)[keyof typeof StreamState]

/**
 * Stream manager retry configuration
 */
export interface StreamManagerRetryConfig {
  /** Enable retry on failure (default: true) */
  enabled: boolean

  /** Max retry attempts before giving up (default: 5, 0 = infinite) */
  maxAttempts: number

  /** Initial backoff delay in ms (default: 1000) */
  initialDelayMs: number

  /** Max backoff delay in ms (default: 30000) */
  maxDelayMs: number

  /** Backoff multiplier (default: 2 for exponential) */
  backoffMultiplier: number

  /**
   * Persistent retry mode - continues retrying at maxDelayMs intervals
   * after exhausting exponential backoff (default: true)
   */
  persistent: boolean
}

/**
 * Stream manager configuration
 */
export interface StreamManagerConfig<TResponse> {
  /** Unique identifier for this stream (for logging) */
  id: string

  /**
   * Factory function to create the stream subscription
   * Called on initial connect and every retry
   * The subscription will emit 'error' and 'complete' events for stream lifecycle
   */
  streamFactory: () => StreamSubscription

  /** Callback to handle stream data */
  onData: (response: TResponse) => void

  /** Retry configuration */
  retryConfig?: Partial<StreamManagerRetryConfig>
}

/**
 * Internal resolved configuration with all required types
 */
export interface ResolvedStreamManagerConfig<TResponse> {
  id: string
  streamFactory: () => StreamSubscription
  onData: (response: TResponse) => void
  retryConfig: StreamManagerRetryConfig
}

/**
 * Event payload types for StreamManager
 */
export interface StreamManagerEvents<TResponse> {
  // Data received from stream
  data: TResponse

  // Connection established
  connect: {
    isReconnect: boolean
    attempt: number
  }

  // Connection lost
  disconnect: {
    reason: StreamDisconnectReason
    willRetry: boolean
    attempt?: number
  }

  // Retry attempt starting
  retry: {
    attempt: number
    delayMs: number
    nextBackoff: number | null
  }

  // State transition
  'state:change': {
    from: StreamState
    to: StreamState
  }

  // Error occurred
  error: {
    message: string
    code?: number
    details?: any
  }

  // Warning (non-fatal)
  warn: {
    message: string
  }
}
