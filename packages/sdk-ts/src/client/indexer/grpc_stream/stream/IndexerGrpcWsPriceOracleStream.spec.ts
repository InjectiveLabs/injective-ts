import { vi } from 'vitest'
import { mockFactory } from '@injectivelabs/utils/test-utils'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { IndexerGrpcWsPriceOracleStream } from './IndexerGrpcWsPriceOracleStream.js'

const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const marketId = mockFactory.derivativeMarketId

describe('IndexerGrpcWsPriceOracleStream', () => {
  let wsPriceOracleStream: IndexerGrpcWsPriceOracleStream

  beforeEach(() => {
    wsPriceOracleStream = new IndexerGrpcWsPriceOracleStream(endpoints.indexer)
  })

  describe('constructor', () => {
    it('should create instance with endpoint', () => {
      expect(wsPriceOracleStream).toBeDefined()
      expect(wsPriceOracleStream).toBeInstanceOf(IndexerGrpcWsPriceOracleStream)
    })

    it('should create instance with endpoint and metadata', () => {
      const metadata = { 'x-custom-header': 'test-value' }
      const stream = new IndexerGrpcWsPriceOracleStream(
        endpoints.indexer,
        metadata,
      )

      expect(stream).toBeDefined()
      expect(stream).toBeInstanceOf(IndexerGrpcWsPriceOracleStream)
    })
  })

  describe('streamMarkets', () => {
    it('should create subscription with unsubscribe method', () => {
      const subscription = wsPriceOracleStream.streamMarkets({
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })

    it('should throw error if callback is not a function', () => {
      expect(() => {
        wsPriceOracleStream.streamMarkets({
          callback: null as any,
        })
      }).toThrow('callback must be a function')
    })

    it('should accept market and oracle filters', () => {
      const subscription = wsPriceOracleStream.streamMarkets({
        marketIds: [marketId],
        oracleTypes: ['pyth'],
        includeInactive: false,
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })
  })

  describe('streamMarketsV2', () => {
    it('should forward filters and mode', () => {
      const streamMarketsV2 = vi.fn().mockReturnValue({
        responses: (async function* emptyStream() {})(),
      })

      ;(wsPriceOracleStream as any).client = { streamMarketsV2 }

      const subscription = wsPriceOracleStream.streamMarketsV2({
        marketIds: [marketId],
        oracleTypes: ['pyth'],
        includeInactive: false,
        mode: 'light',
        callback: () => {},
      })

      const [request] = streamMarketsV2.mock.calls[0]

      expect(request).toMatchObject({
        marketIds: [marketId],
        oracleTypes: ['pyth'],
        includeInactive: false,
        mode: 'light',
      })
      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })

    it('should throw error if callback is not a function', () => {
      expect(() => {
        wsPriceOracleStream.streamMarketsV2({
          callback: null as any,
        })
      }).toThrow('callback must be a function')
    })
  })
})
