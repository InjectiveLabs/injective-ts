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
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
  persistent: true,
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
    this.stop()
    this.removeAllListeners()
  }

  public getState(): StreamState {
    return this.state
  }

  private updateState(newState: StreamState): void {
    const oldState = this.state

    this.state = newState

    this.emit(StreamEvent.StateChange, { from: oldState, to: newState })
  }

  private clearSubscription(): void {
    if (!this.subscription) {
      return
    }

    this.subscription.unsubscribe()
    this.subscription = null
  }

  private clearRetryTimeout(): void {
    if (!this.retryTimeoutId) {
      return
    }

    clearTimeout(this.retryTimeoutId)
    this.retryTimeoutId = null
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
    if (!this.config.retryConfig.enabled) {
      return
    }

    const nextBackoff = this.calculateNextBackoff(reason)

    if (nextBackoff === null) {
      this.handleMaxRetriesReached()

      return
    }

    this.retryTimeoutId = setTimeout(() => {
      this.retryAttempt++

      this.emit(StreamEvent.Retry, {
        attempt: this.retryAttempt,
        delayMs: nextBackoff,
        nextBackoff: this.calculateNextBackoff(reason),
      })

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
    } catch (error) {
      this.handleError(error)
    }
  }

  private handleConnected(isReconnect: boolean): void {
    this.updateState(StreamState.Connected)
    this.retryAttempt = 0

    this.emit(StreamEvent.Connect, {
      isReconnect,
      attempt: 0,
    })
  }

  private handleDisconnect(reason: StreamDisconnectReason): void {
    this.clearSubscription()
    this.clearRetryTimeout()

    // Determine if retry should be attempted based on disconnect reason
    const willRetry =
      isRetryableReason(reason) && this.config.retryConfig.enabled

    this.emit(StreamEvent.Disconnect, {
      reason,
      willRetry,
      attempt: this.retryAttempt,
    })

    if (willRetry) {
      this.updateState(StreamState.Reconnecting)
      this.scheduleRetry(reason)
    } else {
      this.updateState(StreamState.Stopped)
    }
  }

  private connect(): void {
    this.clearSubscription()

    const isReconnect = this.state === StreamState.Reconnecting
    this.updateState(
      isReconnect ? StreamState.Reconnecting : StreamState.Connecting,
    )

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
