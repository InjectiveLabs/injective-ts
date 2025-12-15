import { mockFactory } from '@injectivelabs/utils/test-utils'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { IndexerGrpcMitoStream } from './IndexerGrpcMitoStream.js'

const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const injectiveAddress = mockFactory.injectiveAddress
const stakingContractAddress = 'inj1pxzykc8qry3ytxwxr3ua72tn6e4wvusj40yy2w'

describe('IndexerGrpcMitoStream', () => {
  let mitoStream: IndexerGrpcMitoStream

  beforeEach(() => {
    mitoStream = new IndexerGrpcMitoStream(endpoints.indexer)
  })

  describe('constructor', () => {
    it('should create instance with endpoint', () => {
      expect(mitoStream).toBeDefined()
      expect(mitoStream).toBeInstanceOf(IndexerGrpcMitoStream)
    })

    it('should create instance with endpoint and metadata', () => {
      const metadata = { 'x-custom-header': 'test-value' }
      const stream = new IndexerGrpcMitoStream(endpoints.indexer, metadata)

      expect(stream).toBeDefined()
      expect(stream).toBeInstanceOf(IndexerGrpcMitoStream)
    })
  })

  describe('streamVault', () => {
    it('should create subscription with unsubscribe method', () => {
      const subscription = mitoStream.streamVault({
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })

    it('should throw error if callback is not a function', () => {
      expect(() => {
        mitoStream.streamVault({
          callback: null as any,
        })
      }).toThrow('callback must be a function')
    })
  })

  describe('streamTransfers', () => {
    it('should create subscription with unsubscribe method', () => {
      const subscription = mitoStream.streamTransfers({
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })
  })

  describe('streamVaultHolderSubscriptions', () => {
    it('should create subscription with unsubscribe method', () => {
      const subscription = mitoStream.streamVaultHolderSubscriptions({
        holderAddress: injectiveAddress,
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })
  })

  describe('streamStakingRewardsByAccount', () => {
    it('should create subscription with unsubscribe method', () => {
      const subscription = mitoStream.streamStakingRewardsByAccount({
        staker: injectiveAddress,
        stakingContractAddress: stakingContractAddress,
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })
  })

  describe('streamHistoricalStaking', () => {
    it('should create subscription with unsubscribe method', () => {
      const subscription = mitoStream.streamHistoricalStaking({
        staker: injectiveAddress,
        stakingContractAddress: stakingContractAddress,
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })
  })
})
