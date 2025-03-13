import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { IndexerGrpcMetaApi } from './IndexerGrpcMetaApi.js'

const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const indexerGrpcMetaApi = new IndexerGrpcMetaApi(endpoints.indexer)

describe('IndexerGrpcMetaApi', () => {
  test('fetchPing', async () => {
    try {
      const response = await indexerGrpcMetaApi.fetchPing()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<typeof response>(response),
      )
    } catch (e) {
      console.error('IndexerGrpcMetaApi.fetchPing => ' + (e as any).message)
    }
  })

  test('fetchVersion', async () => {
    try {
      const response = await indexerGrpcMetaApi.fetchVersion()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<typeof response>(response),
      )
    } catch (e) {
      console.error('IndexerGrpcMetaApi.fetchVersion => ' + (e as any).message)
    }
  })

  test('fetchInfo', async () => {
    try {
      const response = await indexerGrpcMetaApi.fetchInfo()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<typeof response>(response),
      )
    } catch (e) {
      console.error('IndexerGrpcMetaApi.fetchInfo => ' + (e as any).message)
    }
  })
})
