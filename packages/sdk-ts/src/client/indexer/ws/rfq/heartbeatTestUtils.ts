import { it, vi, expect, describe, afterEach, beforeEach } from 'vitest'

type MockTransportInstance = {
  send: ReturnType<typeof vi.fn<(data: Uint8Array) => void>>
  emit: (event: string, data: any) => void
}

function getLatestTransport(mockTransportInstances: MockTransportInstance[]) {
  const transport = mockTransportInstances.at(-1)

  if (!transport) {
    throw new Error('Expected mock transport instance')
  }

  return transport
}

function encodeGrpcFrame(payload: Uint8Array) {
  const frame = new Uint8Array(5 + payload.length)

  new DataView(frame.buffer).setUint32(1, payload.length, false)
  frame.set(payload, 5)

  return frame
}

export function createPongFrame(payload: Uint8Array) {
  return encodeGrpcFrame(payload)
}

type HeartbeatStreamSpecOptions<TStream> = {
  title: string
  mockTransportInstances: MockTransportInstance[]
  createStream: (pingIntervalMs?: number) => TStream
  createPongFrame: () => Uint8Array
}

type HeartbeatStream = {
  connect: () => Promise<void>
  on: (event: 'ping' | 'pong', listener: (...args: any[]) => void) => void
}

export function describeHeartbeatStreamBehavior<
  TStream extends HeartbeatStream,
>(options: HeartbeatStreamSpecOptions<TStream>) {
  describe(options.title, () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2026-07-27T00:00:00.000Z'))
      vi.spyOn(console, 'error').mockImplementation(() => undefined)
      options.mockTransportInstances.length = 0
    })

    afterEach(() => {
      vi.useRealTimers()
      vi.restoreAllMocks()
      options.mockTransportInstances.length = 0
    })

    it('emits ping after a successful heartbeat send', async () => {
      const stream = options.createStream(100)
      const pingListener = vi.fn()

      stream.on('ping', pingListener)

      await stream.connect()

      const transport = getLatestTransport(options.mockTransportInstances)
      vi.advanceTimersByTime(100)

      expect(transport.send).toHaveBeenCalledTimes(1)
      expect(pingListener).toHaveBeenCalledTimes(1)
      expect(pingListener).toHaveBeenCalledWith({
        sentAt: Date.parse('2026-07-27T00:00:00.100Z'),
      })
    })

    it('does not emit ping when the heartbeat send throws', async () => {
      const stream = options.createStream(100)
      const pingListener = vi.fn()

      stream.on('ping', pingListener)

      await stream.connect()

      const transport = getLatestTransport(options.mockTransportInstances)
      transport.send.mockImplementationOnce(() => {
        throw new Error('send failed')
      })

      vi.advanceTimersByTime(100)

      expect(transport.send).toHaveBeenCalledTimes(1)
      expect(pingListener).not.toHaveBeenCalled()
      expect(console.error).toHaveBeenCalledTimes(1)
    })

    it('does not report a send failure when a ping listener throws', async () => {
      const stream = options.createStream(100)

      stream.on('ping', () => {
        throw new Error('listener failed')
      })

      await stream.connect()

      const transport = getLatestTransport(options.mockTransportInstances)

      vi.advanceTimersByTime(100)

      expect(transport.send).toHaveBeenCalledTimes(1)
      expect(console.error).toHaveBeenCalledTimes(1)
      expect(console.error).toHaveBeenCalledWith(
        'Error in ping listener:',
        expect.objectContaining({
          message: 'listener failed',
        }),
      )
      expect(console.error).not.toHaveBeenCalledWith(
        'Failed to send ping:',
        expect.anything(),
      )
    })

    it('continues to emit pong for heartbeat responses', async () => {
      const stream = options.createStream()
      const pongListener = vi.fn()

      stream.on('pong', pongListener)

      await stream.connect()

      const transport = getLatestTransport(options.mockTransportInstances)
      transport.emit('message', options.createPongFrame().buffer)

      expect(pongListener).toHaveBeenCalledTimes(1)
    })
  })
}
