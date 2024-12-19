import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { IndexerGrpcAuctionTransformer } from '../transformers/index.js'
import { IndexerGrpcAuctionApi } from './IndexerGrpcAuctionApi.js'

const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const indexerGrpcAuctionApi = new IndexerGrpcAuctionApi(endpoints.indexer)

describe('IndexerGrpcAuctionApi', () => {
  test('fetchAuction', async () => {
    try {
      const response = await indexerGrpcAuctionApi.fetchAuction(-1)

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcAuctionTransformer.auctionResponseToAuction
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcAuctionApi.fetchAuction => ' + (e as any).message,
      )
    }
  })

  test('fetchAuctions', async () => {
    try {
      const response = await indexerGrpcAuctionApi.fetchAuctions()

      if (response.length === 0) {
        console.warn('fetchSubaccountHistory.auctionsIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcAuctionTransformer.auctionsResponseToAuctions
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcAuctionApi.fetchAuctions => ' + (e as any).message,
      )
    }
  })

  test('fetchInjBurnt', async () => {
    try {
      const response = await indexerGrpcAuctionApi.fetchInjBurnt()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcAuctionTransformer.injBurntResponseToInjBurnt
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcAuctionApi.fetchInjBurnt => ' + (e as any).message,
      )
    }
  })
})
