import { GrpcDecodeError } from '../../types'
import { RFQ_GRPC_PATHS } from '../constants.js'
import { GrpcWebSocketCodec } from '../GrpcWebSocketCodec.js'
import { GrpcWebSocketTransport } from '../GrpcWebSocketTransport.js'
import { IndexerGrpcRfqTransformer } from '../../transformers/IndexerGrpcRfqTransformer.js'
import type { WsState } from '../../types'
import type { RFQRequestInputType } from '../../types'
import type {
  TakerStreamConfig,
  TakerStreamEvents,
  RFQStreamErrorData,
  RFQTakerStreamAckData,
} from '../../types'

type TakerEventListener<T extends keyof TakerStreamEvents> = (
  data: TakerStreamEvents[T],
) => void

export class IndexerWsTakerStream {
  private transport: GrpcWebSocketTransport
  private pingInterval: ReturnType<typeof setInterval> | null = null
  private listeners: Map<
    keyof TakerStreamEvents,
    Set<TakerEventListener<any>>
  > = new Map()
  private isDestroyed = false
  private pingIntervalMs: number

  constructor(config: TakerStreamConfig) {
    const fullUrl = this.buildUrl(config.url, RFQ_GRPC_PATHS.TakerStream)
    this.pingIntervalMs = config.pingIntervalMs ?? 1000

    this.transport = new GrpcWebSocketTransport({
      url: fullUrl,
      connectionTimeoutMs: config.connectionTimeoutMs,
      reconnect: config.reconnect,
      metadata: {
        request_address: config.requestAddress,
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

  sendRequest(request: RFQRequestInputType): void {
    if (!this.isConnected()) {
      throw new Error('Cannot send request: stream is not connected')
    }

    const encoded = GrpcWebSocketCodec.encodeTakerRequest(request)
    this.transport.send(encoded)
  }

  on<T extends keyof TakerStreamEvents>(
    event: T,
    listener: TakerEventListener<T>,
  ): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(listener)
  }

  off<T extends keyof TakerStreamEvents>(
    event: T,
    listener: TakerEventListener<T>,
  ): void {
    this.listeners.get(event)?.delete(listener)
  }

  private emit<T extends keyof TakerStreamEvents>(
    event: T,
    data: TakerStreamEvents[T],
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
      const frame = GrpcWebSocketCodec.decodeTakerResponse(data)

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

        case 'quote':
          if (response.quote) {
            const quote = IndexerGrpcRfqTransformer.grpcRfqQuoteToRfqQuote(
              response.quote,
            )
            this.emit('quote', {
              quote,
            })
          }
          break

        case 'request_ack':
          if (response.requestAck) {
            const ack: RFQTakerStreamAckData = {
              status: response.requestAck.status,
              rfqId: Number(response.requestAck.rfqId),
              clientId: response.requestAck.clientId.toString(),
            }
            this.emit('request_ack', ack)
          }
          break

        case 'conditional_order_ack':
          if (response.conditionalOrderAck?.order) {
            const order =
              IndexerGrpcRfqTransformer.grpcConditionalOrderToConditionalOrder(
                response.conditionalOrderAck.order,
              )
            this.emit('conditional_order_ack', { order })
          }
          break

        case 'conditional_order_update':
          if (response.conditionalOrder) {
            const order =
              IndexerGrpcRfqTransformer.grpcConditionalOrderToConditionalOrder(
                response.conditionalOrder,
              )
            this.emit('conditional_order_update', { order })
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
            `Unknown taker stream message type: ${response.messageType}`,
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
          const pingMessage = GrpcWebSocketCodec.encodeTakerPing()
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
