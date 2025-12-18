import { EventEmitter } from 'eventemitter3'
import { GrpcStatusCode } from '../../../../types/index.js'
import type {
  StreamError,
  StreamSubscription,
} from '../../../../types/index.js'

/**
 * Extracts detailed error information from a gRPC/RpcError object.
 *
 * gRPC-web errors typically have these properties:
 * - code: gRPC status code (number)
 * - message: Error message
 * - name: 'RpcError'
 * - methodName: The RPC method that failed
 * - serviceName: The service name
 * - metadata: Response metadata/trailers
 */
function extractGrpcError(error: unknown): StreamError {
  // Default values
  let code: number = GrpcStatusCode.UNKNOWN
  let details = 'Unknown stream error'
  let metadata: any = undefined

  if (error && typeof error === 'object') {
    // Extract gRPC status code
    if ('code' in error && typeof error.code === 'number') {
      code = error.code
    }

    // Extract error message - gRPC errors use 'message' or 'details'
    if ('message' in error && typeof error.message === 'string') {
      details = error.message
    } else if ('details' in error && typeof error.details === 'string') {
      details = error.details
    }

    // Build metadata object with useful debugging info
    const errorObj = error as Record<string, unknown>
    metadata = {
      originalError: error,
      ...('name' in errorObj && { errorName: errorObj.name }),
      ...('methodName' in errorObj && { methodName: errorObj.methodName }),
      ...('serviceName' in errorObj && { serviceName: errorObj.serviceName }),
      ...('metadata' in errorObj && { grpcMetadata: errorObj.metadata }),
    }
  } else if (error instanceof Error) {
    details = error.message
    metadata = { originalError: error, stack: error.stack }
  }

  return { code, details, metadata }
}

/**
 * Creates an event-based subscription for StreamManager V2.
 * This emits 'error' and 'complete' events instead of using callbacks.
 *
 * Error Handling:
 * - gRPC errors are extracted with full metadata and emitted as 'error' events
 * - User callback errors are caught and emitted separately to distinguish from stream errors
 * - Aborted streams don't emit any events (clean shutdown)
 *
 * @param stream - The ServerStreamingCall from the V2 client
 * @param handleResponse - Callback to process each stream response
 * @returns StreamSubscription with event emitters for error/complete
 */
export function createStreamSubscriptionV2<TResponse>(
  stream: { responses: AsyncIterable<TResponse> },
  handleResponse: (response: TResponse) => void,
): StreamSubscription {
  const emitter = new EventEmitter()
  const abortController = new AbortController()

  // Track if we've already emitted a terminal event (error or complete)
  let hasEmittedTerminalEvent = false

  // Create subscription object with event emitters
  const subscription: StreamSubscription = {
    unsubscribe: () => {
      abortController.abort()
      emitter.removeAllListeners()
    },
    on: (event: string, handler: (...args: any[]) => void) => {
      emitter.on(event, handler)
    },
    off: (event: string, handler: (...args: any[]) => void) => {
      emitter.off(event, handler)
    },
  }

  // Handle stream responses with abort signal checking
  ;(async () => {
    try {
      for await (const response of stream.responses) {
        // Check abort signal before processing each response
        if (abortController.signal.aborted) {
          return // Clean exit, no events emitted
        }

        // Wrap handleResponse to catch user callback errors
        try {
          handleResponse(response)
        } catch (callbackError) {
          // User callback error - emit as error but with special code
          // This distinguishes from gRPC transport errors
          if (!abortController.signal.aborted && !hasEmittedTerminalEvent) {
            hasEmittedTerminalEvent = true

            const streamError: StreamError = {
              code: GrpcStatusCode.INTERNAL, // Internal because it's our code that failed
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

            emitter.emit('error', streamError)
          }

          return // Stop processing after callback error
        }
      }

      // Stream completed successfully
      if (!abortController.signal.aborted && !hasEmittedTerminalEvent) {
        hasEmittedTerminalEvent = true
        emitter.emit('complete')
      }
    } catch (error) {
      // Stream errored - this is where gRPC transport errors surface
      if (!abortController.signal.aborted && !hasEmittedTerminalEvent) {
        hasEmittedTerminalEvent = true
        const streamError = extractGrpcError(error)
        emitter.emit('error', streamError)
      }
    }
  })()

  return subscription
}
