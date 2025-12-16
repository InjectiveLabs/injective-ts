import { EventEmitter } from 'eventemitter3'
import type {
  StreamError,
  StreamSubscription,
} from '../../../../types/index.js'

/**
 * Creates an event-based subscription for StreamManager V2.
 * This emits 'error' and 'complete' events instead of using callbacks.
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
        // Double-check abort signal to prevent race condition when switching streams rapidly
        if (abortController.signal.aborted) {
          break
        }
        // Check again before processing to handle abort during async iteration
        if (abortController.signal.aborted) {
          break
        }
        handleResponse(response)
      }

      // Stream completed successfully
      if (!abortController.signal.aborted) {
        emitter.emit('complete')
      }
    } catch (error) {
      // Stream errored - this is where gRPC errors surface!
      if (!abortController.signal.aborted) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown stream error'

        // Try to extract gRPC error code if available
        let grpcCode = 2 // Default to UNKNOWN

        if (error && typeof error === 'object' && 'code' in error) {
          grpcCode = (error as any).code
        }

        const streamError: StreamError = {
          code: grpcCode,
          metadata: error,
          details: errorMessage,
        }

        emitter.emit('error', streamError)
      }
    }
  })()

  return subscription
}
