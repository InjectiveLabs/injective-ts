import WebSocket from 'ws'
import { logger } from '../logger.js'
import { MessageHandler } from '../types.js'

export class WebSocketClient {
  private endpoints: string[]

  private currentIndex = 0

  private ws: WebSocket | null = null

  private reconnectTimeout = 3000

  private messageHandler: MessageHandler

  constructor(endpoints: string[], messageHandler: MessageHandler) {
    this.endpoints = endpoints
    this.messageHandler = messageHandler
    this.connect()
  }

  private connect() {
    const endpoint = this.endpoints[this.currentIndex]

    logger.debug(`🔌 Connecting to ${endpoint}`)

    this.ws = new WebSocket(endpoint)

    this.ws.on('open', () => {
      logger.debug(`✅ Connected to ${endpoint}`)
    })

    this.ws.on('message', (data: WebSocket.Data) => {
      try {
        this.messageHandler(JSON.parse(data.toString()))
      } catch (err) {
        logger.error('❌ Error parsing message:', err)
      }
    })

    this.ws.on('error', (err: Error) => {
      logger.error('❌ WebSocket error:', err)
    })

    this.ws.on('close', () => {
      logger.warn(`⚠️ Disconnected from ${endpoint}`)

      this.currentIndex = (this.currentIndex + 1) % this.endpoints.length

      setTimeout(() => this.connect(), this.reconnectTimeout)
    })
  }

  public send(data: object) {
    if (!this.ws) {
      logger.warn('⚠️ WebSocket not initialized. Cannot send.')

      return
    }

    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    } else {
      setTimeout(() => this.send(data), 100)
    }
  }
}
