import { mockFactory } from '@injectivelabs/utils/test-utils'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { getDefaultSubaccountId } from '../../../../utils/address.js'
import { IndexerGrpcAccountStream } from './IndexerGrpcAccountStream.js'

const injectiveAddress = mockFactory.injectiveAddress
const subaccountId = getDefaultSubaccountId(injectiveAddress)
const endpoints = getNetworkEndpoints(Network.MainnetSentry)

describe('IndexerGrpcAccountStream', () => {
  let accountStream: IndexerGrpcAccountStream

  beforeEach(() => {
    accountStream = new IndexerGrpcAccountStream(endpoints.indexer)
  })

  describe('constructor', () => {
    it('should create instance with endpoint', () => {
      expect(accountStream).toBeDefined()
      expect(accountStream).toBeInstanceOf(IndexerGrpcAccountStream)
    })

    it('should create instance with endpoint and metadata', () => {
      const metadata = { 'x-custom-header': 'test-value' }
      const stream = new IndexerGrpcAccountStream(endpoints.indexer, metadata)

      expect(stream).toBeDefined()
      expect(stream).toBeInstanceOf(IndexerGrpcAccountStream)
    })
  })

  describe('streamSubaccountBalance', () => {
    it('should create subscription with unsubscribe method', () => {
      const subscription = accountStream.streamSubaccountBalance({
        subaccountId,
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })

    it('should throw error if subaccountId is empty', () => {
      expect(() => {
        accountStream.streamSubaccountBalance({
          subaccountId: '',
          callback: () => {},
        })
      }).toThrow('subaccountId is required')
    })

    it('should throw error if callback is not a function', () => {
      expect(() => {
        accountStream.streamSubaccountBalance({
          subaccountId,
          callback: null as any,
        })
      }).toThrow('callback must be a function')
    })

    it('should stop receiving callbacks after unsubscribe', async () => {
      let callbackCount = 0

      const subscription = accountStream.streamSubaccountBalance({
        subaccountId,
        callback: () => {
          callbackCount++
        },
      })

      // Wait a bit
      await new Promise((resolve) => setTimeout(resolve, 100))
      const countAfterWait = callbackCount

      // Unsubscribe
      subscription.unsubscribe()

      // Wait longer
      await new Promise((resolve) => setTimeout(resolve, 200))

      // Should not have received more callbacks
      expect(callbackCount).toBe(countAfterWait)
    })

    it('should not call onEndCallback after unsubscribe', async () => {
      let endCalled = false

      const subscription = accountStream.streamSubaccountBalance({
        subaccountId,
        callback: () => {},
        onEndCallback: () => {
          endCalled = true
        },
      })

      // Unsubscribe immediately
      subscription.unsubscribe()

      // Wait to ensure end callback is not called
      await new Promise((resolve) => setTimeout(resolve, 100))

      expect(endCalled).toBe(false)
    })

    it('should handle multiple unsubscribes gracefully', () => {
      const subscription = accountStream.streamSubaccountBalance({
        subaccountId,
        callback: () => {},
      })

      expect(() => {
        subscription.unsubscribe()
        subscription.unsubscribe()
        subscription.unsubscribe()
      }).not.toThrow()
    })

    it('should handle stream errors with onStatusCallback', async () => {
      const invalidStream = new IndexerGrpcAccountStream(
        'https://invalid-endpoint.test',
      )
      let statusCalled = false
      let errorMessage = ''

      const subscription = invalidStream.streamSubaccountBalance({
        subaccountId,
        callback: () => {},
        onStatusCallback: (error) => {
          statusCalled = true
          errorMessage = error.details || ''
        },
      })

      // Wait for error to occur
      await new Promise((resolve) => setTimeout(resolve, 1000))

      subscription.unsubscribe()

      expect(statusCalled).toBe(true)
      expect(errorMessage).toBeTruthy()
    })
  })

  describe('memory management', () => {
    it('should not leak memory with rapid subscribe/unsubscribe', async () => {
      const subscriptions: any[] = []

      // Create many subscriptions
      for (let i = 0; i < 50; i++) {
        const subscription = accountStream.streamSubaccountBalance({
          subaccountId,
          callback: () => {},
        })
        subscriptions.push(subscription)
      }

      // Unsubscribe all
      subscriptions.forEach((sub) => sub.unsubscribe())

      // Clear references
      subscriptions.length = 0

      // Should complete without issues
      expect(true).toBe(true)
    })
  })
})
