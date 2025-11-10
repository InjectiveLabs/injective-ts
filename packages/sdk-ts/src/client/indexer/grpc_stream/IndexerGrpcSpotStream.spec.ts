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

  describe('streamSpotMarket', () => {
    it('should create subscription with unsubscribe method', () => {
      const subscription = spotStream.streamSpotMarket({
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })

    it('should throw error if callback is not a function', () => {
      expect(() => {
        spotStream.streamSpotMarket({
          callback: null as any,
        })
      }).toThrow('callback must be a function')
    })

    it('should stop receiving callbacks after unsubscribe', async () => {
      let callbackCount = 0

      const subscription = spotStream.streamSpotMarket({
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

  describe('streamSpotOrderbookV2', () => {
    it('should create subscription with unsubscribe method', () => {
      const subscription = spotStream.streamSpotOrderbookV2({
        marketIds: [mockMarketId],
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })

    it('should throw error if callback is not a function', () => {
      expect(() => {
        spotStream.streamSpotOrderbookV2({
          marketIds: [mockMarketId],
          callback: null as any,
        })
      }).toThrow('callback must be a function')
    })

    it('should handle orderbook stream cancellation', async () => {
      let callbackCount = 0

      const subscription = spotStream.streamSpotOrderbookV2({
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

  describe('streamSpotOrderbookUpdate', () => {
    it('should create subscription with unsubscribe method', () => {
      const subscription = spotStream.streamSpotOrderbookUpdate({
        marketIds: [mockMarketId],
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })
  })

  describe('streamSpotOrders', () => {
    it('should create subscription with unsubscribe method', () => {
      const subscription = spotStream.streamSpotOrders({
        marketId: mockMarketId,
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })
  })

  describe('streamSpotTrades', () => {
    it('should create subscription with unsubscribe method', () => {
      const subscription = spotStream.streamSpotTrades({
        marketId: mockMarketId,
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })
  })
})
