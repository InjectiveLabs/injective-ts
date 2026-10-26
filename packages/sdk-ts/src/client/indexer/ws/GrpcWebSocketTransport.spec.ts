import { isAbortError } from '@injectivelabs/utils'
import { it, vi, expect, describe, afterEach, beforeEach } from 'vitest'
import { WsState, WsDisconnectReason } from '../types'
import { GrpcWebSocketTransport } from './GrpcWebSocketTransport.js'
import { IndexerWsMakerStream } from './rfq/IndexerWsMakerStream.js'
import { IndexerWsTakerStream } from './rfq/IndexerWsTakerStream.js'
import type { WsTransportConfig } from '../types'

class MockWebSocket {
  static readonly CONNECTING = 0
  static readonly OPEN = 1
  static readonly CLOSING = 2
  static readonly CLOSED = 3

  static instances: MockWebSocket[] = []
  static constructionError: Error | null = null

  readonly url: string
  readonly protocol: string | string[] | undefined
  binaryType = 'blob'
  readyState = MockWebSocket.CONNECTING
  onopen: ((event: Event) => void) | null = null
  onclose: ((event: { code: number; reason: string }) => void) | null = null
  onerror: ((event: Event | Error) => void) | null = null
  onmessage: ((event: { data: any }) => void) | null = null
  sent: Uint8Array[] = []
  send = vi.fn((data: Uint8Array) => {
    this.sent.push(data)
  })
  close = vi.fn(() => {
    this.readyState = MockWebSocket.CLOSED
  })

  constructor(url: string, protocol?: string | string[]) {
    if (MockWebSocket.constructionError) {
      throw MockWebSocket.constructionError
    }

    this.url = url
    this.protocol = protocol
    MockWebSocket.instances.push(this)
  }

  static reset(): void {
    MockWebSocket.instances.length = 0
    MockWebSocket.constructionError = null
  }

  open(): void {
    this.readyState = MockWebSocket.OPEN
    this.onopen?.(new Event('open'))
  }

  serverClose(code = 1000, reason = ''): void {
    this.readyState = MockWebSocket.CLOSED
    this.onclose?.({ code, reason })
  }

  serverError(error: Error | Event = new Error('socket error')): void {
    this.onerror?.(error)
  }

  receive(data: any): void {
    this.onmessage?.({ data })
  }
}

const transports: GrpcWebSocketTransport[] = []

function createTransport(
  overrides: Partial<WsTransportConfig> = {},
): GrpcWebSocketTransport {
  const transport = new GrpcWebSocketTransport({
    url: 'wss://ws.example/stream',
    connectionTimeoutMs: 1000,
    reconnect: {
      enabled: true,
      initialDelayMs: 50,
      maxAttempts: 3,
      maxDelayMs: 200,
      backoffMultiplier: 2,
    },
    ...overrides,
  })

  transports.push(transport)

  return transport
}

function captureDisconnects(transport: GrpcWebSocketTransport) {
  const events: Array<{
    reason: WsDisconnectReason
    willRetry: boolean
  }> = []

  transport.on('disconnect', (event) => {
    events.push(event)
  })

  return events
}

function latestSocket(): MockWebSocket {
  const socket = MockWebSocket.instances.at(-1)

  if (!socket) {
    throw new Error('Expected a mocked WebSocket instance')
  }

  return socket
}

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (error: Error) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

async function flushMicrotasks(): Promise<void> {
  await Promise.resolve()
  await Promise.resolve()
}

async function getRejection(promise: Promise<void>): Promise<unknown> {
  return promise.then(
    () => {
      throw new Error('Expected the connect promise to reject')
    },
    (error: unknown) => error,
  )
}

async function expectAbortRejection(promise: Promise<void>): Promise<void> {
  const error = await getRejection(promise)

  expect(isAbortError(error)).toBe(true)
}

beforeEach(() => {
  vi.useFakeTimers()
  MockWebSocket.reset()
  vi.stubGlobal('WebSocket', MockWebSocket as unknown as typeof WebSocket)
  vi.spyOn(console, 'error').mockImplementation(() => undefined)
})

