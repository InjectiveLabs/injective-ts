import { closeWebSocketSafely } from './websocket.js'

describe('closeWebSocketSafely', () => {
  const createSocket = (readyState = 0) => {
    const socket = new EventTarget() as EventTarget & {
      readyState: number
      close: ReturnType<typeof vi.fn>
    }
    socket.readyState = readyState
    socket.close = vi.fn(() => {
      socket.readyState = 2
    })

    return socket
  }

  it('keeps shutdown error handling until an asynchronous close', () => {
    const socket = createSocket()
    const add = vi.spyOn(socket, 'addEventListener')
    const remove = vi.spyOn(socket, 'removeEventListener')

    closeWebSocketSafely(socket as unknown as WebSocket)

    expect(socket.close).toHaveBeenCalledOnce()
    expect(add.mock.calls.map(([event]) => event)).toEqual(['error', 'close'])
    expect(remove).not.toHaveBeenCalled()
    socket.dispatchEvent(new Event('error'))
    socket.readyState = 3
    socket.dispatchEvent(new Event('close'))
    expect(remove.mock.calls.map(([event]) => event)).toEqual([
      'error',
      'close',
    ])
  })

  it('observes an already-closing socket without closing it again', () => {
    const socket = createSocket(2)
    const remove = vi.spyOn(socket, 'removeEventListener')

    closeWebSocketSafely(socket as unknown as WebSocket)

    expect(socket.close).not.toHaveBeenCalled()
    socket.dispatchEvent(new Event('error'))
    socket.readyState = 3
    socket.dispatchEvent(new Event('close'))
    expect(remove).toHaveBeenCalledTimes(2)
  })

  it('does not attach handlers to an already-closed socket', () => {
    const socket = createSocket(3)
    const add = vi.spyOn(socket, 'addEventListener')

    closeWebSocketSafely(socket as unknown as WebSocket)

    expect(socket.close).not.toHaveBeenCalled()
    expect(add).not.toHaveBeenCalled()
  })

  it('cleans up handlers when close completes synchronously', () => {
    const socket = createSocket(1)
    socket.close.mockImplementation(() => {
      socket.readyState = 3
    })
    const remove = vi.spyOn(socket, 'removeEventListener')

    closeWebSocketSafely(socket as unknown as WebSocket)

    expect(remove).toHaveBeenCalledTimes(2)
  })

  it('keeps errors observed when a custom close throws before eventual shutdown', () => {
    const socket = createSocket()
    socket.close.mockImplementation(() => {
      throw new Error('close failed')
    })
    const remove = vi.spyOn(socket, 'removeEventListener')

    expect(() =>
      closeWebSocketSafely(socket as unknown as WebSocket),
    ).not.toThrow()
    expect(remove).not.toHaveBeenCalled()
    socket.dispatchEvent(new Event('error'))
    socket.readyState = 3
    socket.dispatchEvent(new Event('close'))
    expect(remove).toHaveBeenCalledTimes(2)
  })

  it('supports property-only sockets and releases the temporary handlers', () => {
    const socket = {
      readyState: 0,
      onerror: null as WebSocket['onerror'],
      onclose: null as WebSocket['onclose'],
      close: vi.fn(() => {
        socket.readyState = 2
      }),
    }

    closeWebSocketSafely(socket as unknown as WebSocket)

    expect(socket.onerror).toBeTypeOf('function')
    expect(socket.onclose).toBeTypeOf('function')
    socket.readyState = 3
    socket.onclose!.call(
      socket as unknown as WebSocket,
      new Event('close') as CloseEvent,
    )
    expect(socket.onerror).toBeNull()
    expect(socket.onclose).toBeNull()
  })
})
