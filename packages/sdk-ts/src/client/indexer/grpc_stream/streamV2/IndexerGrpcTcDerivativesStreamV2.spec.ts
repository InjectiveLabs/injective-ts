import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { IndexerGrpcTcDerivativesStreamV2 } from './IndexerGrpcTcDerivativesStreamV2.js'

const endpoints = getNetworkEndpoints(Network.MainnetSentry)

describe('IndexerGrpcTcDerivativesStreamV2', () => {
  let tcDerivativesStream: IndexerGrpcTcDerivativesStreamV2

  beforeEach(() => {
    tcDerivativesStream = new IndexerGrpcTcDerivativesStreamV2(
      endpoints.indexer,
    )
  })

  describe('constructor', () => {
    it('should create instance with endpoint', () => {
      expect(tcDerivativesStream).toBeDefined()
      expect(tcDerivativesStream).toBeInstanceOf(
        IndexerGrpcTcDerivativesStreamV2,
      )
    })

    it('should create instance with endpoint and metadata', () => {
      const metadata = { 'x-custom-header': 'test-value' }
      const stream = new IndexerGrpcTcDerivativesStreamV2(
        endpoints.indexer,
        metadata,
      )

      expect(stream).toBeDefined()
      expect(stream).toBeInstanceOf(IndexerGrpcTcDerivativesStreamV2)
    })
  })

  describe('streamOrdersHistory', () => {
    it('should create subscription with unsubscribe method', () => {
      const subscription = tcDerivativesStream.streamOrdersHistory({
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })

    it('should throw error if callback is not a function', () => {
      expect(() => {
        tcDerivativesStream.streamOrdersHistory({
          callback: null as any,
        })
      }).toThrow('callback must be a function')
    })

    it('should accept marketId and accountAddress parameters', () => {
      const subscription = tcDerivativesStream.streamOrdersHistory({
        marketId:
          '0x17ef48032cb24375ba7c2e39f384e56433bcab20cbee9a7357e4cba2eb00abe6',
        accountAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })
  })

  describe('streamTrades', () => {
    it('should create subscription with unsubscribe method', () => {
      const subscription = tcDerivativesStream.streamTrades({
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })

    it('should throw error if callback is not a function', () => {
      expect(() => {
        tcDerivativesStream.streamTrades({
          callback: null as any,
        })
      }).toThrow('callback must be a function')
    })

    it('should accept marketId and accountAddress parameters', () => {
      const subscription = tcDerivativesStream.streamTrades({
        marketId:
          '0x17ef48032cb24375ba7c2e39f384e56433bcab20cbee9a7357e4cba2eb00abe6',
        accountAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })
  })

  describe('streamPositions', () => {
    it('should create subscription with unsubscribe method', () => {
      const subscription = tcDerivativesStream.streamPositions({
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })

    it('should throw error if callback is not a function', () => {
      expect(() => {
        tcDerivativesStream.streamPositions({
          callback: null as any,
        })
      }).toThrow('callback must be a function')
    })

    it('should accept marketId and accountAddress parameters', () => {
      const subscription = tcDerivativesStream.streamPositions({
        marketId:
          '0x17ef48032cb24375ba7c2e39f384e56433bcab20cbee9a7357e4cba2eb00abe6',
        accountAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })
  })

  describe('streamOrders', () => {
    it('should create subscription with unsubscribe method', () => {
      const subscription = tcDerivativesStream.streamOrders({
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })

    it('should throw error if callback is not a function', () => {
      expect(() => {
        tcDerivativesStream.streamOrders({
          callback: null as any,
        })
      }).toThrow('callback must be a function')
    })

    it('should accept marketId and accountAddress parameters', () => {
      const subscription = tcDerivativesStream.streamOrders({
        marketId:
          '0x17ef48032cb24375ba7c2e39f384e56433bcab20cbee9a7357e4cba2eb00abe6',
        accountAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })
  })
})
