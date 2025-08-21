import { mockFactory } from '@injectivelabs/utils/test-utils'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { IndexerGrpcMegaVaultTransformer } from '../transformers/index.js'
import { IndexerGrpcMegaVaultApi } from './IndexerGrpcMegaVaultApi.js'

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
            typeof IndexerGrpcMegaVaultTransformer.getVaultResponseToVault
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
        vaultAddress: mockVaultAddress,
        userAddress: injectiveAddress,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcMegaVaultTransformer.getUserResponseToUser
          >
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
        vaultAddress: mockVaultAddress,
        userAddress: injectiveAddress,
        status: 'active',
        perPage: 10,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcMegaVaultTransformer.listSubscriptionsResponseToSubscriptions
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
        vaultAddress: mockVaultAddress,
        userAddress: injectiveAddress,
        status: 'pending',
        perPage: 10,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcMegaVaultTransformer.listRedemptionsResponseToRedemptions
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
            typeof IndexerGrpcMegaVaultTransformer.getOperatorRedemptionBucketsResponseToOperatorRedemptionBuckets
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
        vaultAddress: mockVaultAddress,
        since,
        maxDataPoints: 100,
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
        vaultAddress: mockVaultAddress,
        since,
        maxDataPoints: 100,
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
