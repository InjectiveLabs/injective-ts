import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { IndexerGrpcAuctionApi } from './IndexerGrpcAuctionApi.js'
import type { IndexerGrpcAuctionTransformer } from '../transformers/index.js'

const endpoints = getNetworkEndpoints(Network.Mainnet)
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
      expect(typeof response).toBe('number')
    } catch (e) {
      console.error(
        'IndexerGrpcAuctionApi.fetchInjBurnt => ' + (e as any).message,
      )
    }
  })

  test('fetchAuctionsHistoryV2', async () => {
    try {
      const response = await indexerGrpcAuctionApi.fetchAuctionsHistoryV2({})

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcAuctionTransformer.auctionsHistoryV2ResponseToAuctionHistory
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcAuctionApi.fetchAuctionsHistoryV2 => ' + (e as any).message,
      )
    }
  })

  test('fetchAuctionV2', async () => {
    try {
      const response = await indexerGrpcAuctionApi.fetchAuctionV2()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcAuctionTransformer.grpcAuctionV2ToAuctionV2
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcAuctionApi.fetchAuctionV2 => ' + (e as any).message,
      )
    }
  })

  test('fetchAccountAuctionsV2', async () => {
    try {
      const response = await indexerGrpcAuctionApi.fetchAccountAuctionsV2({
        address: 'inj17gkuet8f6pssxd8nycm3qr9d9y699rupv6397z',
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcAuctionTransformer.accountAuctionsV2ResponseToAccountAuctionsV2
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcAuctionApi.fetchAccountAuctionsV2 => ' + (e as any).message,
      )
    }
  })
})
