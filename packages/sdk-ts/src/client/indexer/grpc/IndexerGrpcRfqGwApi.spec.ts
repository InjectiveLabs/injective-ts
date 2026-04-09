import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { IndexerGrpcRfqGwApi } from './IndexerGrpcRfqGwApi.js'
import type { IndexerGrpcRfqGwTransformer } from '../transformers/index.js'

const endpoints = getNetworkEndpoints(Network.Mainnet)
const indexerGrpcRfqGwApi = new IndexerGrpcRfqGwApi(endpoints.indexer)

describe('IndexerGrpcRfqGwApi', () => {
  test('fetchPrepare', async () => {
    try {
      const response = await indexerGrpcRfqGwApi.fetchPrepare({
        clientId: 'test-client-id',
        marketId:
          '0x17ef48032cb24375ba7c2e39f384e56433bcab20cbee9a7357e4cba2eb00abe6',
        direction: 'LONG',
        margin: '1000000000000000000',
        quantity: '1000000000000000000',
        worstPrice: '1000000000000000000',
        takerAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
        takerPubKey: '0x1234567890abcdef',
        takerAccountNumber: 0,
        takerAccountSequence: 0,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcRfqGwTransformer.prepareResponseToPrepareResponse
          >
        >(response),
      )
    } catch (e) {
      console.error('IndexerGrpcRfqGwApi.fetchPrepare => ' + (e as any).message)
    }
  })
})
