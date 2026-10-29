import {
  AbortError,
  throwIfAborted,
  createAbortError,
} from '@injectivelabs/utils'
import { WsState, WsDisconnectReason } from '../types'
import { closeWebSocketSafely } from '../../../utils/websocket.js'
import {
  DEFAULT_RECONNECT_CONFIG,
  DEFAULT_TRANSPORT_CONFIG,
} from './constants.js'
import type { RequestOptions } from '@injectivelabs/utils'
import type {
  TransportEvents,
  WsReconnectConfig,
  WsTransportConfig,
  TransportEventType,
  IsomorphicWebSocket,
  TransportEventListener,
  ResolvedWsTransportConfig,
} from '../types'

interface PendingConnection {
  promise: Promise<void>
  resolve: () => void
  reject: (error: Error) => void
}

function createPendingConnection(): PendingConnection {
  let resolve!: () => void
  let reject!: (error: Error) => void

  const promise = new Promise<void>((res, rej) => {
    resolve = res
    reject = rej
  })

  // Background reconnects can create a readiness promise with no caller.
  // Mark it as handled while still allowing joined callers to observe rejection.
  promise.catch(() => undefined)

  return {
    promise,
    resolve: () => {
      resolve()
    },
    reject: (error: Error) => {
      reject(error)
    },
  }
}

/**
 * Low-level gRPC-over-WebSocket transport layer.
 *
 * Handles:
 * - WebSocket connection lifecycle
 * - Reconnection with exponential backoff
 * - State management
 * - Binary message framing
 *
 * This class does NOT handle protobuf encoding/decoding - use GrpcWebSocketCodec for that.
 */
export class GrpcWebSocketTransport {
  private config: ResolvedWsTransportConfig
  private ws: IsomorphicWebSocket | null = null
  private state: WsState = WsState.Idle
  private connectionTimeout: ReturnType<typeof setTimeout> | null = null
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null
  private reconnectAttempts = 0
  private currentReconnectDelay: number
  private isDestroyed = false
  private hasConnectedOnce = false
  private listeners: Map<TransportEventType, Set<TransportEventListener<any>>> =
    new Map()

  /**
   * Identity of the explicit connection lifetime. Callbacks from an older
   * generation must never mutate the current transport state.
   */
  private generation = 0
  /**
   * Identity of the current socket attempt. Every socket event captures its
   * attempt id so stale callbacks are ignored.
   */
  private attemptSequence = 0
  private attemptId: number | null = null
  private active = false
  private activeSignal: AbortSignal | undefined
  private abortListener: (() => void) | null = null
  private pendingConnection: PendingConnection | null = null

  constructor(config: WsTransportConfig) {
    this.config = this.resolveConfig(config)
    this.currentReconnectDelay = this.config.reconnect.initialDelayMs
  }

  getState(): WsState {
    return this.state
  }

  /**
   * Check if the transport is connected and ready to send
   */
  isConnected(): boolean {
    return this.state === WsState.Connected && this.ws?.readyState === 1 // WebSocket.OPEN
  }

  /**
   * Start (or join) the explicit connection lifetime.
   *
   * The first explicit call owns the lifetime, including background
   * reconnects. Later calls without a signal, or with the same signal, join
   * the active readiness promise. A different signal is rejected explicitly
   * instead of silently taking ownership.
   *
   * The promise follows the initial-attempt semantics: it resolves once the
   * current attempt opens, and rejects if that attempt fails. Background
   * reconnects continue after an initial failure if configured.
   */
  connect(options: RequestOptions = {}): Promise<void> {
    if (this.isDestroyed) {
      return Promise.reject(new Error('Transport has been destroyed'))
    }

    const signal = options.signal

    try {
      throwIfAborted(signal)
    } catch (error) {
      return Promise.reject(error)
    }

    if (this.active) {
      if (signal !== undefined && signal !== this.activeSignal) {
        return Promise.reject(
          new Error(
            'Cannot connect: an active connection is already bound to a different AbortSignal',
          ),
        )
      }

      if (this.pendingConnection) {
        return this.pendingConnection.promise
      }

      if (this.state === WsState.Connected) {
        return Promise.resolve()
      }

      if (this.state === WsState.Reconnecting) {
        this.pendingConnection = createPendingConnection()

        return this.pendingConnection.promise
      }

      return Promise.resolve()
    }

    this.beginLifecycle(signal)

    // The signal can abort between the initial check and listener registration.
    if (signal?.aborted) {
      const error = createAbortError(signal)

      this.stopLifecycle(error, false)

      return Promise.reject(error)
    }

    return this.startAttempt().promise
  }

