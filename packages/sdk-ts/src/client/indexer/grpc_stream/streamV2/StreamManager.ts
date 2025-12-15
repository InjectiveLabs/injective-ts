import { EventEmitter } from 'eventemitter3'
import {
  StreamState,
  StreamEvent,
  StreamDisconnectReason,
} from '../../../../types/index.js'
import type {
  StreamStats,
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
 * StreamManagerV2 - Manages gRPC stream connections with automatic retry
 *
 * V2 Features:
 * - Event-based lifecycle (on/off methods)
 * - Automatic retry with exponential backoff
 * - Persistent retry mode
 * - Comprehensive statistics tracking
 * - gRPC error code mapping
 *
 */
export class StreamManagerV2<TResponse> extends EventEmitter<
  StreamManagerEvents<TResponse>
> {
  private config: ResolvedStreamManagerConfig<TResponse>
  private state: StreamState = StreamState.Idle
  private subscription: StreamSubscription | null = null
  private retryTimeoutId: NodeJS.Timeout | null = null
  private stats: StreamStats
  private retryAttempt: number = 0

  constructor(config: StreamManagerConfig<TResponse>) {
    super()

    this.config = {
      id: config.id,
      streamFactory: config.streamFactory,
      onData: config.onData,
      retryConfig: { ...DEFAULT_RETRY_CONFIG, ...config.retryConfig },
    }

    // Initialize stream statistics
    this.stats = {
      state: StreamState.Idle,
      connectCount: 0,
      disconnectCount: 0,
      retryCount: 0,
      dataReceivedCount: 0,
      errorCount: 0,
      lastDataAt: null,
      createdAt: Date.now(),
      connectedAt: null,
      disconnectedAt: null,
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

  public getState(): StreamState {
    return this.state
  }

  public getStats(): StreamStats {
    return { ...this.stats, state: this.state }
  }

  /**
   * Destroy the stream manager and clean up all resources
   * Call this when the stream manager is no longer needed
   */
  public destroy(): void {
    this.stop()
    this.removeAllListeners()
  }

  private updateState(newState: StreamState): void {
    const oldState = this.state

    this.state = newState
    this.stats.state = newState

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

  private calculateNextBackoff(): number | null {
    if (
      this.config.retryConfig.maxAttempts > 0 &&
      this.retryAttempt >= this.config.retryConfig.maxAttempts
    ) {
      return this.config.retryConfig.persistent
        ? this.config.retryConfig.maxDelayMs
        : null
    }

    const nextBackoffDelay =
      this.config.retryConfig.initialDelayMs *
      Math.pow(this.config.retryConfig.backoffMultiplier, this.retryAttempt)

    return Math.min(nextBackoffDelay, this.config.retryConfig.maxDelayMs)
  }

  private scheduleRetry(): void {
    if (!this.config.retryConfig.enabled) {
      return
    }

    const nextBackoff = this.calculateNextBackoff()

    if (nextBackoff === null) {
      this.handleMaxRetriesReached()

      return
    }

    this.retryTimeoutId = setTimeout(() => {
      this.retryAttempt++
      this.stats.retryCount++

      this.emit(StreamEvent.Retry, {
        attempt: this.retryAttempt,
        delayMs: nextBackoff,
        nextBackoff: this.calculateNextBackoff(),
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

    this.stats.errorCount++
    this.emit(StreamEvent.Error, errorInfo)

    // Map gRPC error code to appropriate disconnect reason
    let reason: StreamDisconnectReason = StreamDisconnectReason.StreamError

    if (error && typeof error === 'object' && 'code' in error) {
      switch (error.code) {
        case 14: // UNAVAILABLE
          reason = StreamDisconnectReason.NetworkError
          break
        case 4: // DEADLINE_EXCEEDED
          reason = StreamDisconnectReason.Timeout
          break
        case 16: // UNAUTHENTICATED
          reason = StreamDisconnectReason.AuthenticationError
          break
        case 1: // CANCELLED
          reason = StreamDisconnectReason.UserStopped
          break
      }
    }

    this.handleDisconnect(reason)
  }

  /**
   * Handles incoming data - tracks stats and calls user callback
   * Called automatically when user emits 'data' event from streamFactory callback
   */
  private handleData(response: TResponse): void {
    this.stats.dataReceivedCount++
    this.stats.lastDataAt = Date.now()

    try {
      this.config.onData(response)
    } catch (error) {
      this.handleError(error)
    }
  }

  private handleConnected(isReconnect: boolean): void {
    this.updateState(StreamState.Connected)
    this.retryAttempt = 0
    this.stats.connectCount++
    this.stats.connectedAt = Date.now()

    this.emit(StreamEvent.Connect, {
      isReconnect,
      attempt: this.stats.connectCount,
    })
  }

  private handleDisconnect(reason: StreamDisconnectReason): void {
    this.clearSubscription()
    this.clearRetryTimeout()

    this.stats.disconnectCount++
    this.stats.disconnectedAt = Date.now()

    // Determine if retry should be attempted based on disconnect reason
    const willRetry =
      reason !== StreamDisconnectReason.UserStopped &&
      reason !== StreamDisconnectReason.MaxRetries &&
      this.config.retryConfig.enabled

    this.emit(StreamEvent.Disconnect, {
      reason,
      willRetry,
      attempt: this.retryAttempt,
    })

    if (willRetry) {
      this.updateState(StreamState.Reconnecting)
      this.scheduleRetry()
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
   * Extracts error message and details from an error object
   */
  private extractErrorInfo(error: Error | StreamError | any): {
    message: string
    details?: any
  } {
    // Handle StreamError with gRPC details field
    if (error && typeof error === 'object' && 'details' in error) {
      return {
        message: error.details,
        details: error,
      }
    }

    // Handle standard Error
    return {
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : error,
    }
  }
}

/**
 * @deprecated Use StreamManagerV2 instead. This alias is provided for backwards compatibility.
 */
export const StreamManager = StreamManagerV2
