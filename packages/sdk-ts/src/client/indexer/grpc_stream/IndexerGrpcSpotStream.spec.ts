import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { IndexerGrpcSpotStream } from './IndexerGrpcSpotStream.js'

const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const mockMarketId =
  '0x0611780ba69656949525013d947713300f56c37b6175e02f26bffa495c3208fe'

describe('IndexerGrpcSpotStream', () => {
  let spotStream: IndexerGrpcSpotStream

  beforeEach(() => {
    spotStream = new IndexerGrpcSpotStream(endpoints.indexer)
  })

  describe('constructor', () => {
    it('should create instance with endpoint', () => {
      expect(spotStream).toBeDefined()
      expect(spotStream).toBeInstanceOf(IndexerGrpcSpotStream)
    })

    it('should create instance with endpoint and metadata', () => {
      const metadata = { 'x-custom-header': 'test-value' }
      const stream = new IndexerGrpcSpotStream(endpoints.indexer, metadata)

      expect(stream).toBeDefined()
      expect(stream).toBeInstanceOf(IndexerGrpcSpotStream)
    })
  })

  describe('streamMarkets', () => {
    it('should create subscription with unsubscribe method', () => {
      const subscription = spotStream.streamMarkets({
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })

    it('should throw error if callback is not a function', () => {
      expect(() => {
        spotStream.streamMarkets({
          callback: null as any,
        })
      }).toThrow('callback must be a function')
    })

    it('should stop receiving callbacks after unsubscribe', async () => {
      let callbackCount = 0

      const subscription = spotStream.streamMarkets({
        callback: () => {
          callbackCount++
        },
      })

      await new Promise((resolve) => setTimeout(resolve, 100))
      const countAfterWait = callbackCount

      subscription.unsubscribe()
      await new Promise((resolve) => setTimeout(resolve, 200))

      expect(callbackCount).toBe(countAfterWait)
    })
  })

  describe('streamOrderbooksV2', () => {
    it('should create subscription with unsubscribe method', () => {
      const subscription = spotStream.streamOrderbooksV2({
        marketIds: [mockMarketId],
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })

    it('should throw error if callback is not a function', () => {
      expect(() => {
        spotStream.streamOrderbooksV2({
          marketIds: [mockMarketId],
          callback: null as any,
        })
      }).toThrow('callback must be a function')
    })

    it('should handle orderbook stream cancellation', async () => {
      let callbackCount = 0

      const subscription = spotStream.streamOrderbooksV2({
        marketIds: [mockMarketId],
        callback: () => {
          callbackCount++
        },
      })

      await new Promise((resolve) => setTimeout(resolve, 100))
      const countAfterWait = callbackCount

      subscription.unsubscribe()
      await new Promise((resolve) => setTimeout(resolve, 200))

      expect(callbackCount).toBe(countAfterWait)
    })
  })

  describe('streamOrderbookUpdates', () => {
    it('should create subscription with unsubscribe method', () => {
      const subscription = spotStream.streamOrderbookUpdates({
        marketIds: [mockMarketId],
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })
  })

  describe('streamOrders', () => {
    it('should create subscription with unsubscribe method', () => {
      const subscription = spotStream.streamOrders({
        marketId: mockMarketId,
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })
  })

  describe('streamTrades', () => {
    it('should create subscription with unsubscribe method', () => {
      const subscription = spotStream.streamTrades({
        marketId: mockMarketId,
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })
  })
})
