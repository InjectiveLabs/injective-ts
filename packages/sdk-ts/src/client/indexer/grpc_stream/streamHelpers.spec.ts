import { createStreamSubscription } from './streamHelpers.js'
import type { StreamStatusResponse } from '../types/index.js'

describe('streamHelpers', () => {
  describe('createStreamSubscription', () => {
    it('should create a subscription with unsubscribe method', () => {
      const mockStream = {
        responses: (async function* () {
          yield { data: 'test1' }
          yield { data: 'test2' }
        })(),
      }

      const subscription = createStreamSubscription(
        mockStream,
        () => {},
        undefined,
        undefined,
      )

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')
    })

    it('should call handleResponse for each stream response', async () => {
      const responses = [
        { data: 'test1' },
        { data: 'test2' },
        { data: 'test3' },
      ]
      const mockStream = {
        responses: (async function* () {
          for (const response of responses) {
            yield response
          }
        })(),
      }

      const receivedResponses: any[] = []
      const subscription = createStreamSubscription(
        mockStream,
        (response) => {
          receivedResponses.push(response)
        },
        undefined,
        undefined,
      )

      // Wait for all responses to be processed
      await new Promise((resolve) => setTimeout(resolve, 100))

      expect(receivedResponses).toEqual(responses)

      subscription.unsubscribe()
    })

    it('should stop processing after unsubscribe', async () => {
      const mockStream = {
        responses: (async function* () {
          yield { data: 'test1' }
          await new Promise((resolve) => setTimeout(resolve, 50))
          yield { data: 'test2' }
          await new Promise((resolve) => setTimeout(resolve, 50))
          yield { data: 'test3' }
        })(),
      }

      let callbackCount = 0
      const subscription = createStreamSubscription(
        mockStream,
        () => {
          callbackCount++
        },
        undefined,
        undefined,
      )

      // Wait for first response
      await new Promise((resolve) => setTimeout(resolve, 25))
      const countAfterFirst = callbackCount

      // Unsubscribe
      subscription.unsubscribe()

      // Wait longer to ensure no more callbacks
      await new Promise((resolve) => setTimeout(resolve, 150))

      // Should not have received more callbacks after unsubscribe
      expect(callbackCount).toBe(countAfterFirst)
    })

    it('should call onEndCallback when stream ends normally', async () => {
      const mockStream = {
        responses: (async function* () {
          yield { data: 'test1' }
        })(),
      }

      let endCalled = false
      const subscription = createStreamSubscription(
        mockStream,
        () => {},
        () => {
          endCalled = true
        },
        undefined,
      )

      // Wait for stream to complete
      await new Promise((resolve) => setTimeout(resolve, 100))

      expect(endCalled).toBe(true)

      subscription.unsubscribe()
    })

    it('should not call onEndCallback after unsubscribe', async () => {
      const mockStream = {
        responses: (async function* () {
          yield { data: 'test1' }
          await new Promise((resolve) => setTimeout(resolve, 100))
          yield { data: 'test2' }
        })(),
      }

      let endCalled = false
      const subscription = createStreamSubscription(
        mockStream,
        () => {},
        () => {
          endCalled = true
        },
        undefined,
      )

      // Unsubscribe immediately
      subscription.unsubscribe()

      // Wait to ensure end callback is not called
      await new Promise((resolve) => setTimeout(resolve, 150))

      expect(endCalled).toBe(false)
    })

    it('should call onStatusCallback on stream error', async () => {
      const errorMessage = 'Stream error occurred'
      const mockStream = {
        responses: (async function* () {
          yield { data: 'test1' }
          throw new Error(errorMessage)
        })(),
      }

      let statusCalled = false
      let errorDetails = ''
      const subscription = createStreamSubscription(
        mockStream,
        () => {},
        undefined,
        (status: StreamStatusResponse) => {
          statusCalled = true
          errorDetails = status.details || ''
        },
      )

      // Wait for error to occur
      await new Promise((resolve) => setTimeout(resolve, 100))

      expect(statusCalled).toBe(true)
      expect(errorDetails).toBe(errorMessage)

      subscription.unsubscribe()
    })

    it('should not call onStatusCallback after unsubscribe', async () => {
      const mockStream = {
        responses: (async function* () {
          yield { data: 'test1' }
          await new Promise((resolve) => setTimeout(resolve, 100))
          throw new Error('Should not be called')
        })(),
      }

      let statusCalled = false
      const subscription = createStreamSubscription(
        mockStream,
        () => {},
        undefined,
        () => {
          statusCalled = true
        },
      )

      // Unsubscribe before error
      await new Promise((resolve) => setTimeout(resolve, 50))
      subscription.unsubscribe()

      // Wait for potential error
      await new Promise((resolve) => setTimeout(resolve, 100))

      expect(statusCalled).toBe(false)
    })

    it('should handle multiple unsubscribe calls gracefully', async () => {
      const mockStream = {
        responses: (async function* () {
          yield { data: 'test1' }
        })(),
      }

      const subscription = createStreamSubscription(
        mockStream,
        () => {},
        undefined,
        undefined,
      )

      // Call unsubscribe multiple times - should not throw
      expect(() => {
        subscription.unsubscribe()
        subscription.unsubscribe()
        subscription.unsubscribe()
      }).not.toThrow()
    })

    it('should handle non-Error exceptions', async () => {
      const mockStream = {
        responses: (async function* () {
          yield { data: 'test1' }
          throw 'String error' // Non-Error exception
        })(),
      }

      let statusCalled = false
      let errorDetails = ''
      const subscription = createStreamSubscription(
        mockStream,
        () => {},
        undefined,
        (status: StreamStatusResponse) => {
          statusCalled = true
          errorDetails = status.details || ''
        },
      )

      // Wait for error to occur
      await new Promise((resolve) => setTimeout(resolve, 100))

      expect(statusCalled).toBe(true)
      expect(errorDetails).toBe('Unknown stream error')

      subscription.unsubscribe()
    })

    it('should provide correct error code in status callback', async () => {
      const mockStream = {
        responses: (async function* () {
          throw new Error('Test error')
        })(),
      }

      let errorCode = 0
      const subscription = createStreamSubscription(
        mockStream,
        () => {},
        undefined,
        (status: StreamStatusResponse) => {
          errorCode = status.code
        },
      )

      // Wait for error to occur
      await new Promise((resolve) => setTimeout(resolve, 100))

      expect(errorCode).toBe(2) // gRPC internal error code

      subscription.unsubscribe()
    })
  })
})
