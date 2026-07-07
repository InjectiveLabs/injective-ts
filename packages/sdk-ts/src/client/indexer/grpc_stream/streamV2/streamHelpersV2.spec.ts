import { createStreamSubscriptionV2 } from './streamHelpersV2.js'

describe('streamHelpersV2', () => {
  describe('createStreamSubscriptionV2', () => {
    it('should pass an abort signal to the stream factory and abort it on unsubscribe', () => {
      let receivedAbortSignal: AbortSignal | undefined

      const subscription = createStreamSubscriptionV2(
        (abortSignal) => {
          receivedAbortSignal = abortSignal

          return {
            responses: (async function* emptyStream() {})(),
          }
        },
        () => {},
      )

      expect(receivedAbortSignal).toBeDefined()
      expect(receivedAbortSignal?.aborted).toBe(false)

      subscription.unsubscribe()

      expect(receivedAbortSignal?.aborted).toBe(true)
    })
  })
})
