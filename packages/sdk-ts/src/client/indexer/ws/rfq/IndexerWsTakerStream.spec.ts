import { vi } from 'vitest'
import * as InjectiveRFQExchangeRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_rpc_pb'
import { WsState, WsDisconnectReason } from '../../types'
import {
  createPongFrame,
  describeHeartbeatStreamBehavior,
} from './heartbeatTestUtils.js'

const { mockTransportInstances, MockGrpcWebSocketTransport } = vi.hoisted(
  () => {
    const mockTransportInstances: MockGrpcWebSocketTransport[] = []

    class MockGrpcWebSocketTransport {
      private listeners = new Map<string, Set<(data: any) => void>>()
      private connected = false
      send = vi.fn<(data: Uint8Array) => void>()

      constructor(_config: unknown) {
        mockTransportInstances.push(this)
      }

      getState(): WsState {
        return this.connected ? WsState.Connected : WsState.Idle
      }

      isConnected(): boolean {
        return this.connected
      }

      async connect(): Promise<void> {
        this.connected = true
        this.emit('connect', { isReconnect: false })
      }

      disconnect(): void {
        this.connected = false
        this.emit('disconnect', {
          reason: WsDisconnectReason.UserStopped,
          willRetry: false,
        })
      }

      destroy(): void {
        this.connected = false
        this.listeners.clear()
      }

      on(event: string, listener: (data: any) => void): void {
        if (!this.listeners.has(event)) {
          this.listeners.set(event, new Set())
        }

        this.listeners.get(event)!.add(listener)
      }

      off(event: string, listener: (data: any) => void): void {
        this.listeners.get(event)?.delete(listener)
      }

      emit(event: string, data: any): void {
        this.listeners.get(event)?.forEach((listener) => listener(data))
      }
    }

    return { mockTransportInstances, MockGrpcWebSocketTransport }
  },
)

vi.mock('../GrpcWebSocketTransport.js', () => ({
  GrpcWebSocketTransport: MockGrpcWebSocketTransport,
}))

import { IndexerWsTakerStream } from './IndexerWsTakerStream.js'

function createTakerPongFrame() {
  const response = InjectiveRFQExchangeRpcPb.TakerStreamResponse.create({
    messageType: 'pong',
  })

  return createPongFrame(
    InjectiveRFQExchangeRpcPb.TakerStreamResponse.toBinary(response),
  )
}

describeHeartbeatStreamBehavior({
  title: 'IndexerWsTakerStream heartbeat events',
  mockTransportInstances,
  createStream: (pingIntervalMs) =>
    new IndexerWsTakerStream({
      url: 'wss://rfq.example',
      requestAddress: 'inj1test',
      ...(pingIntervalMs ? { pingIntervalMs } : {}),
    }),
  createPongFrame: createTakerPongFrame,
})
