import { createStreamSubscription } from './streamHelpers.js'
import type { StreamStatusResponse } from '../../types/index.js'

const flush = async (ms = 10) => {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

describe('createStreamSubscription cancellation', () => {
  it('passes the factory an abort signal and aborts it on unsubscribe', () => {
    let receivedSignal: AbortSignal | undefined

    const subscription = createStreamSubscription(
      (signal) => {
        receivedSignal = signal

        return {
          responses: (async function* emptyStream() {})(),
        }
      },
      () => {},
    )

    expect(receivedSignal).toBeDefined()
    expect(receivedSignal?.aborted).toBe(false)

    subscription.unsubscribe()
    subscription.unsubscribe()

    expect(receivedSignal?.aborted).toBe(true)
    expect(subscription.cancelled).toBe(true)
  })

  it('returns an inert cancelled subscription for a pre-aborted signal without calling the factory', () => {
    const controller = new AbortController()
    const factory = vi.fn()
    controller.abort('pre-aborted')

    const onCancel = vi.fn()
    const subscription = createStreamSubscription(
      factory,
      () => {},
      undefined,
      undefined,
      { signal: controller.signal },
    )
    subscription.onCancel?.(onCancel)

    expect(factory).not.toHaveBeenCalled()
    expect(subscription.cancelled).toBe(true)
    expect(subscription.closed).toBe(true)
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(() => subscription.unsubscribe()).not.toThrow()
  })

  it('rethrows genuine synchronous factory errors', () => {
    expect(() =>
      createStreamSubscription(
        () => {
          throw new Error('factory failed')
        },
        () => {},
      ),
    ).toThrow('factory failed')
  })

  it('stays silent when a factory aborts and then throws', () => {
    const controller = new AbortController()

    const subscription = createStreamSubscription(
      () => {
        controller.abort('factory aborted')

        throw new Error('aborted factory failure')
      },
      () => {},
      undefined,
      undefined,
      { signal: controller.signal },
    )

    expect(subscription.cancelled).toBe(true)
    expect(subscription.closed).toBe(true)
  })

  it('keeps the legacy object overload working', async () => {
    const responses = [{ value: 1 }, { value: 2 }]
    const received: number[] = []
    const onEnd = vi.fn()

    const subscription = createStreamSubscription(
      {
        responses: (async function* stream() {
          for (const response of responses) {
            yield response
          }
        })(),
      },
      (response) => received.push(response.value),
      onEnd,
    )

    await flush()

    expect(received).toEqual([1, 2])
    expect(onEnd).toHaveBeenCalledTimes(1)
    expect(subscription.cancelled).toBe(false)
  })

  it('aborts an idle stream through an external signal without terminal callbacks', async () => {
    const controller = new AbortController()
    const onData = vi.fn()
    const onEnd = vi.fn()
    const onStatus = vi.fn()
    const onCancel = vi.fn()

    const subscription = createStreamSubscription(
      (signal) => ({
        responses: (async function* idleStream() {
          await new Promise<void>((resolve) => {
            if (signal.aborted) {
              resolve()

              return
            }

            signal.addEventListener('abort', () => resolve(), { once: true })
          })
        })(),
      }),
      onData,
      onEnd,
      onStatus,
      { signal: controller.signal },
    )

    subscription.onCancel?.(onCancel)
    controller.abort('stop')
    await flush()

    expect(onData).not.toHaveBeenCalled()
    expect(onEnd).not.toHaveBeenCalled()
    expect(onStatus).not.toHaveBeenCalled()
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(subscription.cancelled).toBe(true)
    expect(subscription.closed).toBe(true)
  })

  it('cleans up and aborts the transport after normal completion', async () => {
    let transportSignal: AbortSignal | undefined
    const onEnd = vi.fn()

    const subscription = createStreamSubscription(
      (signal) => {
        transportSignal = signal

        return {
          responses: (async function* stream() {
            yield 1
          })(),
        }
      },
      () => {},
      onEnd,
    )

    await flush()

    expect(onEnd).toHaveBeenCalledTimes(1)
    expect(transportSignal?.aborted).toBe(true)
    expect(subscription.cancelled).toBe(false)
  })

  it.each(['UNAVAILABLE', 14])(
    'preserves the legacy status payload for code %s',
    async (code) => {
      const statuses: StreamStatusResponse[] = []
      const onEnd = vi.fn()
      const error = Object.assign(new Error('backend unavailable'), { code })

      const subscription = createStreamSubscription(
        () => ({
          responses: (async function* failingStream() {
            throw error
          })(),
        }),
        () => {},
        onEnd,
        (status) => statuses.push(status),
      )

      await flush()

      expect(onEnd).not.toHaveBeenCalled()
      expect(statuses).toHaveLength(1)
      expect(statuses[0].code).toBe(2)
      expect(statuses[0].details).toBe('backend unavailable')
      expect(statuses[0].metadata).toBe(error)
      expect(statuses[0].metadata.message).toBe('backend unavailable')
      expect(subscription.cancelled).toBe(false)
    },
  )

  it.each([
    ['callback', { name: 'AbortError' }],
    ['callback', { code: 'ERR_CANCELED' }],
    ['transport', { name: 'AbortError' }],
    ['transport', { code: 'ERR_CANCELED' }],
  ])('reports an unrelated cancellation from the %s', async (source, shape) => {
    const error = Object.assign(
      new Error('another operation was cancelled'),
      shape,
    )
    const onStatus = vi.fn()
    const onCancel = vi.fn()
    let transportSignal: AbortSignal | undefined
    const subscription = createStreamSubscription(
      (signal) => {
        transportSignal = signal

        return {
          responses: (async function* stream() {
            expect(signal.aborted).toBe(false)

            if (source === 'transport') {
              throw error
            }

            yield 1
          })(),
        }
      },
      () => {
        expect(transportSignal?.aborted).toBe(false)
        throw error
      },
      undefined,
      onStatus,
    )
    subscription.onCancel?.(onCancel)

    await flush()

    expect(onStatus).toHaveBeenCalledExactlyOnceWith({
      code: 2,
      details: error.message,
      metadata: error,
    })
    expect(onCancel).not.toHaveBeenCalled()
    expect(subscription.cancelled).toBe(false)
    expect(transportSignal?.aborted).toBe(true)
  })

  it('cleans up and cancels the transport when the data callback throws', async () => {
    const onEnd = vi.fn()
    const onStatus = vi.fn()

    const subscription = createStreamSubscription(
      (signal) => ({
        responses: (async function* stream() {
          yield 1
          await new Promise<void>((resolve) => {
            signal.addEventListener('abort', () => resolve(), { once: true })
          })
          yield 2
        })(),
      }),
      () => {
        throw new Error('callback failed')
      },
      onEnd,
      onStatus,
    )

    await flush()

    expect(onEnd).not.toHaveBeenCalled()
    expect(onStatus).toHaveBeenCalledTimes(1)
    expect(onStatus.mock.calls[0][0].details).toBe('callback failed')
    expect(subscription.closed).toBe(true)
  })
})