  disconnect(): void {
    if (this.isDestroyed) {
      return
    }

    this.stopLifecycle(
      new AbortError(new Error('WebSocket connection was disconnected')),
      true,
    )
  }

  destroy(): void {
    if (this.isDestroyed) {
      return
    }

    this.isDestroyed = true
    this.stopLifecycle(new Error('Transport has been destroyed'), true)
    this.listeners.clear()
  }

  send(data: Uint8Array): void {
    if (!this.isConnected()) {
      throw new Error('Cannot send: WebSocket is not connected')
    }

    this.ws!.send(data)
  }

  on<T extends TransportEventType>(
    event: T,
    listener: TransportEventListener<T>,
  ): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(listener)
  }

  off<T extends TransportEventType>(
    event: T,
    listener: TransportEventListener<T>,
  ): void {
    this.listeners.get(event)?.delete(listener)
  }

  private emit<T extends TransportEventType>(
    event: T,
    data: TransportEvents[T],
  ): void {
    this.listeners.get(event)?.forEach((listener) => {
      try {
        listener(data)
      } catch (error) {
        console.error(`Error in ${event} listener:`, error)
      }
    })
  }

  private beginLifecycle(signal?: AbortSignal): void {
    this.generation += 1
    this.active = true
    this.activeSignal = signal
    this.reconnectAttempts = 0
    this.currentReconnectDelay = this.config.reconnect.initialDelayMs

    if (!signal) {
      return
    }

    const generation = this.generation
    const abortListener = () => {
      if (!this.active || this.generation !== generation) {
        return
      }

      this.stopLifecycle(createAbortError(signal), true)
    }

    this.abortListener = abortListener
    signal.addEventListener('abort', abortListener, { once: true })
  }

  private startAttempt(): PendingConnection {
    const generation = this.generation
    const attempt = ++this.attemptSequence
    const pending = this.pendingConnection ?? createPendingConnection()

    this.attemptId = attempt
    this.pendingConnection = pending
    this.clearConnectionTimeout()
    this.setState(WsState.Connecting)

    if (!this.isAttemptCurrent(attempt, generation)) {
      return pending
    }

    this.connectionTimeout = setTimeout(() => {
      if (!this.isAttemptCurrent(attempt, generation)) {
        return
      }

      this.handleAttemptFailure(
        attempt,
        new Error('Connection timeout'),
        WsDisconnectReason.ConnectionTimeout,
      )
    }, this.config.connectionTimeoutMs)

    let socket: IsomorphicWebSocket

    try {
      socket = this.createWebSocket(
        this.config.url,
        this.config.protocol,
        this.config.metadata,
      )
    } catch (error) {
      if (this.isAttemptCurrent(attempt, generation)) {
        this.handleAttemptFailure(
          attempt,
          this.toError(error),
          WsDisconnectReason.ConnectionFailed,
        )
      }

      return pending
    }

    // A user event or abort can invalidate the attempt while the constructor
    // is running. Never attach lifecycle handlers to a stale socket.
    if (!this.isAttemptCurrent(attempt, generation)) {
      this.closeSocket(socket)

      return pending
    }

    this.ws = socket
    socket.binaryType = 'arraybuffer'

    socket.onopen = () => {
      this.handleOpen(attempt, generation, socket)
    }

    socket.onclose = (event: CloseEvent | { code: number; reason: string }) => {
      this.handleClose(attempt, generation, socket, event)
    }

    socket.onerror = (error: Event | Error) => {
      this.handleError(attempt, generation, socket, error)
    }

    socket.onmessage = (event: MessageEvent | { data: any }) => {
      this.handleMessage(attempt, generation, socket, event)
    }

    return pending
  }

  private createWebSocket(
    url: string,
    protocol: string,
    metadata?: Record<string, string>,
  ): IsomorphicWebSocket {
    const urlWithMetadata = this.addMetadataToUrl(url, metadata)
    return new WebSocket(urlWithMetadata, protocol)
  }

  private addMetadataToUrl(
    url: string,
    metadata?: Record<string, string>,
  ): string {
    if (!metadata || Object.keys(metadata).length === 0) {
      return url
    }

    const params = new URLSearchParams(metadata)

    const separator = url.includes('?') ? '&' : '?'

    return `${url}${separator}${params.toString()}`
  }

  /**
   * Handle WebSocket open event
   */
  private handleOpen(
    attempt: number,
    generation: number,
    socket: IsomorphicWebSocket,
  ): void {
    if (!this.isAttemptCurrent(attempt, generation) || this.ws !== socket) {
      return
    }

    this.clearConnectionTimeout()
    this.setState(WsState.Connected)

    // A state listener may have stopped or replaced this lifecycle.
    if (!this.isAttemptCurrent(attempt, generation) || this.ws !== socket) {
      return
    }

    this.reconnectAttempts = 0
    this.currentReconnectDelay = this.config.reconnect.initialDelayMs

    const isReconnect = this.hasConnectedOnce
    this.hasConnectedOnce = true

    this.emit('connect', { isReconnect })

    // A connect listener may have aborted or disconnected. The pending
    // connection was settled by that cleanup, so do not resolve it now.
    if (!this.isAttemptCurrent(attempt, generation) || this.ws !== socket) {
      return
    }

    const pending = this.pendingConnection
    this.pendingConnection = null
    pending?.resolve()
  }

  private handleClose(
    attempt: number,
    generation: number,
    socket: IsomorphicWebSocket,
    event: CloseEvent | { code: number; reason: string },
  ): void {
    if (!this.isAttemptCurrent(attempt, generation) || this.ws !== socket) {
      return
    }

    const reason = this.determineDisconnectReason(event)

    if (this.state === WsState.Connecting) {
      this.handleAttemptFailure(
        attempt,
        new Error(
          `WebSocket closed before open: code=${event.code}, reason=${event.reason}`,
        ),
        reason,
      )

      return
    }

    if (this.state !== WsState.Connected) {
      return
    }

    this.clearConnectionTimeout()
    this.attemptId = null
    this.ws = null
    this.detachSocket(socket)

    if (!this.shouldAttemptReconnect(reason)) {
      this.finalizeLifecycle(generation, reason)

      return
    }

    this.setState(WsState.Reconnecting)

    if (!this.isLifecycleCurrent(generation)) {
      return
    }

    this.emit('disconnect', { reason, willRetry: true })

    if (!this.isLifecycleCurrent(generation)) {
      return
    }

    this.scheduleReconnect(generation)
  }

  private handleError(
    attempt: number,
    generation: number,
    socket: IsomorphicWebSocket,
    error: Event | Error,
  ): void {
    if (!this.isAttemptCurrent(attempt, generation) || this.ws !== socket) {
      return
    }

    const errorObj = this.toError(error)

    this.emit('error', errorObj)

    // An error listener may have disconnected or destroyed the transport.
    if (!this.isAttemptCurrent(attempt, generation) || this.ws !== socket) {
      return
    }

    if (this.state === WsState.Connecting) {
      this.handleAttemptFailure(
        attempt,
        errorObj,
        WsDisconnectReason.ConnectionFailed,
      )
    }
  }

  private handleMessage(
    attempt: number,
    generation: number,
    socket: IsomorphicWebSocket,
    event: MessageEvent | { data: any },
  ): void {
    if (!this.isAttemptCurrent(attempt, generation) || this.ws !== socket) {
      return
    }

    const data = event.data

    if (data instanceof ArrayBuffer) {
      this.emit('message', data)

      return
    }

    if (typeof Blob !== 'undefined' && data instanceof Blob) {
      let decoded: Promise<ArrayBuffer>

      try {
        decoded = data.arrayBuffer()
      } catch (error) {
        this.emit('error', this.toError(error))

        return
      }

      decoded
        .then((buffer) => {
          // The socket may have been disconnected or replaced while the Blob
          // was being decoded. Late frames must not reach stream consumers.
          if (
            !this.isAttemptCurrent(attempt, generation) ||
            this.ws !== socket
          ) {
            return
          }

          this.emit('message', buffer)
        })
        .catch((error) => {
          if (
            !this.isAttemptCurrent(attempt, generation) ||
            this.ws !== socket
          ) {
            return
          }

          this.emit('error', this.toError(error))
        })

      return
    }

    if (typeof Buffer !== 'undefined' && Buffer.isBuffer(data)) {
      const buffer = new Uint8Array(data).buffer
      this.emit('message', buffer)
    }
  }

  private handleAttemptFailure(
    attempt: number,
    error: Error,
    reason: WsDisconnectReason,
  ): void {
    if (!this.isAttemptCurrent(attempt, this.generation)) {
      return
    }

    const generation = this.generation
    const socket = this.ws

    this.clearConnectionTimeout()
    this.attemptId = null
    this.ws = null
    this.detachSocket(socket)
    this.closeSocket(socket)

    const pending = this.pendingConnection
    this.pendingConnection = null
    pending?.reject(error)

    if (!this.isLifecycleCurrent(generation)) {
      return
    }

    if (!this.shouldAttemptReconnect(reason)) {
      this.finalizeLifecycle(generation, reason)

      return
    }

    this.setState(WsState.Reconnecting)

    // A state listener may have stopped the lifetime.
    if (!this.isLifecycleCurrent(generation)) {
      return
    }

    this.emit('disconnect', { reason, willRetry: true })

    // A disconnect listener may have stopped or replaced the lifetime. Never
    // let the old generation schedule a reconnect for a new one.
    if (!this.isLifecycleCurrent(generation)) {
      return
    }

    this.scheduleReconnect(generation)
  }

  private clearConnectionTimeout(): void {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout)
      this.connectionTimeout = null
    }
  }

  private clearReconnectTimeout(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }
  }

  private clearTimers(): void {
    this.clearConnectionTimeout()
    this.clearReconnectTimeout()
  }

  private scheduleReconnect(generation: number): void {
    if (
      !this.isLifecycleCurrent(generation) ||
      this.state !== WsState.Reconnecting
    ) {
      return
    }

    this.clearReconnectTimeout()

    // Make readiness for the next attempt joinable before the backoff timer
    // fires. A duplicate connect during backoff waits for this promise.
    if (!this.pendingConnection) {
      this.pendingConnection = createPendingConnection()
    }

    const delay = this.currentReconnectDelay

    this.currentReconnectDelay = Math.min(
      this.currentReconnectDelay * this.config.reconnect.backoffMultiplier,
      this.config.reconnect.maxDelayMs,
    )

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null

      if (
        !this.isLifecycleCurrent(generation) ||
        this.state !== WsState.Reconnecting
      ) {
        return
      }

      this.reconnectAttempts += 1
      this.startAttempt()
    }, delay)
  }

  private shouldAttemptReconnect(reason: WsDisconnectReason): boolean {
    if (reason === WsDisconnectReason.UserStopped) {
      return false
    }

    if (!this.config.reconnect.enabled) {
      return false
    }

    if (
      this.config.reconnect.maxAttempts > 0 &&
      this.reconnectAttempts >= this.config.reconnect.maxAttempts
    ) {
      return false
    }

    return true
  }

  private determineDisconnectReason(
    event: CloseEvent | { code: number; reason: string },
  ): WsDisconnectReason {
    if (event.code === 1000) {
      return WsDisconnectReason.ServerClosed
    }

    if (event.code === 1001) {
      return WsDisconnectReason.ServerClosed
    }

    if (event.code === 1006) {
      return WsDisconnectReason.ConnectionFailed
    }

    return WsDisconnectReason.Error
  }

  private finalizeLifecycle(
    generation: number,
    reason: WsDisconnectReason,
  ): void {
    if (!this.isLifecycleCurrent(generation)) {
      return
    }

    this.generation += 1
    const terminalGeneration = this.generation
    this.attemptId = null
    this.clearTimers()
    this.clearAbortListener()
    this.active = false

    const socket = this.ws
    this.ws = null
    this.detachSocket(socket)
    this.closeSocket(socket)

    const pending = this.pendingConnection
    this.pendingConnection = null
    pending?.reject(new Error('WebSocket connection is no longer active'))

    this.setState(WsState.Disconnected)

    // A state listener can synchronously start a fresh explicit connect. That
    // new lifecycle supersedes this terminal notification; emitting the old
    // disconnect now would arrive after the new Connecting/Connected events and
    // could stop the new lifetime's heartbeat or reconnect handling.
    if (this.generation !== terminalGeneration) {
      return
    }

    this.emit('disconnect', { reason, willRetry: false })
  }

  private stopLifecycle(error: Error, emitDisconnect: boolean): void {
    const wasActive = this.active
    const hadSocket = this.ws !== null
    const wasIdle = this.state === WsState.Idle

    this.generation += 1
    const terminalGeneration = this.generation
    this.attemptId = null
    this.clearTimers()
    this.clearAbortListener()
    this.active = false

    const socket = this.ws
    this.ws = null
    this.detachSocket(socket)
    this.closeSocket(socket)

    const pending = this.pendingConnection
    this.pendingConnection = null
    pending?.reject(error)

    this.setState(WsState.Disconnected)

    if (emitDisconnect && (wasActive || hadSocket || wasIdle)) {
      // As in finalizeLifecycle, a Disconnected state listener may have
      // started a fresh lifetime. Never deliver this stale UserStopped event
      // after the new lifetime's events.
      if (this.generation !== terminalGeneration) {
        return
      }

      this.emit('disconnect', {
        reason: WsDisconnectReason.UserStopped,
        willRetry: false,
      })
    }
  }

  private clearAbortListener(): void {
    if (this.activeSignal && this.abortListener) {
      this.activeSignal.removeEventListener('abort', this.abortListener)
    }

    this.abortListener = null
    this.activeSignal = undefined
  }

  private detachSocket(socket: IsomorphicWebSocket | null): void {
    if (!socket) {
      return
    }

    socket.onopen = null
    socket.onclose = null
    socket.onerror = null
    socket.onmessage = null
  }

  private closeSocket(socket: IsomorphicWebSocket | null): void {
    if (!socket) {
      return
    }

    closeWebSocketSafely(socket)
  }

  private isAttemptCurrent(attempt: number, generation: number): boolean {
    return (
      !this.isDestroyed &&
      this.active &&
      this.generation === generation &&
      this.attemptId === attempt
    )
  }

  private isLifecycleCurrent(generation: number): boolean {
    return !this.isDestroyed && this.active && this.generation === generation
  }

  private toError(error: unknown): Error {
    if (error instanceof Error) {
      return error
    }

    if (typeof error === 'string') {
      return new Error(error)
    }

    return new Error('WebSocket error')
  }

  private setState(newState: WsState): void {
    if (this.state === newState) {
      return
    }

    const from = this.state
    this.state = newState
    this.emit('state_change', { from, to: newState })
  }

  private resolveConfig(config: WsTransportConfig): ResolvedWsTransportConfig {
    const reconnect: WsReconnectConfig = {
      ...DEFAULT_RECONNECT_CONFIG,
      ...config.reconnect,
    }

    return {
      url: config.url,
      protocol: config.protocol ?? DEFAULT_TRANSPORT_CONFIG.protocol,
      connectionTimeoutMs:
        config.connectionTimeoutMs ??
        DEFAULT_TRANSPORT_CONFIG.connectionTimeoutMs,
      reconnect,
      metadata: config.metadata,
    }
  }
}
