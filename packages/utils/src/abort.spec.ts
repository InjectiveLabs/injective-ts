import { expectTypeOf } from 'vitest'
import {
  AbortError,
  isAbortError,
  raceWithAbort,
  abortableSleep,
  throwIfAborted,
  createAbortError,
  combineAbortSignals,
} from './abort.js'
import type { AbortErrorLike } from './abort.js'

const createDeferred = <T>() => {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })

  return { promise, resolve, reject }
}

describe('AbortError', () => {
  it('uses a stable generic message and preserves the caller reason', () => {
    const reason = new Error('specific upstream reason')
    const error = new AbortError(reason)

    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('AbortError')
    expect(error.code).toBe('ERR_CANCELED')
    expect(error.message).toBe('The operation was aborted')
    expect(error.message).not.toContain('specific upstream reason')
    expect(error.reason).toBe(reason)
    expect((error as Error & { cause?: unknown }).cause).toBe(reason)
  })

  it('does not invent a reason when none is provided', () => {
    const error = new AbortError()

    expect(error.reason).toBeUndefined()
    expect((error as Error & { cause?: unknown }).cause).toBeUndefined()
  })
})

describe('createAbortError', () => {
  it('preserves an abort signal reason', () => {
    const controller = new AbortController()
    const reason = { code: 'USER_NAVIGATED' }

    controller.abort(reason)

    const error = createAbortError(controller.signal)

    expect(error).toBeInstanceOf(AbortError)
    expect(error.reason).toBe(reason)
  })

  it('has no reason when the signal is not aborted', () => {
    const controller = new AbortController()
    const error = createAbortError(controller.signal)

    expect(error.reason).toBeUndefined()
  })
})

describe('isAbortError', () => {
  it('narrows structural errors without claiming they are Error instances', () => {
    const error: unknown = {
      code: 'ERR_CANCELED',
      reason: { source: 'adapter' },
    }
    if (!isAbortError(error)) throw new Error('Expected cancellation')
    expectTypeOf(error).toEqualTypeOf<AbortErrorLike>()
    expect(error.reason).toEqual({ source: 'adapter' })
    expect(error).not.toBeInstanceOf(Error)
  })
  it('recognizes SDK and native abort-shaped errors', () => {
    expect(isAbortError(new AbortError('reason'))).toBe(true)
    expect(
      isAbortError(
        Object.assign(new Error('canceled'), {
          name: 'CanceledError',
          code: 'ERR_CANCELED',
        }),
      ),
    ).toBe(true)
    expect(
      isAbortError(
        Object.assign(new Error('canceled'), { code: 'ERR_CANCELED' }),
      ),
    ).toBe(true)

    if (typeof DOMException !== 'undefined') {
      expect(isAbortError(new DOMException('aborted', 'AbortError'))).toBe(true)
    }
  })

  it('never mistakes gRPC statuses or server errors for local cancellation', () => {
    expect(
      isAbortError(
        Object.assign(new Error('server cancelled'), {
          name: 'RpcError',
          code: 'CANCELLED',
        }),
      ),
    ).toBe(false)
    expect(
      isAbortError(
        Object.assign(new Error('server aborted'), {
          name: 'RpcError',
          code: 'ABORTED',
        }),
      ),
    ).toBe(false)
    expect(
      isAbortError(
        Object.assign(new Error('deadline'), {
          name: 'RpcError',
          code: 'DEADLINE_EXCEEDED',
        }),
      ),
    ).toBe(false)
    expect(
      isAbortError(
        Object.assign(new Error('server timeout'), {
          name: 'HttpRequestException',
          code: 504,
        }),
      ),
    ).toBe(false)
    expect(isAbortError(new Error('regular error'))).toBe(false)
    expect(isAbortError(undefined)).toBe(false)
  })
})

