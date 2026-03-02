import { GrpcDecodeError } from '../../types'
import { RFQ_GRPC_PATHS } from '../constants.js'
import { GrpcWebSocketCodec } from '../GrpcWebSocketCodec.js'
import { GrpcWebSocketTransport } from '../GrpcWebSocketTransport.js'
import { IndexerGrpcRfqTransformer } from '../../transformers/IndexerGrpcRfqTransformer.js'
import type { WsState } from '../../types'
import type { RFQQuoteType } from '../../types'
import type {
  MakerStreamConfig,
  MakerStreamEvents,
  RFQStreamErrorData,
  RFQMakerStreamAckData,
} from '../../types'

type MakerEventListener<T extends keyof MakerStreamEvents> = (
  data: MakerStreamEvents[T],
) => void

export class IndexerWsMakerStream {
  private transport: GrpcWebSocketTransport
  private pingInterval: ReturnType<typeof setInterval> | null = null
  private listeners: Map<
    keyof MakerStreamEvents,
    Set<MakerEventListener<any>>
  > = new Map()
  private isDestroyed = false
  private pingIntervalMs: number

  constructor(config: MakerStreamConfig) {
    const fullUrl = this.buildUrl(config.url, RFQ_GRPC_PATHS.MakerStream)
    this.pingIntervalMs = config.pingIntervalMs ?? 1000

    this.transport = new GrpcWebSocketTransport({
      url: fullUrl,
      connectionTimeoutMs: config.connectionTimeoutMs,
      reconnect: config.reconnect,
      metadata: {
        maker_address: config.makerAddress,
      },
    })

    this.setupTransportHandlers()
  }

  getState(): WsState {
    return this.transport.getState()
  }

  isConnected(): boolean {
    return this.transport.isConnected()
  }

  async connect(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error('Stream has been destroyed')
    }

    await this.transport.connect()
  }

  disconnect(): void {
    this.stopPingInterval()
    this.transport.disconnect()
  }

  destroy(): void {
    this.isDestroyed = true
    this.stopPingInterval()
    this.transport.destroy()
    this.listeners.clear()
  }

  sendQuote(quote: RFQQuoteType): void {
    if (!this.isConnected()) {
      throw new Error('Cannot send quote: stream is not connected')
    }

    const encoded = GrpcWebSocketCodec.encodeMakerQuote(quote)
    this.transport.send(encoded)
  }

  on<T extends keyof MakerStreamEvents>(
    event: T,
    listener: MakerEventListener<T>,
  ): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(listener)
  }

  off<T extends keyof MakerStreamEvents>(
    event: T,
    listener: MakerEventListener<T>,
  ): void {
    this.listeners.get(event)?.delete(listener)
  }

  private emit<T extends keyof MakerStreamEvents>(
    event: T,
    data: MakerStreamEvents[T],
  ): void {
    this.listeners.get(event)?.forEach((listener) => {
      try {
        listener(data)
      } catch (error) {
        console.error(`Error in ${event} listener:`, error)
      }
    })
  }

  private setupTransportHandlers(): void {
    this.transport.on('connect', ({ isReconnect }) => {
      this.startPingInterval()
      this.emit('connect', { isReconnect })
    })

    this.transport.on('disconnect', ({ reason, willRetry }) => {
      this.stopPingInterval()
      this.emit('disconnect', { reason, willRetry })
    })

    this.transport.on('state_change', ({ from, to }) => {
      this.emit('state_change', { from, to })
    })

    this.transport.on('message', (data) => {
      this.handleMessage(data)
    })

    this.transport.on('error', (error) => {
      this.emit('error', {
        code: 'TRANSPORT_ERROR',
        message: error.message,
      })
    })
  }

  private handleMessage(data: ArrayBuffer): void {
    try {
      const frame = GrpcWebSocketCodec.decodeMakerResponse(data)

      if (frame.isTrailer) {
        return
      }

      const response = frame.message
      if (!response) {
        return
      }

      switch (response.messageType) {
        case 'pong':
          this.emit('pong', undefined)
          break

        case 'request':
          if (response.request) {
            const request =
              IndexerGrpcRfqTransformer.grpcRfqRequestToRfqRequest(
                response.request,
              )
            this.emit('request', {
              request,
            })
          }
          break

        case 'quote_ack':
          if (response.quoteAck) {
            const ack: RFQMakerStreamAckData = {
              rfqId: Number(response.quoteAck.rfqId),
              status: response.quoteAck.status,
            }
            this.emit('quote_ack', ack)
          }
          break

        case 'error':
          if (response.error) {
            const error: RFQStreamErrorData = {
              code: response.error.code,
              message: response.error.message,
            }
            this.emit('error', error)
          }
          break

        default:
          console.warn(
            `Unknown maker stream message type: ${response.messageType}`,
          )
      }
    } catch (error) {
      if (error instanceof GrpcDecodeError) {
        this.emit('error', {
          code: 'DECODE_ERROR',
          message: error.message,
        })

        return
      }

      this.emit('error', {
        code: 'UNKNOWN_ERROR',
        message: error instanceof Error ? error.message : String(error),
      })
    }
  }

  private startPingInterval(): void {
    this.stopPingInterval()

    this.pingInterval = setInterval(() => {
      if (this.isConnected()) {
        try {
          const pingMessage = GrpcWebSocketCodec.encodeMakerPing()
          this.transport.send(pingMessage)
        } catch (error) {
          console.error('Failed to send ping:', error)
        }
      }
    }, this.pingIntervalMs)
  }

  private stopPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }
  }

  private buildUrl(baseUrl: string, grpcPath: string): string {
    const base = baseUrl.replace(/\/$/, '')
    const path = grpcPath.startsWith('/') ? grpcPath : `/${grpcPath}`
    return `${base}${path}`
  }
}
