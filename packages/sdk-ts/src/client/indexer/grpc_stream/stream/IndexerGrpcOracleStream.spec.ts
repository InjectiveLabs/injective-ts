import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { IndexerGrpcOracleStream } from './IndexerGrpcOracleStream.js'

const endpoints = getNetworkEndpoints(Network.MainnetSentry)

describe('IndexerGrpcOracleStream', () => {
  let oracleStream: IndexerGrpcOracleStream

  beforeEach(() => {
    oracleStream = new IndexerGrpcOracleStream(endpoints.indexer)
  })

  describe('constructor', () => {
    it('should create instance with endpoint', () => {
      expect(oracleStream).toBeDefined()
      expect(oracleStream).toBeInstanceOf(IndexerGrpcOracleStream)
    })

    it('should create instance with endpoint and metadata', () => {
      const metadata = { 'x-custom-header': 'test-value' }
      const stream = new IndexerGrpcOracleStream(endpoints.indexer, metadata)

      expect(stream).toBeDefined()
      expect(stream).toBeInstanceOf(IndexerGrpcOracleStream)
    })
  })

  describe('streamOraclePrices', () => {
    it('should create subscription with unsubscribe method', () => {
      const subscription = oracleStream.streamOraclePrices({
        oracleType: 'band',
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })

    it('should throw error if callback is not a function', () => {
      expect(() => {
        oracleStream.streamOraclePrices({
          oracleType: 'band',
          callback: null as any,
        })
      }).toThrow('callback must be a function')
    })

    it('should stop receiving callbacks after unsubscribe', async () => {
      let callbackCount = 0

      const subscription = oracleStream.streamOraclePrices({
        oracleType: 'band',
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

    it('should not call onEndCallback after unsubscribe', async () => {
      let endCalled = false

      const subscription = oracleStream.streamOraclePrices({
        oracleType: 'band',
        callback: () => {},
        onEndCallback: () => {
          endCalled = true
        },
      })

      subscription.unsubscribe()
      await new Promise((resolve) => setTimeout(resolve, 100))

      expect(endCalled).toBe(false)
    })
  })

  describe('streamOraclePricesByMarkets', () => {
    it('should create subscription with unsubscribe method', () => {
      const subscription = oracleStream.streamOraclePricesByMarkets({
        oracleType: 'band',
        baseSymbol: 'INJ',
        quoteSymbol: 'USDT',
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })

    it('should throw error if callback is not a function', () => {
      expect(() => {
        oracleStream.streamOraclePricesByMarkets({
          oracleType: 'band',
          baseSymbol: 'INJ',
          quoteSymbol: 'USDT',
          callback: null as any,
        })
      }).toThrow('callback must be a function')
    })
  })
})
