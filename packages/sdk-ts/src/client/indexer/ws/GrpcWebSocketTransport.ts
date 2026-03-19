import { WsState, WsDisconnectReason } from '../types'
import {
  DEFAULT_RECONNECT_CONFIG,
  DEFAULT_TRANSPORT_CONFIG,
} from './constants.js'
import type {
  TransportEvents,
  WsReconnectConfig,
  WsTransportConfig,
  TransportEventType,
  IsomorphicWebSocket,
  TransportEventListener,
  ResolvedWsTransportConfig,
} from '../types'

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

  async connect(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error('Transport has been destroyed')
    }

    if (this.state === WsState.Connected || this.state === WsState.Connecting) {
      return
    }

    try {
      await this.createConnection()
    } catch (error) {
      const reason = WsDisconnectReason.ConnectionFailed

      if (this.shouldAttemptReconnect(reason)) {
        this.setState(WsState.Reconnecting)
        this.emit('disconnect', { reason, willRetry: true })
        this.scheduleReconnect()
      } else {
        this.cleanup(reason, false)
      }

      throw error
    }
  }

  disconnect(): void {
    this.cleanup(WsDisconnectReason.UserStopped, false)
  }

  destroy(): void {
    this.isDestroyed = true
    this.cleanup(WsDisconnectReason.UserStopped, false)
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

  private async createConnection(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      const url = this.config.url

      this.connectionTimeout = setTimeout(() => {
        this.handleConnectionTimeout(reject)
      }, this.config.connectionTimeoutMs)

      try {
        this.ws = this.createWebSocket(
          url,
          this.config.protocol,
          this.config.metadata,
        )

        this.ws.binaryType = 'arraybuffer'

        this.ws.onopen = () => {
          this.handleOpen(resolve)
        }

        this.ws.onclose = (
          event: CloseEvent | { code: number; reason: string },
        ) => {
          this.handleClose(event, reject)
        }

        this.ws.onerror = (error: Event | Error) => {
          this.handleError(error, reject)
        }

        this.ws.onmessage = (event: MessageEvent | { data: any }) => {
          this.handleMessage(event)
        }
      } catch (error) {
        this.clearConnectionTimeout()
        reject(error)
      }
    })
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
  private handleOpen(resolve: () => void): void {
    this.clearConnectionTimeout()
    this.setState(WsState.Connected)
    this.reconnectAttempts = 0
    this.currentReconnectDelay = this.config.reconnect.initialDelayMs

    const isReconnect = this.hasConnectedOnce
    this.hasConnectedOnce = true

    this.emit('connect', { isReconnect })
    resolve()
  }

  private handleClose(
    event: CloseEvent | { code: number; reason: string },
    reject?: (error: Error) => void,
  ): void {
    // Handle close during connection attempt
    if (this.state === WsState.Connecting) {
      this.clearConnectionTimeout()
      if (reject) {
        reject(
          new Error(
            `WebSocket closed before open: code=${event.code}, reason=${event.reason}`,
          ),
        )
      }
      return
    }

    if (this.state === WsState.Disconnected || this.isDestroyed) {
      return
    }

    const reason = this.determineDisconnectReason(event)
    const shouldRetry = this.shouldAttemptReconnect(reason)

    if (shouldRetry) {
      this.setState(WsState.Reconnecting)
      this.scheduleReconnect()
      this.emit('disconnect', { reason, willRetry: true })

      return
    }

    this.cleanup(reason, false)
  }

  private handleError(
    error: Event | Error,
    reject?: (error: Error) => void,
  ): void {
    const errorObj =
      error instanceof Error ? error : new Error('WebSocket error')

    this.emit('error', errorObj)

    if (this.state === WsState.Connecting && reject) {
      this.clearConnectionTimeout()
      reject(errorObj)
    }
  }

  private handleMessage(event: MessageEvent | { data: any }): void {
    const data = event.data

    if (data instanceof ArrayBuffer) {
      this.emit('message', data)
    } else if (typeof Blob !== 'undefined' && data instanceof Blob) {
      data.arrayBuffer().then((buffer) => {
        this.emit('message', buffer)
      })
    } else if (typeof Buffer !== 'undefined' && Buffer.isBuffer(data)) {
      const buffer = new Uint8Array(data).buffer
      this.emit('message', buffer)
    }
  }

  private handleConnectionTimeout(reject: (error: Error) => void): void {
    this.ws?.close()
    this.ws = null
    reject(new Error('Connection timeout'))

    if (this.shouldAttemptReconnect(WsDisconnectReason.ConnectionTimeout)) {
      this.setState(WsState.Reconnecting)
      this.scheduleReconnect()

      return
    }

    this.cleanup(WsDisconnectReason.ConnectionTimeout, false)
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

  private scheduleReconnect(): void {
    this.clearReconnectTimeout()

    this.reconnectTimeout = setTimeout(async () => {
      if (this.isDestroyed || this.state === WsState.Disconnected) {
        return
      }

      this.reconnectAttempts++

      try {
        await this.createConnection()
      } catch {}

      this.currentReconnectDelay = Math.min(
        this.currentReconnectDelay * this.config.reconnect.backoffMultiplier,
        this.config.reconnect.maxDelayMs,
      )
    }, this.currentReconnectDelay)
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

  private cleanup(reason: WsDisconnectReason, willRetry: boolean): void {
    this.clearConnectionTimeout()
    this.clearReconnectTimeout()

    if (this.ws) {
      this.ws.onopen = null
      this.ws.onclose = null
      this.ws.onerror = null
      this.ws.onmessage = null

      if (this.ws.readyState === 0 || this.ws.readyState === 1) {
        // CONNECTING or OPEN
        this.ws.close()
      }

      this.ws = null
    }

    this.setState(WsState.Disconnected)
    this.emit('disconnect', { reason, willRetry })
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
