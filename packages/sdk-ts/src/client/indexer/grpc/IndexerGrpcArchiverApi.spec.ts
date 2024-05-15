import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { mockFactory } from '@injectivelabs/test-utils'
import { IndexerGrpcArchiverTransformer } from '../transformers'
import { IndexerGrpcArchiverApi } from './IndexerGrpcArchiverApi'

const account = mockFactory.injectiveAddress
const resolution = '1D'
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
})
