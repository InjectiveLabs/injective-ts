import { combineAbortSignals } from '@injectivelabs/utils'
import type { Subscription } from 'rxjs'
import type { StreamStatusResponse } from '../../types/index.js'

type StreamResponseSource<TResponse> = {
  responses: AsyncIterable<TResponse>
}

type StreamFactory<TResponse> = (
  abortSignal: AbortSignal,
) => StreamResponseSource<TResponse>

export type LegacyStreamSubscription = Subscription & {
  /** Unsubscribe from the stream and cancel the underlying transport */
  unsubscribe(): void

  /** True once the stream has been cancelled locally (abort or unsubscribe) */
  readonly cancelled?: boolean

  /**
   * Observe local cancellation. Returns a function that removes the listener.
   * Optional so custom subscription-like objects remain compatible.
   */
  onCancel?(handler: () => void): () => void
}

export interface LegacyStreamSubscriptionOptions {
  /** Caller-owned signal that cancels this stream */
  signal?: AbortSignal
}

/**
 * Creates a subscription wrapper for the V2 generated streaming clients.
 *
 * The legacy object form is kept for backwards compatibility. Internal callers
 * use the factory form so the abort signal is wired into the transport before
 * the network call starts.
 */
export function createStreamSubscription<TResponse>(
  stream: StreamResponseSource<TResponse>,
  handleResponse: (response: TResponse) => void,
  onEndCallback?: (status?: StreamStatusResponse) => void,
  onStatusCallback?: (status: StreamStatusResponse) => void,
  options?: LegacyStreamSubscriptionOptions,
): LegacyStreamSubscription
export function createStreamSubscription<TResponse>(
  streamFactory: StreamFactory<TResponse>,
  handleResponse: (response: TResponse) => void,
  onEndCallback?: (status?: StreamStatusResponse) => void,
  onStatusCallback?: (status: StreamStatusResponse) => void,
  options?: LegacyStreamSubscriptionOptions,
): LegacyStreamSubscription
export function createStreamSubscription<TResponse>(
  source: StreamResponseSource<TResponse> | StreamFactory<TResponse>,
  handleResponse: (response: TResponse) => void,
  onEndCallback?: (status?: StreamStatusResponse) => void,
  onStatusCallback?: (status: StreamStatusResponse) => void,
  options: LegacyStreamSubscriptionOptions = {},
): LegacyStreamSubscription {
  const abortController = new AbortController()
  const combined = combineAbortSignals([abortController.signal, options.signal])
  const signal = combined.signal ?? abortController.signal
  const cancelHandlers = new Set<() => void>()

  let cancelled = false
  let terminated = false
  let cleaned = false

  const safeCall = (callback: (() => void) | undefined) => {
    if (!callback) {
      return
    }

    try {
      callback()
    } catch {
      // Cancellation and terminal callbacks must not break cleanup.
    }
  }

  const notifyCancellation = () => {
    const handlers = Array.from(cancelHandlers)
    cancelHandlers.clear()

    for (const handler of handlers) {
      safeCall(handler)
    }
  }

  const cancel = () => {
    if (cancelled || terminated) {
      return
    }

    cancelled = true
    abortController.abort()
    notifyCancellation()
  }

  const onAbort = () => {
    cancel()
  }

  const cleanup = () => {
    if (cleaned) {
      return
    }

    cleaned = true
    signal.removeEventListener('abort', onAbort)
    cancelHandlers.clear()
    combined.dispose()
    abortController.abort()
  }

  const reportError = (error: unknown): void => {
    if (typeof onStatusCallback === 'function') {
      // V1 consumers rely on UNKNOWN and on metadata being the raw error.
      safeCall(() =>
        onStatusCallback({
          code: 2,
          details:
            error instanceof Error ? error.message : 'Unknown stream error',
          metadata: error,
        }),
      )
    }
  }

  const subscription = {
    unsubscribe: cancel,
    get cancelled() {
      return cancelled
    },
    get closed() {
      return cancelled || terminated
    },
    add: () => {
      /* Kept for RxJS Subscription structural compatibility */
    },
    remove: () => {
      /* Kept for RxJS Subscription structural compatibility */
    },
    onCancel: (handler: () => void) => {
      if (cancelled) {
        safeCall(handler)

        return () => {}
      }

      if (terminated) {
        return () => {}
      }

      cancelHandlers.add(handler)

      return () => {
        cancelHandlers.delete(handler)
      }
    },
  } as unknown as LegacyStreamSubscription

  if (signal.aborted) {
    cancelled = true
    cleanup()

    return subscription
  }

  signal.addEventListener('abort', onAbort, { once: true })

  let stream: StreamResponseSource<TResponse>

  try {
    stream = typeof source === 'function' ? source(signal) : source
  } catch (error) {
    // cleanup() aborts the internal controller, so capture the caller-facing
    // cancellation state first. Otherwise every synchronous factory error
    // would look locally cancelled and be swallowed.
    const locallyCancelled = cancelled || signal.aborted

    cleanup()

    if (locallyCancelled) {
      return subscription
    }

    throw error
  }

  ;(async () => {
    try {
      for await (const response of stream.responses) {
        if (cancelled || terminated || signal.aborted) {
          break
        }

        try {
          handleResponse(response)
        } catch (error) {
          if (cancelled || terminated || signal.aborted) {
            break
          }

          terminated = true
          abortController.abort()
          reportError(error)
          break
        }
      }

      if (!cancelled && !terminated && !signal.aborted) {
        terminated = true

        if (typeof onEndCallback === 'function') {
          safeCall(() => onEndCallback())
        }
      }
    } catch (error) {
      if (cancelled || terminated || signal.aborted) {
        return
      }

      terminated = true
      abortController.abort()
      reportError(error)
    } finally {
      cleanup()
    }
  })()

  return subscription
}