afterEach(() => {
  transports.forEach((transport) => transport.destroy())
  transports.length = 0
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('GrpcWebSocketTransport cancellation and lifecycle', () => {
  it('rejects a pre-aborted signal without opening a socket', async () => {
    const transport = createTransport()
    const disconnects = captureDisconnects(transport)
    const controller = new AbortController()
    const reason = new Error('already stopped')

    controller.abort(reason)

    const error = await getRejection(
      transport.connect({ signal: controller.signal }),
    )

    expect(isAbortError(error)).toBe(true)
    expect((error as { reason?: unknown }).reason).toBe(reason)
    expect(MockWebSocket.instances).toHaveLength(0)
    expect(transport.getState()).toBe(WsState.Idle)
    expect(disconnects).toHaveLength(0)
  })

  it('joins duplicate connects onto one socket and one readiness promise', async () => {
    const transport = createTransport()
    const states: string[] = []

    transport.on('state_change', ({ to }) => {
      states.push(to)
    })

    const first = transport.connect()
    const second = transport.connect()
    const third = transport.connect()

    expect(transport.getState()).toBe(WsState.Connecting)
    expect(first).toBe(second)
    expect(second).toBe(third)
    expect(MockWebSocket.instances).toHaveLength(1)

    latestSocket().open()

    await expect(Promise.all([first, second, third])).resolves.toEqual([
      undefined,
      undefined,
      undefined,
    ])
    expect(transport.getState()).toBe(WsState.Connected)
    expect(states).toEqual([WsState.Connecting, WsState.Connected])
  })

  it('joins duplicate connects that use the same signal', async () => {
    const transport = createTransport()
    const controller = new AbortController()

    const first = transport.connect({ signal: controller.signal })
    const second = transport.connect({ signal: controller.signal })

    expect(first).toBe(second)
    expect(MockWebSocket.instances).toHaveLength(1)

    latestSocket().open()

    await expect(first).resolves.toBeUndefined()
    await expect(second).resolves.toBeUndefined()
  })

  it('rejects a conflicting signal while the first caller owns the lifetime', async () => {
    const transport = createTransport()
    const owner = new AbortController()
    const conflicting = new AbortController()
    const first = transport.connect({ signal: owner.signal })

    const error = await getRejection(
      transport.connect({ signal: conflicting.signal }),
    )

    expect(error).toBeInstanceOf(Error)
    expect((error as Error).message).toContain('different AbortSignal')
    expect(MockWebSocket.instances).toHaveLength(1)

    latestSocket().open()
    await expect(first).resolves.toBeUndefined()

    conflicting.abort()
    await flushMicrotasks()

    expect(transport.getState()).toBe(WsState.Connected)
  })

  it('rejects a signal added to an already active unsignaled lifetime', async () => {
    const transport = createTransport()
    const lateSignal = new AbortController()

    const first = transport.connect()
    const error = await getRejection(
      transport.connect({ signal: lateSignal.signal }),
    )

    expect((error as Error).message).toContain('different AbortSignal')

    latestSocket().open()
    await expect(first).resolves.toBeUndefined()
  })

  it('settles a pending connect when the socket closes before open and schedules one retry', async () => {
    const transport = createTransport()
    const disconnects = captureDisconnects(transport)
    const connectPromise = transport.connect()

    latestSocket().serverClose(1006, 'refused')

    await expect(connectPromise).rejects.toThrow('closed before open')
    expect(transport.getState()).toBe(WsState.Reconnecting)
    expect(disconnects).toEqual([
      {
        reason: WsDisconnectReason.ConnectionFailed,
        willRetry: true,
      },
    ])

    await vi.advanceTimersByTimeAsync(50)

    expect(MockWebSocket.instances).toHaveLength(2)

    latestSocket().open()

    expect(transport.getState()).toBe(WsState.Connected)
    expect(disconnects).toHaveLength(1)
  })

  it('settles a pending connect when the socket errors before open', async () => {
    const transport = createTransport()
    const disconnects = captureDisconnects(transport)
    const errors: Error[] = []

    transport.on('error', (error) => {
      errors.push(error)
    })

    const socketError = new Error('handshake failed')
    const connectPromise = transport.connect()
    const socket = latestSocket()

    socket.serverError(socketError)

    await expect(connectPromise).rejects.toBe(socketError)
    expect(errors).toEqual([socketError])
    expect(disconnects).toEqual([
      {
        reason: WsDisconnectReason.ConnectionFailed,
        willRetry: true,
      },
    ])
    expect(socket.close).toHaveBeenCalledTimes(1)
    expect(transport.getState()).toBe(WsState.Reconnecting)

    await vi.advanceTimersByTimeAsync(50)

    expect(MockWebSocket.instances).toHaveLength(2)
  })

  it('does not schedule a second reconnect when timeout and close race', async () => {
    const transport = createTransport({ connectionTimeoutMs: 100 })
    const disconnects = captureDisconnects(transport)
    const connectPromise = transport.connect()
    const socket = latestSocket()
    const lateClose = socket.onclose

    await vi.advanceTimersByTimeAsync(100)
    await expect(connectPromise).rejects.toThrow('Connection timeout')

    expect(disconnects).toEqual([
      {
        reason: WsDisconnectReason.ConnectionTimeout,
        willRetry: true,
      },
    ])

    lateClose?.({ code: 1006, reason: 'late close' })

    expect(disconnects).toHaveLength(1)

    await vi.advanceTimersByTimeAsync(50)

    expect(MockWebSocket.instances).toHaveLength(2)
    expect(disconnects).toHaveLength(1)
  })

  it('ignores the connection timeout after an early close', async () => {
    const transport = createTransport({ connectionTimeoutMs: 100 })
    const disconnects = captureDisconnects(transport)
    const connectPromise = transport.connect()

    latestSocket().serverClose(1006, 'refused')

    await expect(connectPromise).rejects.toThrow('closed before open')

    await vi.advanceTimersByTimeAsync(50)

    expect(MockWebSocket.instances).toHaveLength(2)

    await vi.advanceTimersByTimeAsync(50)

    expect(MockWebSocket.instances).toHaveLength(2)
    expect(disconnects).toHaveLength(1)
  })

  it('ends the lifecycle on timeout when reconnects are disabled', async () => {
    const transport = createTransport({
      connectionTimeoutMs: 100,
      reconnect: { enabled: false },
    })
    const disconnects = captureDisconnects(transport)
    const connectPromise = transport.connect()
    const socket = latestSocket()

    await vi.advanceTimersByTimeAsync(100)
    await expect(connectPromise).rejects.toThrow('Connection timeout')

    expect(socket.close).toHaveBeenCalledTimes(1)
    expect(transport.getState()).toBe(WsState.Disconnected)
    expect(disconnects).toEqual([
      {
        reason: WsDisconnectReason.ConnectionTimeout,
        willRetry: false,
      },
    ])
  })

  it('settles connect when the WebSocket constructor throws and can retry', async () => {
    const transport = createTransport()
    const disconnects = captureDisconnects(transport)

    MockWebSocket.constructionError = new Error('constructor failed')

    const connectPromise = transport.connect()

    await expect(connectPromise).rejects.toThrow('constructor failed')
    expect(MockWebSocket.instances).toHaveLength(0)
    expect(transport.getState()).toBe(WsState.Reconnecting)
    expect(disconnects).toEqual([
      {
        reason: WsDisconnectReason.ConnectionFailed,
        willRetry: true,
      },
    ])

    MockWebSocket.constructionError = null
    await vi.advanceTimersByTimeAsync(50)
    latestSocket().open()

    expect(transport.getState()).toBe(WsState.Connected)
  })

  it('aborts a pending connect promptly and does not reconnect', async () => {
    const transport = createTransport()
    const disconnects = captureDisconnects(transport)
    const errors: Error[] = []
    const controller = new AbortController()

    transport.on('error', (error) => {
      errors.push(error)
    })

    const connectPromise = transport.connect({ signal: controller.signal })
    const socket = latestSocket()

    controller.abort()

    await expectAbortRejection(connectPromise)
    expect(socket.close).toHaveBeenCalledTimes(1)
    expect(transport.getState()).toBe(WsState.Disconnected)
    expect(disconnects).toEqual([
      {
        reason: WsDisconnectReason.UserStopped,
        willRetry: false,
      },
    ])
    expect(errors).toHaveLength(0)

    await vi.advanceTimersByTimeAsync(1000)

    expect(MockWebSocket.instances).toHaveLength(1)
    expect(disconnects).toHaveLength(1)
  })

  it('settles a pending connect on manual disconnect and ignores later aborts', async () => {
    const transport = createTransport()
    const disconnects = captureDisconnects(transport)
    const controller = new AbortController()
    const connectPromise = transport.connect({ signal: controller.signal })
    const socket = latestSocket()

    transport.disconnect()

    await expectAbortRejection(connectPromise)
    expect(socket.close).toHaveBeenCalledTimes(1)
    expect(transport.getState()).toBe(WsState.Disconnected)
    expect(disconnects).toEqual([
      {
        reason: WsDisconnectReason.UserStopped,
        willRetry: false,
      },
    ])

    controller.abort()
    await flushMicrotasks()

    expect(disconnects).toHaveLength(1)

    const reconnectPromise = transport.connect()
    latestSocket().open()

    await expect(reconnectPromise).resolves.toBeUndefined()
    expect(MockWebSocket.instances).toHaveLength(2)
  })

  it('aborts during a reconnect, rejects the joined readiness and stays stopped', async () => {
    const transport = createTransport()
    const disconnects = captureDisconnects(transport)
    const controller = new AbortController()
    const connectPromise = transport.connect({ signal: controller.signal })
    const socket = latestSocket()

    socket.open()
    await expect(connectPromise).resolves.toBeUndefined()

    socket.serverClose(1006, 'network lost')

    expect(transport.getState()).toBe(WsState.Reconnecting)

    const joinedRetry = transport.connect({ signal: controller.signal })

    controller.abort()

    await expectAbortRejection(joinedRetry)
    expect(transport.getState()).toBe(WsState.Disconnected)
    expect(
      disconnects.filter(
        ({ reason }) => reason === WsDisconnectReason.UserStopped,
      ),
    ).toHaveLength(1)
    expect(disconnects.filter(({ willRetry }) => willRetry)).toHaveLength(1)

    await vi.advanceTimersByTimeAsync(1000)

    expect(MockWebSocket.instances).toHaveLength(1)

    const nextController = new AbortController()
    const nextConnect = transport.connect({
      signal: nextController.signal,
    })

    latestSocket().open()
    await expect(nextConnect).resolves.toBeUndefined()
    expect(MockWebSocket.instances).toHaveLength(2)
  })

  it('allows a duplicate connect to await a background retry after initial failure', async () => {
    const transport = createTransport()
    const initialConnect = transport.connect()

    latestSocket().serverClose(1006, 'refused')

    await expect(initialConnect).rejects.toThrow('closed before open')

    const joinedRetry = transport.connect()

    await vi.advanceTimersByTimeAsync(50)

    latestSocket().open()

    await expect(joinedRetry).resolves.toBeUndefined()
    expect(transport.getState()).toBe(WsState.Connected)
  })

  it('emits only one UserStopped disconnect for repeated manual disconnects', async () => {
    const transport = createTransport()
    const disconnects = captureDisconnects(transport)
    const connectPromise = transport.connect()

    latestSocket().open()
    await expect(connectPromise).resolves.toBeUndefined()

    transport.disconnect()
    transport.disconnect()
    await flushMicrotasks()

    expect(disconnects).toEqual([
      {
        reason: WsDisconnectReason.UserStopped,
        willRetry: false,
      },
    ])
    expect(transport.getState()).toBe(WsState.Disconnected)
  })

  it('does not emit a stale UserStopped disconnect after a Disconnected listener reconnects', async () => {
    const transport = createTransport()
    const disconnects = captureDisconnects(transport)
    const stateEvents: string[] = []
    let reconnectPromise: Promise<void> | null = null

    transport.on('state_change', ({ from, to }) => {
      stateEvents.push(`${from}->${to}`)

      if (to === WsState.Disconnected && !reconnectPromise) {
        reconnectPromise = transport.connect()
      }
    })

    const initialConnect = transport.connect()

    latestSocket().open()
    await expect(initialConnect).resolves.toBeUndefined()

    transport.disconnect()

    const pendingReconnect = reconnectPromise

    if (!pendingReconnect) {
      throw new Error('Expected the Disconnected listener to reconnect')
    }

    expect(MockWebSocket.instances).toHaveLength(2)
    expect(transport.getState()).toBe(WsState.Connecting)
    expect(disconnects).toHaveLength(0)
    expect(stateEvents).toEqual([
      `${WsState.Idle}->${WsState.Connecting}`,
      `${WsState.Connecting}->${WsState.Connected}`,
      `${WsState.Connected}->${WsState.Disconnected}`,
      `${WsState.Disconnected}->${WsState.Connecting}`,
    ])

    latestSocket().open()
    await expect(pendingReconnect).resolves.toBeUndefined()

    expect(transport.getState()).toBe(WsState.Connected)
    expect(disconnects).toHaveLength(0)
  })

  it('does not emit a stale terminal disconnect after a Disconnected listener reconnects', async () => {
    const transport = createTransport({ reconnect: { enabled: false } })
    const disconnects = captureDisconnects(transport)
    const stateEvents: string[] = []
    let reconnectPromise: Promise<void> | null = null

    transport.on('state_change', ({ from, to }) => {
      stateEvents.push(`${from}->${to}`)

      if (to === WsState.Disconnected && !reconnectPromise) {
        reconnectPromise = transport.connect()
      }
    })

    const initialConnect = transport.connect()

    latestSocket().open()
    await expect(initialConnect).resolves.toBeUndefined()

    latestSocket().serverClose(1000, 'server closed')

    const pendingReconnect = reconnectPromise

    if (!pendingReconnect) {
      throw new Error('Expected the Disconnected listener to reconnect')
    }

    expect(MockWebSocket.instances).toHaveLength(2)
    expect(transport.getState()).toBe(WsState.Connecting)
    expect(disconnects).toHaveLength(0)
    expect(stateEvents).toEqual([
      `${WsState.Idle}->${WsState.Connecting}`,
      `${WsState.Connecting}->${WsState.Connected}`,
      `${WsState.Connected}->${WsState.Disconnected}`,
      `${WsState.Disconnected}->${WsState.Connecting}`,
    ])

    latestSocket().open()
    await expect(pendingReconnect).resolves.toBeUndefined()

    expect(transport.getState()).toBe(WsState.Connected)
    expect(disconnects).toHaveLength(0)
  })

  it('settles a pending connect and becomes terminal on destroy', async () => {
    const transport = createTransport()
    const disconnects = captureDisconnects(transport)
    const connectPromise = transport.connect()

    transport.destroy()

    await expect(connectPromise).rejects.toThrow('Transport has been destroyed')
    expect(transport.getState()).toBe(WsState.Disconnected)
    expect(disconnects).toEqual([
      {
        reason: WsDisconnectReason.UserStopped,
        willRetry: false,
      },
    ])

    await expect(transport.connect()).rejects.toThrow(
      'Transport has been destroyed',
    )
    expect(MockWebSocket.instances).toHaveLength(1)
  })

  it('does not resolve readiness when a connect listener disconnects', async () => {
    const transport = createTransport()
    const disconnects = captureDisconnects(transport)
    const connectPromise = transport.connect()

    transport.on('connect', () => {
      transport.disconnect()
    })

    latestSocket().open()

    await expectAbortRejection(connectPromise)
    expect(transport.getState()).toBe(WsState.Disconnected)
    expect(disconnects).toEqual([
      {
        reason: WsDisconnectReason.UserStopped,
        willRetry: false,
      },
    ])
  })

  it('does not schedule a retry when a disconnect listener stops the transport', async () => {
    const transport = createTransport()
    const connectPromise = transport.connect()

    latestSocket().open()
    await expect(connectPromise).resolves.toBeUndefined()

    transport.on('disconnect', ({ willRetry }) => {
      if (willRetry) {
        transport.disconnect()
      }
    })

    latestSocket().serverClose(1006, 'network lost')

    expect(transport.getState()).toBe(WsState.Disconnected)

    await vi.advanceTimersByTimeAsync(1000)

    expect(MockWebSocket.instances).toHaveLength(1)
  })

  it('ignores late callbacks from a socket replaced by a new connection', async () => {
    const transport = createTransport()
    const firstConnect = transport.connect()
    const firstSocket = latestSocket()
    const staleOpen = firstSocket.onopen
    const staleClose = firstSocket.onclose
    const staleError = firstSocket.onerror
    const staleMessage = firstSocket.onmessage
    const errors: Error[] = []
    const messages: ArrayBuffer[] = []

    transport.on('error', (error) => errors.push(error))
    transport.on('message', (message) => messages.push(message))

    transport.disconnect()
    await expectAbortRejection(firstConnect)

    const secondConnect = transport.connect()
    const secondSocket = latestSocket()

    secondSocket.open()
    await expect(secondConnect).resolves.toBeUndefined()

    staleOpen?.(new Event('open'))
    staleClose?.({ code: 1000, reason: 'stale' })
    staleError?.(new Error('stale error'))
    staleMessage?.({ data: new ArrayBuffer(1) })
    await flushMicrotasks()

    expect(transport.getState()).toBe(WsState.Connected)
    expect(MockWebSocket.instances).toHaveLength(2)
    expect(errors).toHaveLength(0)
    expect(messages).toHaveLength(0)
  })

  it('drops late Blob resolution and rejection after disconnect', async () => {
    const transport = createTransport()
    const messages: ArrayBuffer[] = []
    const errors: Error[] = []
    const resolvedBlob = new Blob([new Uint8Array([1, 2, 3])])
    const rejectedBlob = new Blob([new Uint8Array([4, 5, 6])])
    const resolvedDecode = deferred<ArrayBuffer>()
    const rejectedDecode = deferred<ArrayBuffer>()

    vi.spyOn(resolvedBlob, 'arrayBuffer').mockReturnValue(
      resolvedDecode.promise,
    )
    vi.spyOn(rejectedBlob, 'arrayBuffer').mockReturnValue(
      rejectedDecode.promise,
    )

    transport.on('message', (message) => messages.push(message))
    transport.on('error', (error) => errors.push(error))

    const connectPromise = transport.connect()
    const socket = latestSocket()

    socket.open()
    await expect(connectPromise).resolves.toBeUndefined()

    socket.receive(resolvedBlob)
    socket.receive(rejectedBlob)

    transport.disconnect()

    resolvedDecode.resolve(new Uint8Array([7, 8, 9]).buffer)
    rejectedDecode.reject(new Error('late decode failure'))
    await flushMicrotasks()

    expect(messages).toHaveLength(0)
    expect(errors).toHaveLength(0)
  })

  it('decodes Blob frames for the current socket', async () => {
    const transport = createTransport()
    const messages: ArrayBuffer[] = []
    const blob = new Blob([new Uint8Array([1, 2, 3])])

    transport.on('message', (message) => messages.push(message))

    const connectPromise = transport.connect()

    latestSocket().open()
    await expect(connectPromise).resolves.toBeUndefined()

    latestSocket().receive(blob)
    await flushMicrotasks()

    expect(messages).toHaveLength(1)
    expect(Array.from(new Uint8Array(messages[0]))).toEqual([1, 2, 3])
  })
})

describe('RFQ streams propagate abort ownership to the transport', () => {
  type TestRfqStream = {
    connect(options?: { signal?: AbortSignal }): Promise<void>
    destroy(): void
    getState(): WsState
    on(
      event: 'disconnect',
      listener: (event: {
        reason: WsDisconnectReason
        willRetry: boolean
      }) => void,
    ): void
    on(
      event: 'state_change',
      listener: (event: { from: WsState; to: WsState }) => void,
    ): void
  }

  const streams: Array<{
    name: string
    create: () => TestRfqStream
  }> = [
    {
      name: 'maker',
      create: () =>
        new IndexerWsMakerStream({
          url: 'wss://rfq.example',
          makerAddress: 'inj1maker',
          pingIntervalMs: 100,
          connectionTimeoutMs: 1000,
          reconnect: {
            enabled: true,
            initialDelayMs: 50,
            maxAttempts: 3,
            maxDelayMs: 200,
            backoffMultiplier: 2,
          },
        }),
    },
    {
      name: 'taker',
      create: () =>
        new IndexerWsTakerStream({
          url: 'wss://rfq.example',
          requestAddress: 'inj1taker',
          pingIntervalMs: 100,
          connectionTimeoutMs: 1000,
          reconnect: {
            enabled: true,
            initialDelayMs: 50,
            maxAttempts: 3,
            maxDelayMs: 200,
            backoffMultiplier: 2,
          },
        }),
    },
  ]

  const activeStreams: TestRfqStream[] = []

  afterEach(() => {
    activeStreams.forEach((stream) => stream.destroy())
    activeStreams.length = 0
  })

  it.each(streams)(
    '$name rejects a pre-aborted connect without creating a socket',
    async ({ create }) => {
      const stream = create()

      activeStreams.push(stream)

      const controller = new AbortController()
      const disconnects: unknown[] = []

      stream.on('disconnect', (event) => disconnects.push(event))
      controller.abort()

      const error = await getRejection(
        stream.connect({ signal: controller.signal }),
      )

      expect(isAbortError(error)).toBe(true)
      expect(MockWebSocket.instances).toHaveLength(0)
      expect(disconnects).toHaveLength(0)
    },
  )

  it.each(streams)(
    '$name aborts the owned lifetime, clears heartbeats and allows an explicit reconnect',
    async ({ create }) => {
      const stream = create()

      activeStreams.push(stream)

      const disconnects: Array<{
        reason: WsDisconnectReason
        willRetry: boolean
      }> = []
      const controller = new AbortController()

      stream.on('disconnect', (event) => disconnects.push(event))

      const connectPromise = stream.connect({
        signal: controller.signal,
      })
      const socket = latestSocket()

      socket.open()
      await expect(connectPromise).resolves.toBeUndefined()

      await vi.advanceTimersByTimeAsync(100)

      expect(socket.sent.length).toBeGreaterThan(0)

      const sentBeforeAbort = socket.sent.length

      controller.abort()

      expect(stream.getState()).toBe(WsState.Disconnected)
      expect(disconnects).toEqual([
        {
          reason: WsDisconnectReason.UserStopped,
          willRetry: false,
        },
      ])

      await vi.advanceTimersByTimeAsync(500)

      expect(socket.sent).toHaveLength(sentBeforeAbort)
      expect(MockWebSocket.instances).toHaveLength(1)
      expect(disconnects).toHaveLength(1)

      const reconnectPromise = stream.connect()
      const nextSocket = latestSocket()

      nextSocket.open()
      await expect(reconnectPromise).resolves.toBeUndefined()
      expect(MockWebSocket.instances).toHaveLength(2)
      expect(stream.getState()).toBe(WsState.Connected)
    },
  )

  it.each(streams)(
    '$name clears the old heartbeat before a state listener starts another lifetime',
    async ({ create }) => {
      const stream = create()
      activeStreams.push(stream)
      const controller = new AbortController()
      const initial = stream.connect({ signal: controller.signal })
      latestSocket().open()
      await initial
      expect(vi.getTimerCount()).toBe(1)
      let replacement: Promise<void> | undefined
      stream.on('state_change', ({ to }) => {
        if (to === WsState.Disconnected && !replacement) {
          replacement = stream.connect()
        }
      })

      controller.abort()

      expect(stream.getState()).toBe(WsState.Connecting)
      // Only the replacement connection deadline remains, not the old heartbeat.
      expect(vi.getTimerCount()).toBe(1)
      latestSocket().open()
      await replacement
      expect(stream.getState()).toBe(WsState.Connected)
    },
  )
})
