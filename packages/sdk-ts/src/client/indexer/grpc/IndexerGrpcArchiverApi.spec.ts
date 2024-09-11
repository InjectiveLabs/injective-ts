import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { INJ_DENOM } from '@injectivelabs/utils'
import { mockFactory } from '@injectivelabs/test-utils'
import { IndexerGrpcArchiverTransformer } from '../transformers'
import { IndexerGrpcArchiverApi } from './IndexerGrpcArchiverApi'

const account = mockFactory.injectiveAddress
const resolution = '1D'
const startDate = '1622505600'
const endDate = '1625097600'
const limit = 10
const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const indexerGrpcArchiverApi = new IndexerGrpcArchiverApi(endpoints.indexer)

describe('IndexerGrpcArchiverApi', () => {
  test('fetchHistoricalBalance', async () => {
    try {
      const response = await indexerGrpcArchiverApi.fetchHistoricalBalance({
        account,
        resolution,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcArchiverTransformer.grpcHistoricalBalanceResponseToHistoricalBalances
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcArchiverApi.fetchHistoricalBalance => ' +
          (e as any).message,
      )
    }
  })

  test('fetchHistoricalRpnl', async () => {
    try {
      const response = await indexerGrpcArchiverApi.fetchHistoricalRpnl({
        account,
        resolution,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcArchiverTransformer.grpcHistoricalRPNLResponseToHistoricalRPNL
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcArchiverApi.fetchHistoricalRpnl => ' + (e as any).message,
      )
    }
  })

  test('fetchHistoricalVolumes', async () => {
    try {
      const response = await indexerGrpcArchiverApi.fetchHistoricalVolumes({
        account,
        resolution,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcArchiverTransformer.grpcHistoricalVolumesResponseToHistoricalVolumes
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcArchiverApi.fetchHistoricalVolumes => ' +
          (e as any).message,
      )
    }
  })

  test('fetchPnlLeaderboard', async () => {
    try {
      const response = await indexerGrpcArchiverApi.fetchPnlLeaderboard({
        startDate,
        endDate,
        limit,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcArchiverTransformer.grpcPnlLeaderboardResponseToPnlLeaderboard
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcArchiverApi.fetchPnlLeaderboard => ' + (e as any).message,
      )
    }
  })

  test('fetchVolLeaderboard', async () => {
    try {
      const response = await indexerGrpcArchiverApi.fetchVolLeaderboard({
        startDate,
        endDate,
        limit,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcArchiverTransformer.grpcVolLeaderboardResponseToVolLeaderboard
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcArchiverApi.fetchVolLeaderboard => ' + (e as any).message,
      )
    }
  })

  test('fetchPnlLeaderboardFixedResolution', async () => {
    try {
      const response =
        await indexerGrpcArchiverApi.fetchPnlLeaderboardFixedResolution({
          resolution,
          limit,
        })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcArchiverTransformer.grpcPnlLeaderboardFixedResolutionResponseToPnlLeaderboard
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcArchiverApi.fetchPnlLeaderboardFixedResolution => ' +
          (e as any).message,
      )
    }
  })

  test('fetchVolLeaderboardFixedResolution', async () => {
    try {
      const response =
        await indexerGrpcArchiverApi.fetchVolLeaderboardFixedResolution({
          resolution,
          limit,
        })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcArchiverTransformer.grpcVolLeaderboardFixedResolutionResponseToVolLeaderboard
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcArchiverApi.fetchVolLeaderboardFixedResolution => ' +
          (e as any).message,
      )
    }
  })

  test('fetchDenomHolders', async () => {
    try {
      const response = await indexerGrpcArchiverApi.fetchDenomHolders({
        denom: INJ_DENOM,
        limit,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcArchiverTransformer.grpcDenomHoldersResponseToDenomHolders
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcArchiverApi.fetchDenomHolders => ' + (e as any).message,
      )
    }
  })
})