describe('throwIfAborted', () => {
  it('supports reasonless polyfill signals without DOMException or native throwIfAborted', async () => {
    vi.stubGlobal('DOMException', undefined)
    const signal = Object.assign(new EventTarget(), {
      aborted: false,
    }) as AbortSignal
    const promise = abortableSleep(1000, signal)

    try {
      Object.assign(signal, { aborted: true })
      signal.dispatchEvent(new Event('abort'))

      await expect(promise).rejects.toMatchObject({
        name: 'AbortError',
        code: 'ERR_CANCELED',
        reason: undefined,
      })
      expect(() => throwIfAborted(signal)).toThrow(AbortError)
      expect(isAbortError(new Error('network failure'))).toBe(false)
    } finally {
      vi.unstubAllGlobals()
    }
  })

  it('does nothing for missing or live signals', () => {
    expect(() => throwIfAborted()).not.toThrow()
    expect(() => throwIfAborted(new AbortController().signal)).not.toThrow()
  })

  it('throws a local AbortError with the signal reason', () => {
    const controller = new AbortController()
    const reason = new Error('user closed the request')

    controller.abort(reason)

    try {
      throwIfAborted(controller.signal)
      expect.unreachable('Expected throwIfAborted to throw')
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(AbortError)
      expect((error as AbortError).reason).toBe(reason)
      expect((error as AbortError).message).toBe('The operation was aborted')
    }
  })
})

describe('combineAbortSignals', () => {
  it('guarantees a signal only for a tuple containing a definite endpoint signal', () => {
    const controller = new AbortController()
    const optional: AbortSignal | undefined = undefined
    const first = combineAbortSignals([controller.signal, optional])
    const last = combineAbortSignals([optional, controller.signal])
    const missing = combineAbortSignals([optional])
    expectTypeOf(first.signal).toEqualTypeOf<AbortSignal>()
    expectTypeOf(last.signal).toEqualTypeOf<AbortSignal>()
    expectTypeOf(missing.signal).toEqualTypeOf<AbortSignal | undefined>()
    expect(first.signal).toBe(controller.signal)
    expect(last.signal).toBe(controller.signal)
    expect(missing.signal).toBeUndefined()
  })
  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('returns no signal and a safe disposer for empty input', () => {
    const combined = combineAbortSignals([undefined, undefined])

    expect(combined.signal).toBeUndefined()
    expect(() => combined.dispose()).not.toThrow()
  })

  it('returns a single signal as-is without listeners', () => {
    const controller = new AbortController()
    const addEventListener = vi.spyOn(controller.signal, 'addEventListener')
    const combined = combineAbortSignals([controller.signal])

    expect(combined.signal).toBe(controller.signal)
    expect(addEventListener).not.toHaveBeenCalled()

    combined.dispose()
  })

  it('deduplicates the same signal without listeners', () => {
    const controller = new AbortController()
    const addEventListener = vi.spyOn(controller.signal, 'addEventListener')
    const combined = combineAbortSignals([
      controller.signal,
      controller.signal,
      undefined,
    ])

    expect(combined.signal).toBe(controller.signal)
    expect(addEventListener).not.toHaveBeenCalled()

    combined.dispose()
  })

  it('preserves the first abort reason', () => {
    const first = new AbortController()
    const second = new AbortController()
    const reason = { source: 'first' }
    const combined = combineAbortSignals([first.signal, second.signal])

    first.abort(reason)
    second.abort({ source: 'second' })

    expect(combined.signal?.aborted).toBe(true)
    expect(combined.signal?.reason).toBe(reason)
  })

  it('uses the first already-aborted signal in argument order', () => {
    const first = new AbortController()
    const second = new AbortController()
    const firstReason = { source: 'first' }
    const secondReason = { source: 'second' }

    second.abort(secondReason)
    first.abort(firstReason)

    const combined = combineAbortSignals([first.signal, second.signal])

    expect(combined.signal?.aborted).toBe(true)
    expect(combined.signal?.reason).toBe(firstReason)
  })

  it('does not abort caller controllers', () => {
    const first = new AbortController()
    const second = new AbortController()
    const combined = combineAbortSignals([first.signal, second.signal])

    first.abort('caller reason')

    expect(first.signal.aborted).toBe(true)
    expect(second.signal.aborted).toBe(false)
    expect(combined.signal?.aborted).toBe(true)
  })

  it('removes listeners on abort and dispose', () => {
    const first = new AbortController()
    const second = new AbortController()
    const removeFirst = vi.spyOn(first.signal, 'removeEventListener')
    const removeSecond = vi.spyOn(second.signal, 'removeEventListener')
    const combined = combineAbortSignals([first.signal, second.signal])

    first.abort('stop')

    expect(removeFirst).toHaveBeenCalled()
    expect(removeSecond).toHaveBeenCalled()
    expect(combined.signal?.aborted).toBe(true)
  })

  it('stops propagation after dispose', () => {
    const first = new AbortController()
    const second = new AbortController()
    const combined = combineAbortSignals([first.signal, second.signal])

    combined.dispose()
    combined.dispose()
    first.abort('too late')

    expect(combined.signal?.aborted).toBe(false)
  })
})

