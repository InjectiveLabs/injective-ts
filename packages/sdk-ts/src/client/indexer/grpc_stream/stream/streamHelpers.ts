import type { Subscription } from 'rxjs'
import type { StreamStatusResponse } from '../../types/index.js'

/**
 * Creates a subscription wrapper for V2 streaming with proper cancellation support.
 *
 * @param stream - The ServerStreamingCall from the V2 client
 * @param handleResponse - Callback to process each stream response
 * @param onEndCallback - Optional callback when stream ends normally
 * @param onStatusCallback - Optional callback for stream errors
 * @returns Subscription object with unsubscribe method
 */
export function createStreamSubscription<TResponse>(
  stream: { responses: AsyncIterable<TResponse> },
  handleResponse: (response: TResponse) => void,
  onEndCallback?: (status?: StreamStatusResponse) => void,
  onStatusCallback?: (status: StreamStatusResponse) => void,
): Subscription {
  // V2 streaming uses async iteration with AbortController for proper cancellation
  const abortController = new AbortController()

  // Create subscription wrapper for V1 API compatibility
  const subscription = {
    unsubscribe: () => {
      abortController.abort()
    },
  }

  // Handle stream responses with abort signal checking
  ;(async () => {
    try {
      for await (const response of stream.responses) {
        if (abortController.signal.aborted) {
          break // Exit immediately on unsubscribe
        }
        handleResponse(response)
      }
      // Only call callbacks if not aborted (prevents memory leaks)
      if (onEndCallback && !abortController.signal.aborted) {
        onEndCallback()
      }
    } catch (error) {
      if (!abortController.signal.aborted && onStatusCallback) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown stream error'
        onStatusCallback({
          code: 2, // gRPC internal error code
          details: errorMessage,
          metadata: error,
        })
      }
    }
  })()

  return subscription as Subscription
}
