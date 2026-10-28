import { EventEmitter } from 'eventemitter3'
import { isAbortError } from '@injectivelabs/utils'
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
 * Maps gRPC status code to disconnect reason.
 *
 * A server-side CANCELLED is not a local user stop. Local abort/unsubscribe is
 * handled before this mapping (and never emits a stream error event).
 */
function mapGrpcCodeToReason(code: number): StreamDisconnectReason {
  switch (code) {
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

    // Remote cancellation is a stream error, not a caller-initiated stop.
    // Server-side errors - retryable
    case GrpcStatusCode.CANCELLED:
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
 * - Optional lifetime AbortSignal
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
  private readonly lifetimeSignal: AbortSignal | undefined
  private lifetimeAborted: boolean
  private lifetimeAbortHandler: (() => void) | null = null
  private cancelObserverDispose: (() => void) | null = null
  private generation = 0
  private destroying = false
  private stoppingForAbortedLifetime = false

  constructor(config: StreamManagerConfig<TResponse>) {
    super()

    this.config = {
      id: config.id,
      streamFactory: config.streamFactory,
      onData: config.onData,
      retryConfig: { ...DEFAULT_RETRY_CONFIG, ...config.retryConfig },
    }
    this.lifetimeSignal = config.signal
    this.lifetimeAborted = config.signal?.aborted ?? false

    if (this.lifetimeSignal && !this.lifetimeAborted) {
      this.lifetimeAbortHandler = () => this.handleLifetimeAbort()
      this.lifetimeSignal.addEventListener('abort', this.lifetimeAbortHandler, {
        once: true,
      })
    }

    // Override emit to intercept 'data' events for stats tracking and user callback
    const originalEmit = this.emit.bind(this)

    this.emit = ((event: any, ...args: any[]) => {
      if (event === StreamEvent.Data) {
        if (!this.canReceiveData()) {
          return false
        }

        const generation = this.generation

        if (args.length > 0) {
          this.handleData(args[0] as TResponse)
        }

        // onData can stop, abort, or replace this connection synchronously.
        // Do not deliver the old payload to listeners of the next lifetime.
        if (!this.canContinue(generation) || !this.canReceiveData()) {
          return false
        }
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

    if (this.stoppingForAbortedLifetime) {
      return
    }

    if (this.isLifetimeAbort()) {
      this.stopForAbortedLifetime()

      return
    }

    if (this.state !== StreamState.Idle && this.state !== StreamState.Stopped) {
      this.emit(StreamEvent.Warn, {
        message: `Stream already started (state: ${this.state})`,
      })

      return
    }

    if (this.state === StreamState.Stopped) {
      this.retryAttempt = 0
    }

    this.connect()
  }

  public stop(): void {
    if (this.isDestroyed) {
      return
    }

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

    // Terminal guard: user unsubscribe/removal callbacks may reenter the
    // manager. They must not be able to start a replacement generation.
    this.destroying = true
    this.detachLifetimeSignal()
    this.generation++

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
    return this.destroying || this.state === StreamState.Destroyed
  }

  private isLifetimeAbort(): boolean {
    if (this.lifetimeSignal?.aborted) {
      this.lifetimeAborted = true
    }

    return this.lifetimeAborted
  }

  private isCurrentGeneration(generation: number): boolean {
    return generation === this.generation
  }

  private canContinue(generation: number): boolean {
    return (
      this.isCurrentGeneration(generation) &&
      !this.isDestroyed &&
      !this.isLifetimeAbort()
    )
  }

  private isActiveConnection(
    generation: number,
    subscription: StreamSubscription,
  ): boolean {
    return this.canContinue(generation) && this.subscription === subscription
  }

  private canReceiveData(): boolean {
    if (this.isDestroyed || this.isLifetimeAbort()) {
      return false
    }

    // Connecting/Reconnecting is intentional: a factory may synchronously
    // emit initial data before handleConnected() runs.
    return (
      this.state === StreamState.Connecting ||
      this.state === StreamState.Connected ||
      this.state === StreamState.Reconnecting
    )
  }

  private detachLifetimeSignal(): void {
    if (!this.lifetimeSignal || !this.lifetimeAbortHandler) {
      return
    }

    this.lifetimeSignal.removeEventListener('abort', this.lifetimeAbortHandler)
    this.lifetimeAbortHandler = null
  }

  private handleLifetimeAbort(): void {
    this.lifetimeAborted = true

    if (this.isDestroyed) {
      return
    }

    if (this.state === StreamState.Idle || this.state === StreamState.Stopped) {
      this.generation++
      this.cleanupForDisconnect()

      return
    }

    this.handleDisconnect(StreamDisconnectReason.UserStopped)
  }

  private stopForAbortedLifetime(): void {
    if (this.isDestroyed || this.stoppingForAbortedLifetime) {
      return
    }

    this.stoppingForAbortedLifetime = true

    try {
      this.lifetimeAborted = true
      const generation = ++this.generation
      this.retryAttempt = 0

      let teardownError: unknown
      const captureTeardownError = (callback: () => void) => {
        try {
          callback()
        } catch (error) {
          teardownError ??= error
        }
      }

      captureTeardownError(() => this.cleanupForDisconnect())

      if (this.isCurrentGeneration(generation)) {
        captureTeardownError(() =>
          this.emitDisconnectEvent(StreamDisconnectReason.UserStopped, false),
        )

        if (this.isCurrentGeneration(generation)) {
          captureTeardownError(() => this.updateState(StreamState.Stopped))
        }
      }

      if (teardownError) {
        throw teardownError
      }
    } finally {
      this.stoppingForAbortedLifetime = false
    }
  }

  private clearActiveConnection(): void {
    // Detach timers before invoking user unsubscribe/observer callbacks. A
    // reentrant stop/start during those callbacks must not have its new
    // generation's timers cleared by this (old generation) cleanup.
    this.clearStableConnectionTimeout()
    this.clearSubscription()
  }

  private cleanupForDisconnect(): void {
    this.clearStableConnectionTimeout()
    this.clearRetryTimeout()
    this.clearSubscription()
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

  private disposeCancellationObserver(): void {
    if (!this.cancelObserverDispose) {
      return
    }

    const dispose = this.cancelObserverDispose
    this.cancelObserverDispose = null

    try {
      dispose()
    } catch (error) {
      this.emit(StreamEvent.Warn, {
        message:
          error instanceof Error
            ? `Stream cancellation observer cleanup failed: ${error.message}`
            : 'Stream cancellation observer cleanup failed',
      })
    }
  }

  private unsubscribeSubscription(subscription: StreamSubscription): void {
    try {
      subscription.unsubscribe()
    } catch (error) {
      if (
        isAbortError(error) ||
        (error instanceof Error &&
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

  private clearSubscription(): void {
    if (!this.subscription) {
      this.cancelObserverDispose = null

      return
    }

    const subscription = this.subscription
    this.subscription = null

    this.disposeCancellationObserver()
    this.unsubscribeSubscription(subscription)
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

  private scheduleRetry(
    reason: StreamDisconnectReason | undefined,
    generation: number,
  ): void {
    if (
      !this.canContinue(generation) ||
      this.state !== StreamState.Reconnecting ||
      !this.config.retryConfig.enabled
    ) {
      return
    }

    const nextBackoff = this.calculateNextBackoff(reason)

    if (nextBackoff === null) {
      this.handleMaxRetriesReached(generation)

      return
    }

    this.clearRetryTimeout()

    this.retryTimeoutId = setTimeout(() => {
      this.retryTimeoutId = null

      if (
        !this.canContinue(generation) ||
        this.state !== StreamState.Reconnecting
      ) {
        return
      }

      this.retryAttempt++

      try {
        this.emit(StreamEvent.Retry, {
          attempt: this.retryAttempt,
          delayMs: nextBackoff,
          nextBackoff: this.calculateNextBackoff(reason),
        })
      } catch (error) {
        if (this.canContinue(generation)) {
          this.handleError(error)
        }

        return
      }

      if (
        !this.canContinue(generation) ||
        this.state !== StreamState.Reconnecting
      ) {
        return
      }

      this.connect()
    }, nextBackoff)
  }

  private handleMaxRetriesReached(generation: number): void {
    if (!this.canContinue(generation)) {
      return
    }

    let eventError: unknown

    try {
      this.emit(StreamEvent.Error, {
        message: `Max retries (${this.config.retryConfig.maxAttempts}) reached`,
      })
    } catch (error) {
      eventError = error
    }

    if (!this.canContinue(generation)) {
      if (eventError) {
        throw eventError
      }

      return
    }

    this.handleDisconnect(StreamDisconnectReason.MaxRetries)

    if (eventError) {
      throw eventError
    }
  }

  private handleError(error: Error | StreamError | any): void {
    if (this.isDestroyed) {
      return
    }

    if (this.isLifetimeAbort() || this.subscription?.cancelled === true) {
      this.handleDisconnect(StreamDisconnectReason.UserStopped)

      return
    }

    const generation = this.generation
    const errorInfo = this.extractErrorInfo(error)
    let eventError: unknown

    try {
      this.emit(StreamEvent.Error, errorInfo)
    } catch (caughtError) {
      eventError = caughtError
    }

    if (!this.isCurrentGeneration(generation)) {
      if (eventError) {
        throw eventError
      }

      return
    }

    const grpcCode = errorInfo.code ?? GrpcStatusCode.UNKNOWN
    const reason = mapGrpcCodeToReason(grpcCode)

    this.handleDisconnect(reason)

    if (eventError) {
      throw eventError
    }
  }

  /**
   * Handles incoming data - calls user callback
   * Called automatically when user emits 'data' event from streamFactory callback
   */
  private handleData(response: TResponse): void {
    if (!this.canReceiveData()) {
      return
    }

    const generation = this.generation

    try {
      this.config.onData(response)

      if (
        !this.canContinue(generation) ||
        this.state !== StreamState.Connected
      ) {
        return
      }

      this.markConnectionStable()
    } catch (error) {
      if (!this.canContinue(generation)) {
        return
      }

      this.handleError(error)
    }
  }

  private handleConnected(generation: number, isReconnect: boolean): void {
    if (!this.canContinue(generation)) {
      return
    }

    this.updateState(StreamState.Connected)

    if (!this.canContinue(generation)) {
      return
    }

    this.scheduleStableConnectionReset(generation)

    if (!this.canContinue(generation)) {
      return
    }

    this.emit(StreamEvent.Connect, {
      isReconnect,
      attempt: 0,
    })
  }

  private scheduleStableConnectionReset(generation: number): void {
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
      this.stableConnectionTimeoutId = null

      if (
        !this.canContinue(generation) ||
        this.state !== StreamState.Connected
      ) {
        return
      }

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
    const generation = ++this.generation

    const willRetry =
      !this.isDestroyed &&
      !this.isLifetimeAbort() &&
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

    captureDisconnectError(() => this.cleanupForDisconnect())

    if (!this.isCurrentGeneration(generation)) {
      if (disconnectError) {
        throw disconnectError
      }

      return
    }

    captureDisconnectError(() => this.emitDisconnectEvent(reason, willRetry))

    if (!this.isCurrentGeneration(generation)) {
      if (disconnectError) {
        throw disconnectError
      }

      return
    }

    if (nextState === StreamState.Reconnecting) {
      captureDisconnectError(() => this.updateState(StreamState.Reconnecting))

      if (this.isCurrentGeneration(generation) && !this.isLifetimeAbort()) {
        captureDisconnectError(() => this.scheduleRetry(reason, generation))
      }
    } else {
      captureDisconnectError(() => this.updateState(nextState))
    }

    if (disconnectError) {
      throw disconnectError
    }
  }

  private observeSubscriptionCancellation(
    subscription: StreamSubscription,
    generation: number,
  ): void {
    if (typeof subscription.onCancel !== 'function') {
      return
    }

    let dispose: (() => void) | undefined

    try {
      dispose = subscription.onCancel(() => {
        if (!this.isActiveConnection(generation, subscription)) {
          return
        }

        this.handleDisconnect(StreamDisconnectReason.UserStopped)
      })
    } catch (error) {
      if (!this.isActiveConnection(generation, subscription)) {
        return
      }

      this.emit(StreamEvent.Warn, {
        message:
          error instanceof Error
            ? `Stream cancellation listener failed: ${error.message}`
            : 'Stream cancellation listener failed',
      })

      return
    }

    if (this.isActiveConnection(generation, subscription)) {
      this.cancelObserverDispose = dispose ?? null
    } else if (dispose) {
      dispose()
    }
  }

  private connect(): void {
    if (this.isDestroyed) {
      throw new Error(
        `Cannot connect destroyed stream manager: ${this.config.id}`,
      )
    }

    if (this.isLifetimeAbort()) {
      this.stopForAbortedLifetime()

      return
    }

    const generation = ++this.generation
    const isReconnect = this.state === StreamState.Reconnecting

    this.clearActiveConnection()

    if (!this.isCurrentGeneration(generation)) {
      return
    }

    this.updateState(
      isReconnect ? StreamState.Reconnecting : StreamState.Connecting,
    )

    if (!this.canContinue(generation)) {
      return
    }

    let subscription: StreamSubscription

    try {
      subscription = this.config.streamFactory()
    } catch (error) {
      if (!this.canContinue(generation)) {
        return
      }

      this.handleError(error)

      return
    }

    if (!this.canContinue(generation)) {
      this.unsubscribeSubscription(subscription)

      return
    }

    this.subscription = subscription
    this.observeSubscriptionCancellation(subscription, generation)

    if (!this.isActiveConnection(generation, subscription)) {
      return
    }

    if (subscription.cancelled === true) {
      this.handleDisconnect(StreamDisconnectReason.UserStopped)

      return
    }

    try {
      // Listen for error events from the stream
      subscription.on('error', (error: StreamError) => {
        if (!this.isActiveConnection(generation, subscription)) {
          return
        }

        this.handleError(error)
      })

      // Listen for completion events from the stream
      subscription.on('complete', () => {
        if (!this.isActiveConnection(generation, subscription)) {
          return
        }

        this.handleDisconnect(StreamDisconnectReason.StreamEnded)
      })
    } catch (error) {
      if (!this.isActiveConnection(generation, subscription)) {
        return
      }

      this.handleError(error)

      return
    }

    if (!this.isActiveConnection(generation, subscription)) {
      return
    }

    this.handleConnected(generation, isReconnect)
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
        message:
          typeof error.details === 'string'
            ? error.details
            : error instanceof Error
              ? error.message
              : 'Unknown stream error',
        code: error.code,
        details: error,
      }
    }

    // Handle standard Error
    const code = error && typeof error === 'object' ? error.code : undefined

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