describe('abortableSleep', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('resolves after the delay and cleans up its timer', async () => {
    vi.useFakeTimers()
    const promise = abortableSleep(1000)

    expect(vi.getTimerCount()).toBe(1)

    await vi.advanceTimersByTimeAsync(1000)
    await expect(promise).resolves.toBeUndefined()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('rejects promptly on abort and clears the timer', async () => {
    vi.useFakeTimers()
    const controller = new AbortController()
    const reason = new Error('stop waiting')
    const promise = abortableSleep(1000, controller.signal)

    expect(vi.getTimerCount()).toBe(1)

    controller.abort(reason)

    await expect(promise).rejects.toMatchObject({
      name: 'AbortError',
      code: 'ERR_CANCELED',
      reason,
    })
    expect(vi.getTimerCount()).toBe(0)
  })

  it('rejects pre-aborted signals without scheduling a timer', async () => {
    vi.useFakeTimers()
    const controller = new AbortController()
    const reason = { why: 'before call' }

    controller.abort(reason)

    const promise = abortableSleep(1000, controller.signal)

    await expect(promise).rejects.toMatchObject({ reason })
    expect(vi.getTimerCount()).toBe(0)
  })

  it('removes its abort listener on normal resolution', async () => {
    vi.useFakeTimers()
    const controller = new AbortController()
    const removeEventListener = vi.spyOn(
      controller.signal,
      'removeEventListener',
    )
    const promise = abortableSleep(10, controller.signal)

    await vi.advanceTimersByTimeAsync(10)
    await expect(promise).resolves.toBeUndefined()

    expect(removeEventListener).toHaveBeenCalled()
  })
})

describe('raceWithAbort', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('resolves normally when no abort occurs', async () => {
    const controller = new AbortController()
    const removeEventListener = vi.spyOn(
      controller.signal,
      'removeEventListener',
    )

    await expect(
      raceWithAbort(Promise.resolve('result'), controller.signal),
    ).resolves.toBe('result')
    expect(removeEventListener).toHaveBeenCalled()
  })

  it('propagates a normal rejection', async () => {
    const controller = new AbortController()
    const error = new Error('upstream failed')

    await expect(
      raceWithAbort(Promise.reject(error), controller.signal),
    ).rejects.toBe(error)
  })

  it('rejects promptly on abort and prevents late success', async () => {
    const controller = new AbortController()
    const deferred = createDeferred<string>()
    const reason = new Error('user cancelled')
    const raced = raceWithAbort(deferred.promise, controller.signal)
    let settled = false

    raced.catch(() => {
      settled = true
    })

    controller.abort(reason)
    await Promise.resolve()

    expect(settled).toBe(true)
    await expect(raced).rejects.toMatchObject({
      name: 'AbortError',
      reason,
    })

    deferred.resolve('late success')
    await Promise.resolve()

    await expect(raced).rejects.toMatchObject({ name: 'AbortError' })
  })

  it('consumes a late rejection after abort', async () => {
    const controller = new AbortController()
    const deferred = createDeferred<string>()
    const raced = raceWithAbort(deferred.promise, controller.signal)

    controller.abort('stop')
    await expect(raced).rejects.toMatchObject({ name: 'AbortError' })

    deferred.reject(new Error('late rejection'))
    await new Promise((resolve) => setTimeout(resolve, 0))
  })

  it('handles pre-aborted signals without leaking listeners', async () => {
    const controller = new AbortController()
    const reason = { source: 'pre-aborted' }
    const removeEventListener = vi.spyOn(
      controller.signal,
      'removeEventListener',
    )

    controller.abort(reason)

    const raced = raceWithAbort(
      Promise.reject(new Error('late rejection')),
      controller.signal,
    )

    await expect(raced).rejects.toMatchObject({ name: 'AbortError', reason })
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(removeEventListener).not.toHaveBeenCalled()
  })
})
