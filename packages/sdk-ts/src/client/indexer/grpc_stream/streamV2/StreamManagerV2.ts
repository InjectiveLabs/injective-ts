import { EventEmitter } from 'eventemitter3'
import {
  StreamState,
  StreamEvent,
  GrpcStatusCode,
  StreamDisconnectReason,
} from '../../../../types/index.js'
import type {
  StreamError,
  StreamSubscription,
  StreamManagerConfig,
  StreamManagerEvents,
  StreamManagerRetryConfig,
  ResolvedStreamManagerConfig,
} from '../../../../types/index.js'

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG: StreamManagerRetryConfig = {
  enabled: true,
  maxAttempts: 5,
  persistent: true,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
  initialDelayMs: 1000,
  stableConnectionMs: 10000,
}

/**
 * Maps gRPC status code to disconnect reason
 */
function mapGrpcCodeToReason(code: number): StreamDisconnectReason {
  switch (code) {
    // User-initiated cancellation
    case GrpcStatusCode.CANCELLED:
      return StreamDisconnectReason.UserStopped

    // Network/connectivity issues - retryable
    case GrpcStatusCode.UNAVAILABLE:
      return StreamDisconnectReason.NetworkError

    // Timeout - retryable
    case GrpcStatusCode.DEADLINE_EXCEEDED:
      return StreamDisconnectReason.Timeout

    // Authentication/authorization - non-retryable (user needs to re-auth)
    case GrpcStatusCode.UNAUTHENTICATED:
    case GrpcStatusCode.PERMISSION_DENIED:
      return StreamDisconnectReason.AuthenticationError

    // Rate limiting - retryable with longer backoff
    case GrpcStatusCode.RESOURCE_EXHAUSTED:
      return StreamDisconnectReason.RateLimited

    // Invalid request - non-retryable (request is malformed or resource doesn't exist)
    case GrpcStatusCode.INVALID_ARGUMENT:
    case GrpcStatusCode.NOT_FOUND:
    case GrpcStatusCode.ALREADY_EXISTS:
    case GrpcStatusCode.OUT_OF_RANGE:
    case GrpcStatusCode.UNIMPLEMENTED:
    case GrpcStatusCode.FAILED_PRECONDITION:
      return StreamDisconnectReason.InvalidRequest

    // Server-side errors - retryable
    case GrpcStatusCode.UNKNOWN:
    case GrpcStatusCode.INTERNAL:
    case GrpcStatusCode.DATA_LOSS:
    case GrpcStatusCode.ABORTED:
    default:
      return StreamDisconnectReason.StreamError
  }
}

/**
 * Determines if a disconnect reason should trigger a retry
 */
function isRetryableReason(reason: StreamDisconnectReason): boolean {
  switch (reason) {
    // Retryable errors
    case StreamDisconnectReason.NetworkError:
    case StreamDisconnectReason.Timeout:
    case StreamDisconnectReason.RateLimited:
    case StreamDisconnectReason.StreamError:
    case StreamDisconnectReason.StreamEnded:
      return true

    // Non-retryable errors
    case StreamDisconnectReason.UserStopped:
    case StreamDisconnectReason.MaxRetries:
    case StreamDisconnectReason.AuthenticationError:
    case StreamDisconnectReason.InvalidRequest:
      return false

    default:
      return false
  }
}

/**
 * StreamManagerV2 - Manages gRPC stream connections with automatic retry
 *
 * V2 Features:
 * - Event-based lifecycle (on/off methods)
 * - Automatic retry with exponential backoff
 * - Persistent retry mode
 * - Comprehensive gRPC error code mapping
 * - Distinguishes retryable vs non-retryable errors
 *
 */
export class StreamManagerV2<TResponse> extends EventEmitter<
  StreamManagerEvents<TResponse>
