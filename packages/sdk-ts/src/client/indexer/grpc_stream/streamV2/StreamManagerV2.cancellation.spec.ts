import { RpcError } from '@protobuf-ts/runtime-rpc'
import { StreamManagerV2 } from './StreamManagerV2.js'
import { createStreamSubscriptionV2 } from './streamHelpersV2.js'
import {
  StreamState,
  GrpcStatusCode,
  StreamDisconnectReason,
} from '../../../../types/index.js'
import type {
  StreamError,
  StreamSubscription,
} from '../../../../types/index.js'

type MockSubscription = StreamSubscription & {
  _cancelled: boolean
  _errorHandler?: (error: StreamError) => void
  _completeHandler?: () => void
  triggerCancel: () => void
}

const createMockSubscription = (): MockSubscription => {
  const cancelHandlers = new Set<() => void>()

  const subscription = {
    _cancelled: false,
    _errorHandler: undefined,
    _completeHandler: undefined,
    get cancelled() {
      return subscription._cancelled
    },
    unsubscribe: vi.fn(() => {
      subscription._cancelled = true
    }),
    on: vi.fn(
      (
        event: string,
        handler: ((error: StreamError) => void) | (() => void),
      ) => {
        if (event === 'error') {
          subscription._errorHandler = handler as (error: StreamError) => void
        }

        if (event === 'complete') {
          subscription._completeHandler = handler as () => void
        }
      },
    ),
    off: vi.fn(),
    onCancel: vi.fn((handler: () => void) => {
      cancelHandlers.add(handler)

      return () => {
        cancelHandlers.delete(handler)
      }
    }),
    triggerCancel: () => {
      subscription._cancelled = true
      Array.from(cancelHandlers).forEach((handler) => handler())
    },
  } as MockSubscription

  return subscription
}

