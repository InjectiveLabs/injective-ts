import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { IndexerGrpcDerivativesStream } from './IndexerGrpcDerivativesStream.js'

const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const mockMarketId =
  '0x17ef48032cb24375ba7c2e39f384e56433bcab20cbee9a7357e4cba2eb00abe6'

describe('IndexerGrpcDerivativesStream', () => {
  let derivativesStream: IndexerGrpcDerivativesStream

  beforeEach(() => {
    derivativesStream = new IndexerGrpcDerivativesStream(endpoints.indexer)
  })

  describe('constructor', () => {
    it('should create instance with endpoint', () => {
      expect(derivativesStream).toBeDefined()
      expect(derivativesStream).toBeInstanceOf(IndexerGrpcDerivativesStream)
    })

    it('should create instance with endpoint and metadata', () => {
      const metadata = { 'x-custom-header': 'test-value' }
      const stream = new IndexerGrpcDerivativesStream(
        endpoints.indexer,
        metadata,
      )

      expect(stream).toBeDefined()
      expect(stream).toBeInstanceOf(IndexerGrpcDerivativesStream)
    })
  })

  describe('streamMarkets', () => {
    it('should create subscription with unsubscribe method', () => {
      const subscription = derivativesStream.streamMarkets({
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })

    it('should throw error if callback is not a function', () => {
      expect(() => {
        derivativesStream.streamMarkets({
          callback: null as any,
        })
      }).toThrow('callback must be a function')
    })

    it('should stop receiving callbacks after unsubscribe', async () => {
      let callbackCount = 0

      const subscription = derivativesStream.streamMarkets({
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

  describe('streamPositions', () => {
    it('should create subscription with unsubscribe method', () => {
      const subscription = derivativesStream.streamPositions({
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })

    it('should handle position stream cancellation', async () => {
      let callbackCount = 0

      const subscription = derivativesStream.streamPositions({
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
      const subscription = derivativesStream.streamOrderbooksV2({
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
      const subscription = derivativesStream.streamOrders({
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
      const subscription = derivativesStream.streamTrades({
        marketId: mockMarketId,
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })
  })
})
