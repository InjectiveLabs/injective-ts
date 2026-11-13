import { createServer } from 'node:http'
import { createRequire } from 'node:module'
import { isAbortError } from '@injectivelabs/utils'
import { closeWebSocketSafely } from '../utils/websocket.js'
import { WsState, WsDisconnectReason } from './indexer/types/ws.js'
import { GrpcWebSocketTransport } from './indexer/ws/GrpcWebSocketTransport.js'
import { subscribeToTendermintTxEvent } from '../core/tx/api/TxEventInclusion.js'
import type { Duplex } from 'node:stream'
import type { AddressInfo } from 'node:net'

type NodeSocket = WebSocket & { listenerCount(event: string): number }

// Exercise the already-installed Node polyfill rather than a mock. Its error
// emitted when closing a handshake is what previously terminated Node.
const NodeWebSocket = createRequire(import.meta.url)('ws') as new (
  url: string,
  protocol?: string,
) => NodeSocket

const cleanup: (() => void | Promise<void>)[] = []

afterEach(async () => {
  for (const dispose of cleanup.splice(0).reverse()) {
    await dispose()
  }
  vi.unstubAllGlobals()
})

async function holdHandshake() {
  const sockets = new Set<Duplex>()
  let resolveUpgrade!: () => void
  const upgraded = new Promise<void>((resolve) => {
    resolveUpgrade = resolve
  })
  const server = createServer()
  server.on('upgrade', (_request, socket) => {
    sockets.add(socket)
    socket.once('close', () => sockets.delete(socket))
    socket.resume()
    resolveUpgrade()
    // Intentionally leave the client waiting for the upgrade response.
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  cleanup.push(async () => {
    sockets.forEach((socket) => socket.destroy())
    server.closeAllConnections()
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    )
  })

  return {
    endpoint: `ws://127.0.0.1:${(server.address() as AddressInfo).port}`,
    upgraded,
  }
}

const expectNoShutdownListeners = (socket: NodeSocket) => {
  for (const event of ['error', 'close', 'open', 'message']) {
    expect(socket.listenerCount(event), `${event} listener cleanup`).toBe(0)
  }
}

describe('real ws handshake shutdown', () => {
  it.each(['abort', 'disconnect', 'destroy'] as const)(
    'RFQ %s handles asynchronous handshake errors and releases shutdown listeners',
    async (action) => {
      const server = await holdHandshake()
      let socket!: NodeSocket
      let resolveClose!: () => void
      const closed = new Promise<void>((resolve) => {
        resolveClose = resolve
      })
      class RecordingWebSocket extends NodeWebSocket {
        constructor(url: string, protocol?: string) {
          super(url, protocol)
          socket = this
          this.addEventListener('close', () => resolveClose(), { once: true })
        }
      }
      vi.stubGlobal('WebSocket', RecordingWebSocket)
      const controller = new AbortController()
      const transport = new GrpcWebSocketTransport({
        url: server.endpoint,
        connectionTimeoutMs: 5000,
        reconnect: { enabled: true, initialDelayMs: 10 },
      })
      cleanup.push(() => transport.destroy())
      const onError = vi.fn()
      const onDisconnect = vi.fn()
      transport.on('error', onError)
      transport.on('disconnect', onDisconnect)
      const pending = transport.connect({ signal: controller.signal })
      const rejected =
        action === 'destroy'
          ? expect(pending).rejects.toThrow('Transport has been destroyed')
          : expect(pending).rejects.toSatisfy(isAbortError)
      await server.upgraded
      expect(socket.readyState).toBe(0)

      if (action === 'abort') {
        controller.abort('handshake cancelled')
      } else {
        transport[action]()
      }

      await rejected
      await closed
      expect(transport.getState()).toBe(WsState.Disconnected)
      expect(onError).not.toHaveBeenCalled()
      expect(onDisconnect).toHaveBeenCalledExactlyOnceWith({
        reason: WsDisconnectReason.UserStopped,
        willRetry: false,
      })
      expectNoShutdownListeners(socket)
    },
  )

  it('Tendermint abort observes the late ws error without emitting application errors', async () => {
    const server = await holdHandshake()
    const controller = new AbortController()
    let socket!: NodeSocket
    let resolveClose!: () => void
    const closed = new Promise<void>((resolve) => {
      resolveClose = resolve
    })
    const pending = subscribeToTendermintTxEvent({
      endpoint: server.endpoint,
      txHash: 'A'.repeat(64),
      timeout: 5000,
      signal: controller.signal,
      webSocketFactory: (url) => {
        socket = new NodeWebSocket(url)
        socket.addEventListener('close', () => resolveClose(), { once: true })
        return socket
      },
    })
    const rejected = expect(pending).rejects.toMatchObject({
      name: 'AbortError',
      reason: 'handshake cancelled',
    })
    await server.upgraded

    controller.abort('handshake cancelled')

    await rejected
    await closed
    expectNoShutdownListeners(socket)
  })

  it('keeps a real already-closing socket error observed until its close event', async () => {
    const server = await holdHandshake()
    const socket = new NodeWebSocket(server.endpoint)
    const closed = new Promise<void>((resolve) =>
      socket.addEventListener('close', () => resolve(), { once: true }),
    )
    await server.upgraded

    socket.close()
    expect(socket.readyState).toBe(2)
    closeWebSocketSafely(socket)

    await closed
    expectNoShutdownListeners(socket)
  })
})
