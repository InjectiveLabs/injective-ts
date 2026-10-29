const ABORT_ERROR_MESSAGE = 'The operation was aborted'

/**
 * Optional cancellation options accepted by read/query APIs.
 */
export interface RequestOptions {
  signal?: AbortSignal
}

/**
 * Local cancellation error shared by every cancellable SDK operation.
 *
 * The message is deliberately stable and generic so that callers can rely on
 * `name`/`code`/`reason` instead of parsing messages, and so that a user
 * provided reason can never be mistaken for an existing string-based error
 * (for example a "not found" response).
 */
export class AbortError extends Error {
  readonly name: 'AbortError' = 'AbortError'

  readonly code: 'ERR_CANCELED' = 'ERR_CANCELED'

  readonly reason: unknown

  constructor(reason?: unknown) {
    super(ABORT_ERROR_MESSAGE)

    this.reason = reason

    if (reason !== undefined) {
      Object.defineProperty(this, 'cause', {
        configurable: true,
        enumerable: false,
        value: reason,
        writable: true,
      })
    }
  }
}

/**
 * Creates an abort error, preserving the signal's abort reason when present.
 */
export const createAbortError = (signal?: AbortSignal): AbortError => {
  return new AbortError(signal?.aborted ? signal.reason : undefined)
}

/** Structural because native and cross-package cancellation may be plain objects. */
export type AbortErrorLike = (
  | { name: 'AbortError'; code?: unknown }
  | { name?: unknown; code: 'ERR_CANCELED' }
) & { reason?: unknown }

/**
 * Identifies local/SDK/documented abort-shaped errors.
 *
 * This intentionally does not treat gRPC status codes (`CANCELLED`,
 * `ABORTED`, `DEADLINE_EXCEEDED`) or arbitrary server errors as cancellation.
 */
export const isAbortError = (error: unknown): error is AbortErrorLike => {
  if (error instanceof AbortError) {
    return true
  }

  if (!error || typeof error !== 'object') {
    return false
  }

  const candidate = error as { name?: unknown; code?: unknown }

  if (candidate.name === 'AbortError') {
    return true
  }

  if (candidate.code === 'ERR_CANCELED') {
    return true
  }

  return false
}

/**
 * Throws an {@link AbortError} when the signal has already been aborted.
 */
export const throwIfAborted = (signal?: AbortSignal): void => {
  if (signal?.aborted) {
    throw createAbortError(signal)
  }
}

/**
 * Combines several optional signals into a single cancellation constraint.
 *
 * - No signal: returns `undefined` without creating controllers/listeners.
 * - One signal: returns it as-is without adding listeners.
 * - Multiple signals: returns a new controller signal that aborts with the
 *   first observed reason. Caller controllers are never aborted.
 *
 * `dispose` removes all listeners and is safe to call more than once.
 */
export function combineAbortSignals(
  signals:
    | readonly [AbortSignal, ...(AbortSignal | undefined)[]]
    | readonly [...(AbortSignal | undefined)[], AbortSignal],
): { signal: AbortSignal; dispose(): void }
export function combineAbortSignals(
  signals: readonly (AbortSignal | undefined)[],
): { signal: AbortSignal | undefined; dispose(): void }
export function combineAbortSignals(
  signals: readonly (AbortSignal | undefined)[],
): {
  signal: AbortSignal | undefined
  dispose(): void
} {
  const uniqueSignals = Array.from(
    new Set(signals.filter((signal): signal is AbortSignal => Boolean(signal))),
  )
  const noop = () => {
    //
  }

  if (uniqueSignals.length === 0) {
    return { signal: undefined, dispose: noop }
  }

  if (uniqueSignals.length === 1) {
    return { signal: uniqueSignals[0], dispose: noop }
  }

  const controller = new AbortController()
  const alreadyAborted = uniqueSignals.find((signal) => signal.aborted)

  if (alreadyAborted) {
    controller.abort(alreadyAborted.reason)

    return { signal: controller.signal, dispose: noop }
  }

  let disposed = false
  const listeners = new Map<AbortSignal, () => void>()

  const dispose = () => {
    if (disposed) {
      return
    }

    disposed = true

    listeners.forEach((listener, signal) => {
      signal.removeEventListener('abort', listener)
    })
    listeners.clear()
  }

  uniqueSignals.forEach((sourceSignal) => {
    const listener = () => {
      if (controller.signal.aborted) {
        return
      }

      // Remove every listener before notifying combined-signal consumers so
      // reentrant aborts from those consumers cannot replace the first reason.
      dispose()
      controller.abort(sourceSignal.reason)
    }

    listeners.set(sourceSignal, listener)
    sourceSignal.addEventListener('abort', listener, { once: true })
  })

  // Guard against a signal aborting between the pre-check and listener setup.
  const abortedDuringSetup = uniqueSignals.find((signal) => signal.aborted)

  if (abortedDuringSetup && !controller.signal.aborted) {
    dispose()
    controller.abort(abortedDuringSetup.reason)
  }

  return { signal: controller.signal, dispose }
}

/**
 * Sleeps for `ms`, rejecting with {@link AbortError} as soon as the signal is
 * aborted. Timers and listeners are always cleaned up.
 */
export const abortableSleep = (
  ms: number,
  signal?: AbortSignal,
): Promise<void> => {
  if (!signal) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

  if (signal.aborted) {
    return Promise.reject(createAbortError(signal))
  }

  return new Promise((resolve, reject) => {
    let timer: ReturnType<typeof setTimeout> | undefined
    let settled = false

    const onAbort = () => {
      if (settled) {
        return
      }

      settled = true

      if (timer !== undefined) {
        clearTimeout(timer)
        timer = undefined
      }

      signal.removeEventListener('abort', onAbort)
      reject(createAbortError(signal))
    }

    signal.addEventListener('abort', onAbort, { once: true })

    if (signal.aborted) {
      onAbort()

      return
    }

    timer = setTimeout(() => {
      if (settled) {
        return
      }

      settled = true
      signal.removeEventListener('abort', onAbort)
      resolve()
    }, ms)
  })
}

/**
 * Waits for `promise`, but rejects promptly when `signal` is aborted.
 *
 * The eventual promise settlement is always observed, so a late rejection can
 * never become unhandled. Late success/rejection cannot override an abort, and
 * listeners are removed on every settlement path.
 */
export const raceWithAbort = <T>(
  promise: PromiseLike<T>,
  signal?: AbortSignal,
): Promise<T> => {
  const observedPromise = Promise.resolve(promise)

  if (!signal) {
    return observedPromise
  }

  if (signal.aborted) {
    // The caller will receive an AbortError, but the original promise still
    // needs a rejection handler to avoid an unhandled rejection.
    observedPromise.then(
      () => {
        //
      },
      () => {
        //
      },
    )

    return Promise.reject(createAbortError(signal))
  }

  return new Promise<T>((resolve, reject) => {
    let settled = false

    const onAbort = () => {
      if (settled) {
        return
      }

      settled = true
      signal.removeEventListener('abort', onAbort)
      reject(createAbortError(signal))
    }

    signal.addEventListener('abort', onAbort, { once: true })

    observedPromise.then(
      (value) => {
        if (settled) {
          return
        }

        settled = true
        signal.removeEventListener('abort', onAbort)
        resolve(value)
      },
      (error) => {
        if (settled) {
          return
        }

        settled = true
        signal.removeEventListener('abort', onAbort)
        reject(error)
      },
    )

    if (signal.aborted) {
      onAbort()
    }
  })
}
