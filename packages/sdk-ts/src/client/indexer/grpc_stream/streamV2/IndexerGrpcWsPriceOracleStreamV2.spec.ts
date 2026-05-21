import { mockFactory } from '@injectivelabs/utils/test-utils'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { IndexerGrpcWsPriceOracleStreamV2 } from './IndexerGrpcWsPriceOracleStreamV2.js'

const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const marketId = mockFactory.derivativeMarketId

describe('IndexerGrpcWsPriceOracleStreamV2', () => {
  let wsPriceOracleStream: IndexerGrpcWsPriceOracleStreamV2

  beforeEach(() => {
    wsPriceOracleStream = new IndexerGrpcWsPriceOracleStreamV2(
      endpoints.indexer,
    )
  })

  describe('constructor', () => {
    it('should create instance with endpoint', () => {
      expect(wsPriceOracleStream).toBeDefined()
      expect(wsPriceOracleStream).toBeInstanceOf(
        IndexerGrpcWsPriceOracleStreamV2,
      )
    })

    it('should create instance with endpoint and metadata', () => {
      const metadata = { 'x-custom-header': 'test-value' }
      const stream = new IndexerGrpcWsPriceOracleStreamV2(
        endpoints.indexer,
        metadata,
      )

      expect(stream).toBeDefined()
      expect(stream).toBeInstanceOf(IndexerGrpcWsPriceOracleStreamV2)
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
})