describe('StreamManagerV2 cancellation', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('does not call the factory for a pre-aborted lifetime signal', () => {
    const controller = new AbortController()
    const streamFactory = vi.fn()
    const disconnectEvents: any[] = []

    controller.abort('pre-aborted')

    const manager = new StreamManagerV2({
      id: 'pre-aborted',
      streamFactory,
      onData: () => {},
      signal: controller.signal,
    })

    manager.on('disconnect', (event) => disconnectEvents.push(event))
    manager.start()

    expect(streamFactory).not.toHaveBeenCalled()
    expect(manager.getState()).toBe(StreamState.Stopped)
    expect(disconnectEvents[0]).toEqual({
      reason: StreamDisconnectReason.UserStopped,
      willRetry: false,
      attempt: 0,
    })

    manager.start()

    expect(streamFactory).not.toHaveBeenCalled()
  })

  it('does not overwrite Destroyed when a pre-abort disconnect listener destroys', () => {
    const controller = new AbortController()
    const streamFactory = vi.fn()

    controller.abort()

    const manager = new StreamManagerV2({
      id: 'pre-aborted-destroy',
      streamFactory,
      onData: () => {},
      signal: controller.signal,
    })

    manager.on('disconnect', () => manager.destroy())
    manager.start()

    expect(manager.getState()).toBe(StreamState.Destroyed)
    expect(streamFactory).not.toHaveBeenCalled()
  })

  it('aborts a running stream, clears work, and cannot restart', () => {
    const controller = new AbortController()
    const subscription = createMockSubscription()
    const streamFactory = vi.fn(() => subscription)
    const errorEvents: any[] = []

    const manager = new StreamManagerV2({
      id: 'abort-running',
      streamFactory,
      onData: () => {},
      signal: controller.signal,
      retryConfig: { initialDelayMs: 100, persistent: true },
    })

    manager.on('error', (event) => errorEvents.push(event))
    manager.start()

    expect(manager.getState()).toBe(StreamState.Connected)

    controller.abort('stop')
    vi.advanceTimersByTime(10_000)

    expect(manager.getState()).toBe(StreamState.Stopped)
    expect(subscription.unsubscribe).toHaveBeenCalledTimes(1)
    expect(streamFactory).toHaveBeenCalledTimes(1)
    expect(errorEvents).toHaveLength(0)

    manager.start()

    expect(streamFactory).toHaveBeenCalledTimes(1)
    expect(manager.getState()).toBe(StreamState.Stopped)
  })

  it('keeps manual stop restartable while the lifetime signal is live', () => {
    const controller = new AbortController()
    const subscriptions = [createMockSubscription(), createMockSubscription()]
    let subscriptionIndex = 0
    const streamFactory = vi.fn(() => subscriptions[subscriptionIndex++])

    const manager = new StreamManagerV2({
      id: 'manual-restart',
      streamFactory,
      onData: () => {},
      signal: controller.signal,
    })

    manager.start()
    manager.stop()

    expect(manager.getState()).toBe(StreamState.Stopped)
    expect(streamFactory).toHaveBeenCalledTimes(1)

    manager.start()

    expect(manager.getState()).toBe(StreamState.Connected)
    expect(streamFactory).toHaveBeenCalledTimes(2)

    controller.abort()
  })

  it('clears a pending retry when the lifetime signal aborts', () => {
    const controller = new AbortController()
    const streamFactory = vi.fn(() => {
      throw new Error('connection failed')
    })

    const manager = new StreamManagerV2({
      id: 'abort-retry',
      streamFactory,
      onData: () => {},
      signal: controller.signal,
      retryConfig: {
        enabled: true,
        maxAttempts: 3,
        initialDelayMs: 100,
        persistent: true,
      },
    })

    manager.start()

    expect(manager.getState()).toBe(StreamState.Reconnecting)

    controller.abort('stop')
    vi.advanceTimersByTime(10_000)

    expect(manager.getState()).toBe(StreamState.Stopped)
    expect(streamFactory).toHaveBeenCalledTimes(1)

    manager.start()

    expect(streamFactory).toHaveBeenCalledTimes(1)
  })

  it('stops without retrying when the subscription cancels independently', () => {
    const subscription = createMockSubscription()
    const streamFactory = vi.fn(() => subscription)
    const disconnectEvents: any[] = []

    const manager = new StreamManagerV2({
      id: 'independent-cancel',
      streamFactory,
      onData: () => {},
      retryConfig: { initialDelayMs: 100, persistent: true },
    })

    manager.on('disconnect', (event) => disconnectEvents.push(event))
    manager.start()

    subscription.triggerCancel()
    vi.advanceTimersByTime(10_000)

    expect(manager.getState()).toBe(StreamState.Stopped)
    expect(streamFactory).toHaveBeenCalledTimes(1)
    expect(disconnectEvents.at(-1)).toEqual({
      reason: StreamDisconnectReason.UserStopped,
      willRetry: false,
      attempt: 0,
    })
  })

  it('blocks a reentrant stop/start from unsubscribe during destroy', () => {
    const subscription = createMockSubscription()
    const streamFactory = vi.fn(() => subscription)
    const restartError = vi.fn()
    let manager: StreamManagerV2<unknown>

    subscription.unsubscribe = vi.fn(() => {
      manager.stop()

      try {
        manager.start()
      } catch (error) {
        restartError(error)
      }
    })

    manager = new StreamManagerV2({
      id: 'destroy-reentrant-unsubscribe',
      streamFactory,
      onData: () => {},
    })

    manager.start()
    manager.destroy()

    expect(streamFactory).toHaveBeenCalledTimes(1)
    expect(subscription.unsubscribe).toHaveBeenCalledTimes(1)
    expect(restartError).toHaveBeenCalledTimes(1)
    expect(manager.getState()).toBe(StreamState.Destroyed)
  })

  it('blocks a reentrant start from a destroy state listener', () => {
    const subscription = createMockSubscription()
    const streamFactory = vi.fn(() => subscription)
    const restartError = vi.fn()
    let manager: StreamManagerV2<unknown>

    manager = new StreamManagerV2({
      id: 'destroy-reentrant-state-listener',
      streamFactory,
      onData: () => {},
    })

    manager.on('state:change', ({ to }) => {
      if (to !== StreamState.Destroyed) {
        return
      }

      try {
        manager.start()
      } catch (error) {
        restartError(error)
      }
    })

    manager.start()
    manager.destroy()

    expect(streamFactory).toHaveBeenCalledTimes(1)
    expect(subscription.unsubscribe).toHaveBeenCalledTimes(1)
    expect(restartError).toHaveBeenCalledTimes(1)
    expect(manager.getState()).toBe(StreamState.Destroyed)
  })

  it('does not clear a reentrant new generation retry timer during old cleanup', () => {
    const subscriptions = [
      createMockSubscription(),
      createMockSubscription(),
      createMockSubscription(),
    ]
    let subscriptionIndex = 0
    const streamFactory = vi.fn(
      () => subscriptions[subscriptionIndex++] as MockSubscription,
    )
    let manager: StreamManagerV2<unknown>

    subscriptions[0].unsubscribe = vi.fn(() => {
      manager.stop()
      manager.start()
      subscriptions[1]._errorHandler?.({
        code: GrpcStatusCode.UNAVAILABLE,
        details: 'new generation failed',
      })
    })

    manager = new StreamManagerV2({
      id: 'old-cleanup-timer',
      streamFactory,
      onData: () => {},
      retryConfig: {
        enabled: true,
        maxAttempts: 3,
        initialDelayMs: 100,
        persistent: true,
      },
    })

    manager.start()
    manager.stop()

    expect(streamFactory).toHaveBeenCalledTimes(2)
    expect(manager.getState()).toBe(StreamState.Reconnecting)

    vi.advanceTimersByTime(100)

    expect(streamFactory).toHaveBeenCalledTimes(3)
    expect(manager.getState()).toBe(StreamState.Connected)
  })

  it('notices a subscription that is already cancelled through its snapshot', () => {
    const subscription = createMockSubscription()
    subscription._cancelled = true

    const manager = new StreamManagerV2({
      id: 'cancelled-snapshot',
      streamFactory: () => subscription,
      onData: () => {},
    })

    manager.start()

    expect(manager.getState()).toBe(StreamState.Stopped)
    expect(subscription.unsubscribe).toHaveBeenCalledTimes(1)
  })

  it('does not stay connected when the stream helper factory throws synchronously', () => {
    const errorEvents: any[] = []

    const manager = new StreamManagerV2({
      id: 'sync-factory-error',
      streamFactory: () =>
        createStreamSubscriptionV2(
          () => {
            throw new Error('factory failed')
          },
          () => {},
        ),
      onData: () => {},
      retryConfig: { enabled: false },
    })

    manager.on('error', (event) => errorEvents.push(event))
    manager.start()

    expect(manager.getState()).toBe(StreamState.Stopped)
    expect(errorEvents).toHaveLength(1)
    expect(errorEvents[0].message).toBe('factory failed')
  })

  it('observes independent cancellation from the real stream helper', () => {
    const controller = new AbortController()
    let transportSignal: AbortSignal | undefined
    const disconnectEvents: any[] = []

    const manager = new StreamManagerV2({
      id: 'real-helper-cancel',
      streamFactory: () =>
        createStreamSubscriptionV2(
          (signal) => {
            transportSignal = signal

            return {
              responses: (async function* idleStream() {
                await new Promise<void>((resolve) => {
                  if (signal.aborted) {
                    resolve()

                    return
                  }

                  signal.addEventListener('abort', () => resolve(), {
                    once: true,
                  })
                })
              })(),
            }
          },
          () => {},
          { signal: controller.signal },
        ),
      onData: () => {},
      retryConfig: { initialDelayMs: 100, persistent: true },
    })

    manager.on('disconnect', (event) => disconnectEvents.push(event))
    manager.start()

    expect(manager.getState()).toBe(StreamState.Connected)

    controller.abort('transport-cancelled')

    expect(transportSignal?.aborted).toBe(true)
    expect(manager.getState()).toBe(StreamState.Stopped)
    expect(disconnectEvents.at(-1)?.reason).toBe(
      StreamDisconnectReason.UserStopped,
    )
    expect(disconnectEvents.at(-1)?.willRetry).toBe(false)

    vi.advanceTimersByTime(10_000)

    expect(manager.getState()).toBe(StreamState.Stopped)
  })

  it('delivers initial synchronous factory data before the stream is marked connected', () => {
    const subscription = createMockSubscription()
    const onData = vi.fn()
    const initialData = { price: '100' }
    let manager: StreamManagerV2<{ price: string }>

    manager = new StreamManagerV2({
      id: 'sync-factory-data',
      streamFactory: () => {
        manager.emit('data', initialData)

        return subscription
      },
      onData,
    })

    manager.start()

    expect(onData).toHaveBeenCalledWith(initialData)
    expect(manager.getState()).toBe(StreamState.Connected)
  })

  it('does not invoke the user data callback after stop', () => {
    const subscription = createMockSubscription()
    const onData = vi.fn()

    const manager = new StreamManagerV2({
      id: 'stale-data-stop',
      streamFactory: () => subscription,
      onData,
    })

    manager.start()
    manager.stop()
    manager.emit('data', { stale: true })

    expect(onData).not.toHaveBeenCalled()
  })

  it('does not invoke the user data callback after lifetime abort', () => {
    const controller = new AbortController()
    const subscription = createMockSubscription()
    const onData = vi.fn()

    const manager = new StreamManagerV2({
      id: 'stale-data-abort',
      streamFactory: () => subscription,
      onData,
      signal: controller.signal,
    })

    manager.start()
    controller.abort()
    manager.emit('data', { stale: true })

    expect(onData).not.toHaveBeenCalled()
  })

  it('aborts during the connecting state change before the factory runs', () => {
    const controller = new AbortController()
    const streamFactory = vi.fn()

    const manager = new StreamManagerV2({
      id: 'abort-connecting',
      streamFactory,
      onData: () => {},
      signal: controller.signal,
    })

    manager.on('state:change', ({ to }) => {
      if (to === StreamState.Connecting) {
        controller.abort()
      }
    })

    manager.start()

    expect(streamFactory).not.toHaveBeenCalled()
    expect(manager.getState()).toBe(StreamState.Stopped)
  })

  it('aborts during the retry event and does not start another attempt', () => {
    const controller = new AbortController()
    const streamFactory = vi.fn(() => {
      throw new Error('connection failed')
    })

    const manager = new StreamManagerV2({
      id: 'abort-retry-event',
      streamFactory,
      onData: () => {},
      signal: controller.signal,
      retryConfig: {
        enabled: true,
        maxAttempts: 3,
        initialDelayMs: 100,
        persistent: true,
      },
    })

    manager.on('retry', () => controller.abort())
    manager.start()

    vi.advanceTimersByTime(100)
    vi.advanceTimersByTime(10_000)

    expect(manager.getState()).toBe(StreamState.Stopped)
    expect(streamFactory).toHaveBeenCalledTimes(1)
  })

  it('aborts during the disconnect event and does not schedule retry work', () => {
    const controller = new AbortController()
    const subscription = createMockSubscription()
    const streamFactory = vi.fn(() => subscription)
    const disconnectEvents: any[] = []

    const manager = new StreamManagerV2({
      id: 'abort-disconnect-event',
      streamFactory,
      onData: () => {},
      signal: controller.signal,
      retryConfig: { initialDelayMs: 100, persistent: true },
    })

    manager.on('disconnect', (event) => {
      disconnectEvents.push(event)

      if (event.reason !== StreamDisconnectReason.UserStopped) {
        controller.abort()
      }
    })

    manager.start()
    subscription._errorHandler?.({
      code: GrpcStatusCode.UNAVAILABLE,
      details: 'connection lost',
    })
    vi.advanceTimersByTime(10_000)

    expect(manager.getState()).toBe(StreamState.Stopped)
    expect(streamFactory).toHaveBeenCalledTimes(1)
    expect(disconnectEvents.map((event) => event.reason)).toEqual([
      StreamDisconnectReason.NetworkError,
      StreamDisconnectReason.UserStopped,
    ])
  })

  it('aborts during the factory and unsubscribes the late subscription', () => {
    const controller = new AbortController()
    const subscription = createMockSubscription()
    const streamFactory = vi.fn(() => {
      controller.abort()

      return subscription
    })

    const manager = new StreamManagerV2({
      id: 'abort-factory',
      streamFactory,
      onData: () => {},
      signal: controller.signal,
    })

    manager.start()

    expect(manager.getState()).toBe(StreamState.Stopped)
    expect(streamFactory).toHaveBeenCalledTimes(1)
    expect(subscription.unsubscribe).toHaveBeenCalledTimes(1)
    expect(subscription.on).not.toHaveBeenCalled()
  })

  it('preserves string codes from custom subscriptions without changing retry classification', () => {
    const subscription = createMockSubscription()
    const disconnectEvents: any[] = []

    const manager = new StreamManagerV2({
      id: 'string-code',
      streamFactory: () => subscription,
      onData: () => {},
      retryConfig: { initialDelayMs: 100, persistent: true },
    })

    manager.on('disconnect', (event) => disconnectEvents.push(event))
    manager.start()

    subscription._errorHandler?.({
      code: 'UNAVAILABLE',
      details: 'connection lost',
    } as unknown as StreamError)

    expect(disconnectEvents[0].reason).toBe(StreamDisconnectReason.StreamError)
    expect(disconnectEvents[0].willRetry).toBe(true)

    manager.stop()
  })

  it.each(['subscription', 'onData'])(
    'retries an unrelated abort-shaped error from %s',
    (source) => {
      const subscription = createMockSubscription()
      const errorEvents: any[] = []
      const error = Object.assign(
        new Error('another operation was cancelled'),
        {
          name: 'AbortError',
          code: 'ERR_CANCELED',
        },
      )
      const controller = new AbortController()
      const streamFactory = vi
        .fn(() => createMockSubscription())
        .mockReturnValueOnce(subscription)

      const manager = new StreamManagerV2({
        id: 'abort-shaped-error',
        streamFactory,
        signal: controller.signal,
        onData: () => {
          throw error
        },
        retryConfig: { initialDelayMs: 100 },
      })

      manager.on('error', (event) => errorEvents.push(event))
      manager.start()

      if (source === 'subscription') {
        subscription._errorHandler?.(error as unknown as StreamError)
      } else {
        manager.emit('data', 1)
      }

      expect(controller.signal.aborted).toBe(false)
      expect(manager.getState()).toBe(StreamState.Reconnecting)
      expect(errorEvents).toHaveLength(1)
      expect(subscription.unsubscribe).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(100)

      expect(streamFactory).toHaveBeenCalledTimes(2)
      expect(manager.getState()).toBe(StreamState.Connected)
      manager.destroy()
    },
  )

  it.each([
    'UNAUTHENTICATED',
    'PERMISSION_DENIED',
    'INVALID_ARGUMENT',
    'NOT_FOUND',
    'ALREADY_EXISTS',
    'OUT_OF_RANGE',
    'UNIMPLEMENTED',
    'FAILED_PRECONDITION',
    'UNAVAILABLE',
    '5',
  ])(
    'keeps protobuf-ts %s retryable with the legacy error code',
    async (code) => {
      const error = new RpcError('temporary backend response', code)
      const errors: any[] = []
      const disconnects: any[] = []
      const streamFactory = vi.fn(() =>
        createStreamSubscriptionV2(
          () => ({
            responses: (async function* stream() {
              throw error
            })(),
          }),
          () => {},
        ),
      )
      const manager = new StreamManagerV2({
        id: code,
        streamFactory,
        onData: () => {},
        retryConfig: { initialDelayMs: 100, persistent: false },
      })
      manager.on('error', (event) => errors.push(event))
      manager.on('disconnect', (event) => disconnects.push(event))

      manager.start()
      await vi.advanceTimersByTimeAsync(0)

      expect(errors).toHaveLength(1)
      expect(errors[0]).toMatchObject({
        code: GrpcStatusCode.UNKNOWN,
        message: error.message,
        details: { metadata: { originalError: error } },
      })
      expect(disconnects[0]).toMatchObject({
        reason: StreamDisconnectReason.StreamError,
        willRetry: true,
      })
      expect(manager.getState()).toBe(StreamState.Reconnecting)

      await vi.advanceTimersByTimeAsync(100)

      expect(streamFactory).toHaveBeenCalledTimes(2)
      manager.destroy()
    },
  )
})