> {
  private config: ResolvedStreamManagerConfig<TResponse>
  private state: StreamState = StreamState.Idle
  private subscription: StreamSubscription | null = null
  private retryTimeoutId: NodeJS.Timeout | null = null
  private stableConnectionTimeoutId: NodeJS.Timeout | null = null
  private retryAttempt: number = 0

  constructor(config: StreamManagerConfig<TResponse>) {
    super()

    this.config = {
      id: config.id,
      streamFactory: config.streamFactory,
      onData: config.onData,
      retryConfig: { ...DEFAULT_RETRY_CONFIG, ...config.retryConfig },
    }

    // Override emit to intercept 'data' events for stats tracking and user callback
    const originalEmit = this.emit.bind(this)

    this.emit = ((event: any, ...args: any[]) => {
      if (event === StreamEvent.Data && args.length > 0) {
        this.handleData(args[0] as TResponse)
      }

      // Also emit the event to listeners
      return originalEmit(event, ...args)
    }) as any
  }

  public start(): void {
    if (this.isDestroyed) {
      throw new Error(
        `Cannot start destroyed stream manager: ${this.config.id}`,
      )
    }

    if (this.state !== StreamState.Idle && this.state !== StreamState.Stopped) {
      this.emit(StreamEvent.Warn, {
        message: `Stream already started (state: ${this.state})`,
      })

      return
    }

    this.connect()
  }

  public stop(): void {
    this.handleDisconnect(StreamDisconnectReason.UserStopped)
  }

  public getId(): string {
    return this.config.id
  }

  /**
   * Destroy the stream manager and clean up all resources
   * Call this when the stream manager is no longer needed
   */
  public destroy(): void {
    if (this.isDestroyed) {
      return
    }

    let teardownError: unknown
    const captureTeardownError = (callback: () => void) => {
      try {
        callback()
      } catch (error) {
        teardownError ??= error
      }
    }

    captureTeardownError(() => this.cleanupForDisconnect())
    captureTeardownError(() => this.updateState(StreamState.Destroyed))
    captureTeardownError(() =>
      this.emitDisconnectEvent(StreamDisconnectReason.UserStopped, false),
    )
    captureTeardownError(() => this.removeAllListeners())

    if (teardownError) {
      throw teardownError
    }
  }

  public getState(): StreamState {
    return this.state
  }

  private updateState(newState: StreamState): void {
    if (this.state === newState) {
      return
    }

    const oldState = this.state

    this.state = newState

    this.emit(StreamEvent.StateChange, { from: oldState, to: newState })
  }

  private get isDestroyed(): boolean {
    return this.state === StreamState.Destroyed
  }

  private clearActiveConnection(): void {
    this.clearSubscription()
    this.clearStableConnectionTimeout()
  }

  private cleanupForDisconnect(): void {
    this.clearActiveConnection()
    this.clearRetryTimeout()
  }

  private emitDisconnectEvent(
    reason: StreamDisconnectReason,
    willRetry: boolean,
  ): void {
    this.emit(StreamEvent.Disconnect, {
      reason,
      willRetry,
      attempt: this.retryAttempt,
    })
  }

  private clearSubscription(): void {
    if (!this.subscription) {
      return
    }

    const subscription = this.subscription
    this.subscription = null

    try {
      subscription.unsubscribe()
    } catch (error) {
      if (
        error instanceof Error &&
        (error.name === 'AbortError' ||
          error.message.toLowerCase().includes('signal is aborted'))
      ) {
        return
      }

      this.emit(StreamEvent.Warn, {
        message:
          error instanceof Error
            ? `Stream unsubscribe failed: ${error.message}`
            : 'Stream unsubscribe failed with unknown error',
      })
    }
  }

  private clearRetryTimeout(): void {
    if (!this.retryTimeoutId) {
      return
    }

    clearTimeout(this.retryTimeoutId)
    this.retryTimeoutId = null
  }

  private clearStableConnectionTimeout(): void {
    if (!this.stableConnectionTimeoutId) {
      return
    }

    clearTimeout(this.stableConnectionTimeoutId)
    this.stableConnectionTimeoutId = null
  }

  private calculateNextBackoff(reason?: StreamDisconnectReason): number | null {
    // Rate limiting should use a longer initial backoff
    const baseDelay =
      reason === StreamDisconnectReason.RateLimited
        ? Math.max(this.config.retryConfig.initialDelayMs, 5000) // At least 5s for rate limiting
        : this.config.retryConfig.initialDelayMs

    if (
      this.config.retryConfig.maxAttempts > 0 &&
      this.retryAttempt >= this.config.retryConfig.maxAttempts
    ) {
      return this.config.retryConfig.persistent
        ? this.config.retryConfig.maxDelayMs
        : null
    }

    const nextBackoffDelay =
      baseDelay *
      Math.pow(this.config.retryConfig.backoffMultiplier, this.retryAttempt)

    return Math.min(nextBackoffDelay, this.config.retryConfig.maxDelayMs)
  }

  private scheduleRetry(reason?: StreamDisconnectReason): void {
    if (this.isDestroyed || !this.config.retryConfig.enabled) {
      return
    }

    const nextBackoff = this.calculateNextBackoff(reason)

    if (nextBackoff === null) {
      this.handleMaxRetriesReached()

      return
    }

    this.retryTimeoutId = setTimeout(() => {
      if (this.isDestroyed) {
        return
      }

      this.retryAttempt++

      this.emit(StreamEvent.Retry, {
        attempt: this.retryAttempt,
        delayMs: nextBackoff,
        nextBackoff: this.calculateNextBackoff(reason),
      })

      if (this.isDestroyed) {
        return
      }

      this.connect()
    }, nextBackoff)
  }

  private handleMaxRetriesReached(): void {
    this.emit(StreamEvent.Error, {
      message: `Max retries (${this.config.retryConfig.maxAttempts}) reached`,
    })
    this.handleDisconnect(StreamDisconnectReason.MaxRetries)
  }

  private handleError(error: Error | StreamError | any): void {
    const errorInfo = this.extractErrorInfo(error)

    this.emit(StreamEvent.Error, errorInfo)

    // Map gRPC error code to appropriate disconnect reason
    const grpcCode =
      error && typeof error === 'object' && 'code' in error
        ? error.code
        : GrpcStatusCode.UNKNOWN

    const reason = mapGrpcCodeToReason(grpcCode)

    this.handleDisconnect(reason)
  }

  /**
   * Handles incoming data - calls user callback
   * Called automatically when user emits 'data' event from streamFactory callback
   */
  private handleData(response: TResponse): void {
    try {
      this.config.onData(response)
      this.markConnectionStable()
    } catch (error) {
      this.handleError(error)
    }
  }

  private handleConnected(isReconnect: boolean): void {
    this.updateState(StreamState.Connected)

    if (this.isDestroyed) {
      return
    }

    this.scheduleStableConnectionReset()

    this.emit(StreamEvent.Connect, {
      isReconnect,
      attempt: 0,
    })
  }

  private scheduleStableConnectionReset(): void {
    this.clearStableConnectionTimeout()

    if (this.retryAttempt === 0) {
      return
    }

    const stableConnectionMs =
      this.config.retryConfig.stableConnectionMs ??
      DEFAULT_RETRY_CONFIG.stableConnectionMs ??
      0

    if (stableConnectionMs <= 0) {
      return
    }

    this.stableConnectionTimeoutId = setTimeout(() => {
      this.markConnectionStable()
    }, stableConnectionMs)
  }

  private markConnectionStable(): void {
    this.clearStableConnectionTimeout()

    if (this.retryAttempt === 0) {
      return
    }

    this.retryAttempt = 0
  }

  private handleDisconnect(reason: StreamDisconnectReason): void {
    this.cleanupForDisconnect()

    const willRetry =
      !this.isDestroyed &&
      isRetryableReason(reason) &&
      this.config.retryConfig.enabled

    const nextState = this.isDestroyed
      ? StreamState.Destroyed
      : willRetry
        ? StreamState.Reconnecting
        : StreamState.Stopped

    let disconnectError: unknown
    const captureDisconnectError = (callback: () => void) => {
      try {
        callback()
      } catch (error) {
        disconnectError ??= error
      }
    }

    captureDisconnectError(() => this.emitDisconnectEvent(reason, willRetry))

    if (nextState === StreamState.Reconnecting) {
      captureDisconnectError(() => this.updateState(StreamState.Reconnecting))
      captureDisconnectError(() => this.scheduleRetry(reason))
    } else {
      captureDisconnectError(() => this.updateState(nextState))
    }

    if (disconnectError) {
      throw disconnectError
    }
  }

  private connect(): void {
    if (this.isDestroyed) {
      throw new Error(
        `Cannot connect destroyed stream manager: ${this.config.id}`,
      )
    }

    const isReconnect = this.state === StreamState.Reconnecting
    this.clearActiveConnection()

    this.updateState(
      isReconnect ? StreamState.Reconnecting : StreamState.Connecting,
    )

    if (this.isDestroyed) {
      return
    }

    try {
      this.subscription = this.config.streamFactory()

      // Listen for error events from the stream
      this.subscription.on('error', (error: StreamError) => {
        this.handleError(error)
      })

      // Listen for completion events from the stream
      this.subscription.on('complete', () => {
        this.handleDisconnect(StreamDisconnectReason.StreamEnded)
      })

      this.handleConnected(isReconnect)
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * Extracts error message, code, and details from an error object
   */
  private extractErrorInfo(error: Error | StreamError | any): {
    message: string
    code?: number
    details?: any
  } {
    // Handle StreamError with gRPC details field
    if (error && typeof error === 'object' && 'details' in error) {
      return {
        message: error.details,
        code: error.code,
        details: error,
      }
    }

    // Handle standard Error
    const code =
      error && typeof error === 'object' && 'code' in error
        ? error.code
        : undefined

    return {
      message: error instanceof Error ? error.message : 'Unknown error',
      code,
      details: error instanceof Error ? error.stack : error,
    }
  }
}

/**
 * @deprecated Use StreamManagerV2 instead. This alias is provided for backwards compatibility.
 */
export const StreamManager = StreamManagerV2
