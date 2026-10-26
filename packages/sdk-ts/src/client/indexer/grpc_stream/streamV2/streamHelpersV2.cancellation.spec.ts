import { createStreamSubscriptionV2 } from './streamHelpersV2.js'
import type { StreamError } from '../../../../types/index.js'

const flush = async (ms = 10) => {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

describe('createStreamSubscriptionV2 cancellation', () => {
  it('passes an abort signal to the factory and aborts it on unsubscribe', () => {
    let receivedSignal: AbortSignal | undefined

    const subscription = createStreamSubscriptionV2(
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

  it('does not call the factory for a pre-aborted signal', () => {
    const controller = new AbortController()
    const factory = vi.fn()
    const onCancel = vi.fn()
    controller.abort('pre-aborted')

    const subscription = createStreamSubscriptionV2(factory, () => {}, {
      signal: controller.signal,
    })
    subscription.onCancel?.(onCancel)

    expect(factory).not.toHaveBeenCalled()
    expect(subscription.cancelled).toBe(true)
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(() => subscription.unsubscribe()).not.toThrow()
  })

  it('rethrows genuine synchronous factory errors', () => {
    expect(() =>
      createStreamSubscriptionV2(
        () => {
          throw new Error('factory failed')
        },
        () => {},
      ),
    ).toThrow('factory failed')
  })

  it('stays silent when a factory aborts and then throws', () => {
    const controller = new AbortController()

    const subscription = createStreamSubscriptionV2(
      () => {
        controller.abort('factory aborted')

        throw new Error('aborted factory failure')
      },
      () => {},
      { signal: controller.signal },
    )

    expect(subscription.cancelled).toBe(true)
  })

  it('emits no terminal event when an external signal aborts an idle stream', async () => {
    const controller = new AbortController()
    const onData = vi.fn()
    const onError = vi.fn()
    const onComplete = vi.fn()
    const onCancel = vi.fn()

    const subscription = createStreamSubscriptionV2(
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
      { signal: controller.signal },
    )

    subscription.on('error', onError)
    subscription.on('complete', onComplete)
    subscription.onCancel?.(onCancel)

    controller.abort('stop')
    await flush()

    expect(onData).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
    expect(onComplete).not.toHaveBeenCalled()
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(subscription.cancelled).toBe(true)
  })

  it('emits complete once, cleans listeners, and aborts the transport', async () => {
    let transportSignal: AbortSignal | undefined
    const onError = vi.fn()
    const onComplete = vi.fn()

    const subscription = createStreamSubscriptionV2(
      (signal) => {
        transportSignal = signal

        return {
          responses: (async function* stream() {
            yield 1
          })(),
        }
      },
      () => {},
    )

    subscription.on('error', onError)
    subscription.on('complete', onComplete)

    await flush()

    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onError).not.toHaveBeenCalled()
    expect(transportSignal?.aborted).toBe(true)
    expect(subscription.cancelled).toBe(false)
  })

  it('normalizes string gRPC codes and emits one error event', async () => {
    const errors: StreamError[] = []
    const onComplete = vi.fn()

    const subscription = createStreamSubscriptionV2(
      () => ({
        responses: (async function* failingStream() {
          throw Object.assign(new Error('backend unavailable'), {
            code: '14',
          })
        })(),
      }),
      () => {},
    )

    subscription.on('error', (error) => errors.push(error))
    subscription.on('complete', onComplete)

    await flush()

    expect(onComplete).not.toHaveBeenCalled()
    expect(errors).toHaveLength(1)
    expect(errors[0].code).toBe(14)
    expect(errors[0].details).toBe('backend unavailable')
    expect(subscription.cancelled).toBe(false)
  })

  it('cancels the transport and stops after a callback error', async () => {
    let transportSignal: AbortSignal | undefined
    const errors: StreamError[] = []
    const onComplete = vi.fn()

    const subscription = createStreamSubscriptionV2(
      (signal) => {
        transportSignal = signal

        return {
          responses: (async function* stream() {
            yield 1
            await new Promise<void>((resolve) => {
              signal.addEventListener('abort', () => resolve(), { once: true })
            })
            yield 2
          })(),
        }
      },
      () => {
        throw new Error('callback failed')
      },
    )

    subscription.on('error', (error) => errors.push(error))
    subscription.on('complete', onComplete)

    await flush()

    expect(onComplete).not.toHaveBeenCalled()
    expect(errors).toHaveLength(1)
    expect(errors[0].code).toBe(13)
    expect(errors[0].details).toBe('Callback error: callback failed')
    expect(transportSignal?.aborted).toBe(true)
  })

  it('treats a local AbortError as silent cancellation', async () => {
    const errors = vi.fn()
    const onCancel = vi.fn()

    const subscription = createStreamSubscriptionV2(
      () => ({
        responses: (async function* stream() {
          throw new DOMException('aborted', 'AbortError')
        })(),
      }),
      () => {},
    )

    subscription.on('error', errors)
    subscription.onCancel?.(onCancel)

    await flush()

    expect(errors).not.toHaveBeenCalled()
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(subscription.cancelled).toBe(true)
  })

  it('does not leave an unhandled rejection when the source rejects after unsubscribe', async () => {
    let rejectSource: ((error: Error) => void) | undefined

    const subscription = createStreamSubscriptionV2(
      () => ({
        responses: (async function* stream() {
          await new Promise<void>((_resolve, reject) => {
            rejectSource = reject
          })
          yield 1
        })(),
      }),
      () => {},
    )

    const onUnhandledRejection = vi.fn()
    process.once('unhandledRejection', onUnhandledRejection)

    await Promise.resolve()
    subscription.unsubscribe()
    rejectSource?.(new Error('late transport rejection'))
    await flush()

    process.removeListener('unhandledRejection', onUnhandledRejection)

    expect(onUnhandledRejection).not.toHaveBeenCalled()
  })
})
