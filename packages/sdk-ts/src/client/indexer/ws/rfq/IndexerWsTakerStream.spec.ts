import { vi } from 'vitest'
import * as InjectiveRFQExchangeRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_rpc_pb'
import { WsState, WsDisconnectReason } from '../../types'
import { GrpcWebSocketCodec } from '../GrpcWebSocketCodec.js'
import {
  createPongFrame,
  describeHeartbeatStreamBehavior,
} from './heartbeatTestUtils.js'

const { mockTransportInstances, MockGrpcWebSocketTransport } = vi.hoisted(
  () => {
    const mockTransportInstances: MockGrpcWebSocketTransport[] = []

    class MockGrpcWebSocketTransport {
      config: unknown
      private listeners = new Map<string, Set<(data: any) => void>>()
      private connected = false
      send = vi.fn<(data: Uint8Array) => void>()

      constructor(config: unknown) {
        this.config = config
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

describe('IndexerWsTakerStream heartbeat encode failures', () => {
  it('logs send failure and skips ping when ping encoding throws', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-27T00:00:00.000Z'))
    const errorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)
    const encodeSpy = vi
      .spyOn(GrpcWebSocketCodec, 'encodeTakerPing')
      .mockImplementation(() => {
        throw new Error('encode failed')
      })

    const stream = new IndexerWsTakerStream({
      url: 'wss://rfq.example',
      requestAddress: 'inj1test',
      pingIntervalMs: 100,
    })
    const pingListener = vi.fn()
    stream.on('ping', pingListener)

    await stream.connect()

    const transport = mockTransportInstances.at(-1)
    if (!transport) {
      throw new Error('Expected mock transport instance')
    }

    vi.advanceTimersByTime(100)

    expect(transport.send).not.toHaveBeenCalled()
    expect(pingListener).not.toHaveBeenCalled()
    expect(errorSpy).toHaveBeenCalledWith(
      'Failed to send ping:',
      expect.objectContaining({ message: 'encode failed' }),
    )

    encodeSpy.mockRestore()
    errorSpy.mockRestore()
    vi.useRealTimers()
  })
})

describe('IndexerWsTakerStream authentication', () => {
  it('encodes auth and emits challenge and result events', async () => {
    const stream = new IndexerWsTakerStream({
      url: 'wss://rfq.example',
      requestAddress: 'inj1test',
    })
    const challengeListener = vi.fn()
    const resultListener = vi.fn()
    stream.on('challenge', challengeListener)
    stream.on('auth_result', resultListener)

    await stream.connect()
    stream.sendAuth({ signature: '0xsig' })

    const transport = mockTransportInstances.at(-1)
    if (!transport) {
      throw new Error('Expected mock transport instance')
    }

    const sent = transport.send.mock.calls.at(-1)?.[0]
    const auth =
      InjectiveRFQExchangeRpcPb.TakerStreamStreamingRequest.fromBinary(
        sent!.subarray(5),
      )
    expect(auth).toMatchObject({
      messageType: 'auth',
      auth: { signature: '0xsig' },
    })

    for (const response of [
      {
        messageType: 'challenge',
        challenge: {
          nonce: '0xnonce',
          expiresAt: 2n,
        },
      },
      {
        messageType: 'auth_result',
        authResult: {
          authenticated: true,
          code: 'success',
          message: 'verified',
        },
      },
    ]) {
      transport.emit(
        'message',
        createPongFrame(
          InjectiveRFQExchangeRpcPb.TakerStreamResponse.toBinary(
            InjectiveRFQExchangeRpcPb.TakerStreamResponse.create(response),
          ),
        ).buffer,
      )
    }

    expect(challengeListener).toHaveBeenCalledWith({
      challenge: {
        nonce: '0xnonce',
        expiresAt: 2,
      },
    })
    expect(resultListener).toHaveBeenCalledWith({
      authenticated: true,
      code: 'success',
      message: 'verified',
    })
  })

  it('passes requested auth metadata when creating the transport', () => {
    new IndexerWsTakerStream({
      url: 'wss://rfq.example',
      requestAddress: 'inj1test',
      authVersion: 'v1',
    })

    expect(mockTransportInstances.at(-1)).toMatchObject({
      config: {
        metadata: {
          request_address: 'inj1test',
          auth_version: 'v1',
          subscribe_to_conditional_order_updates: 'true',
        },
      },
    })
  })
})
