import { EventEmitter } from 'eventemitter3'
import { isAbortError, combineAbortSignals } from '@injectivelabs/utils'
import { extractGrpcError } from '../streamError.js'
import { GrpcStatusCode } from '../../../../types/index.js'
import type {
  StreamError,
  StreamSubscription,
} from '../../../../types/index.js'

type StreamResponseSource<TResponse> = {
  responses: AsyncIterable<TResponse>
}

type StreamFactory<TResponse> = (
  abortSignal: AbortSignal,
) => StreamResponseSource<TResponse>

export interface StreamSubscriptionOptions {
  /** Caller-owned signal that cancels this stream */
  signal?: AbortSignal
}

/**
 * Creates an event-based subscription for StreamManager V2.
 *
 * The abort signal is passed to the factory before any network work starts.
 * Local abort/unsubscribe is silent: no 'error' or 'complete' event is emitted.
 * Genuine terminal events are emitted once and all listeners are released.
 */
export function createStreamSubscriptionV2<TResponse>(
  streamFactory: StreamFactory<TResponse>,
  handleResponse: (response: TResponse) => void,
  options: StreamSubscriptionOptions = {},
): StreamSubscription {
  const emitter = new EventEmitter()
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

  const emitSafely = (event: string, payload?: unknown) => {
    try {
      if (payload === undefined) {
        emitter.emit(event)
      } else {
        emitter.emit(event, payload)
      }
    } catch {
      // A listener must not prevent the remaining terminal cleanup.
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
    emitter.removeAllListeners()
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
    emitter.removeAllListeners()
    combined.dispose()
    abortController.abort()
  }

  const subscription: StreamSubscription = {
    unsubscribe: cancel,
    get cancelled() {
      return cancelled
    },
    on: (event: string, handler: (...args: any[]) => void) => {
      if (!cancelled && !terminalEventReached()) {
        emitter.on(event, handler)
      }
    },
    off: (event: string, handler: (...args: any[]) => void) => {
      emitter.off(event, handler)
    },
    onCancel: (handler: () => void) => {
      if (cancelled) {
        safeCall(handler)

        return () => {}
      }

      if (terminalEventReached()) {
        return () => {}
      }

      cancelHandlers.add(handler)

      return () => {
        cancelHandlers.delete(handler)
      }
    },
  }

  function terminalEventReached(): boolean {
    return terminated || cleaned
  }

  if (signal.aborted) {
    cancelled = true
    cleanup()

    return subscription
  }

  signal.addEventListener('abort', onAbort, { once: true })

  let stream: StreamResponseSource<TResponse>

  try {
    stream = streamFactory(signal)
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

  if (signal.aborted) {
    cancel()
    cleanup()

    return subscription
  }

  ;(async () => {
    try {
      for await (const response of stream.responses) {
        if (cancelled || terminated || signal.aborted) {
          return
        }

        try {
          handleResponse(response)
        } catch (callbackError) {
          if (cancelled || terminated || signal.aborted) {
            return
          }

          if (isAbortError(callbackError)) {
            cancel()

            return
          }

          terminated = true
          abortController.abort()

          const streamError: StreamError = {
            code: GrpcStatusCode.INTERNAL,
            details:
              callbackError instanceof Error
                ? `Callback error: ${callbackError.message}`
                : 'Callback error: Unknown',
            metadata: {
              type: 'callback-error',
              originalError: callbackError,
              stack:
                callbackError instanceof Error
                  ? callbackError.stack
                  : undefined,
            },
          }

          emitSafely('error', streamError)
          cleanup()

          return
        }
      }

      if (!cancelled && !terminated && !signal.aborted) {
        terminated = true
        emitSafely('complete')
        cleanup()
      }
    } catch (error) {
      if (cancelled || terminated || signal.aborted) {
        cleanup()

        return
      }

      if (isAbortError(error)) {
        cancel()
        cleanup()

        return
      }

      terminated = true
      abortController.abort()
      emitSafely('error', extractGrpcError(error))
      cleanup()
    }
  })()

  return subscription
}
