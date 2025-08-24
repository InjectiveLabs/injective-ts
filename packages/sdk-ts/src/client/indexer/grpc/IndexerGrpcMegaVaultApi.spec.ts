import { mockFactory } from '@injectivelabs/utils/test-utils'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { IndexerGrpcMegaVaultApi } from './IndexerGrpcMegaVaultApi.js'
import { IndexerGrpcMegaVaultTransformer } from '../transformers/index.js'

const injectiveAddress = mockFactory.injectiveAddress
const endpoints = getNetworkEndpoints(Network.Devnet1)
const indexerGrpcMegaVaultApi = new IndexerGrpcMegaVaultApi(endpoints.indexer)

const mockVaultAddress = 'inj1djlhetddzrztjn4v0s4vt0dca3y8hwshkh37zg'
const mockOperatorAddress = 'inj1djlhetddzrztjn4v0s4vt0dca3operator0001'

describe('IndexerGrpcMegaVaultApi', () => {
  test('fetchVault', async () => {
    try {
      const response = await indexerGrpcMegaVaultApi.fetchVault({
        vaultAddress: mockVaultAddress,
      })

      expect(response).toBeDefined()

      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcMegaVaultTransformer.vaultResponseToVault
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcMegaVaultApi.fetchVault => ' + (e as any).message,
      )
    }
  })

  test('fetchVaultUser', async () => {
    try {
      const response = await indexerGrpcMegaVaultApi.fetchVaultUser({
        userAddress: injectiveAddress,
        vaultAddress: mockVaultAddress,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<typeof IndexerGrpcMegaVaultTransformer.userResponseToUser>
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcMegaVaultApi.fetchVaultUser => ' + (e as any).message,
      )
    }
  })

  test('fetchVaultSubscriptions', async () => {
    try {
      const response = await indexerGrpcMegaVaultApi.fetchVaultSubscriptions({
        perPage: 10,
        status: 'active',
        userAddress: injectiveAddress,
        vaultAddress: mockVaultAddress,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcMegaVaultTransformer.subscriptionsResponseToSubscriptions
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcMegaVaultApi.fetchVaultSubscriptions => ' +
          (e as any).message,
      )
    }
  })

  test('fetchVaultRedemptions', async () => {
    try {
      const response = await indexerGrpcMegaVaultApi.fetchVaultRedemptions({
        perPage: 10,
        status: 'pending',
        userAddress: injectiveAddress,
        vaultAddress: mockVaultAddress,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcMegaVaultTransformer.redemptionsResponseToRedemptions
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcMegaVaultApi.fetchVaultRedemptions => ' +
          (e as any).message,
      )
    }
  })

  test('fetchOperatorRedemptionBuckets', async () => {
    try {
      const response =
        await indexerGrpcMegaVaultApi.fetchOperatorRedemptionBuckets({
          vaultAddress: mockVaultAddress,
          operatorAddress: mockOperatorAddress,
        })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcMegaVaultTransformer.operatorRedemptionBucketsResponseToOperatorRedemptionBuckets
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcMegaVaultApi.fetchOperatorRedemptionBuckets => ' +
          (e as any).message,
      )
    }
  })

  test('fetchVaultTvlHistory', async () => {
    try {
      const since = Date.now() - 7 * 24 * 60 * 60 * 1000 // 7 days ago
      const response = await indexerGrpcMegaVaultApi.fetchVaultTvlHistory({
        since,
        maxDataPoints: 100,
        vaultAddress: mockVaultAddress,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcMegaVaultTransformer.tvlHistoryResponseToTvlHistory
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcMegaVaultApi.fetchVaultTvlHistory => ' + (e as any).message,
      )
    }
  })

  test('fetchVaultPnlHistory', async () => {
    try {
      const since = Date.now() - 7 * 24 * 60 * 60 * 1000 // 7 days ago
      const response = await indexerGrpcMegaVaultApi.fetchVaultPnlHistory({
        since,
        maxDataPoints: 100,
        vaultAddress: mockVaultAddress,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcMegaVaultTransformer.pnlHistoryResponseToPnlHistory
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcMegaVaultApi.fetchVaultPnlHistory => ' + (e as any).message,
      )
    }
  })
})
