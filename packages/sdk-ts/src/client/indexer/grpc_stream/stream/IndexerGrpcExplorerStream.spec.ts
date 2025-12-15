import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { IndexerGrpcExplorerStream } from './IndexerGrpcExplorerStream.js'

const endpoints = getNetworkEndpoints(Network.MainnetSentry)

describe('IndexerGrpcExplorerStream', () => {
  let explorerStream: IndexerGrpcExplorerStream

  beforeEach(() => {
    explorerStream = new IndexerGrpcExplorerStream(endpoints.indexer)
  })

  describe('constructor', () => {
    it('should create instance with endpoint', () => {
      expect(explorerStream).toBeDefined()
      expect(explorerStream).toBeInstanceOf(IndexerGrpcExplorerStream)
    })

    it('should create instance with endpoint and metadata', () => {
      const metadata = { 'x-custom-header': 'test-value' }
      const stream = new IndexerGrpcExplorerStream(endpoints.indexer, metadata)

      expect(stream).toBeDefined()
      expect(stream).toBeInstanceOf(IndexerGrpcExplorerStream)
    })
  })

  describe('streamBlocks', () => {
    it('should create subscription with unsubscribe method', () => {
      const subscription = explorerStream.streamBlocks({
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })

    it('should throw error if callback is not a function', () => {
      expect(() => {
        explorerStream.streamBlocks({
          callback: null as any,
        })
      }).toThrow('callback must be a function')
    })

    it('should stop receiving callbacks after unsubscribe', async () => {
      let callbackCount = 0

      const subscription = explorerStream.streamBlocks({
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

  describe('streamBlocksWithTxs', () => {
    it('should create subscription with unsubscribe method', () => {
      const subscription = explorerStream.streamBlocksWithTxs({
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })

    it('should throw error if callback is not a function', () => {
      expect(() => {
        explorerStream.streamBlocksWithTxs({
          callback: null as any,
        })
      }).toThrow('callback must be a function')
    })
  })

  describe('streamTransactions', () => {
    it('should create subscription with unsubscribe method', () => {
      const subscription = explorerStream.streamTransactions({
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })

    it('should throw error if callback is not a function', () => {
      expect(() => {
        explorerStream.streamTransactions({
          callback: null as any,
        })
      }).toThrow('callback must be a function')
    })
  })
})
