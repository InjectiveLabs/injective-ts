import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { IndexerGrpcRfqGwApi } from './IndexerGrpcRfqGwApi.js'
import type { IndexerGrpcRfqGwTransformer } from '../transformers/index.js'

const endpoints = getNetworkEndpoints(Network.Mainnet)
const indexerGrpcRfqGwApi = new IndexerGrpcRfqGwApi(endpoints.indexer)

describe('IndexerGrpcRfqGwApi', () => {
  test('fetchPrepare', async () => {
    try {
      const response = await indexerGrpcRfqGwApi.fetchPrepare({
        direction: 'LONG',
        takerAccountNumber: 0,
        takerAccountSequence: 0,
        clientId: 'test-client-id',
        margin: '1000000000000000000',
        quantity: '1000000000000000000',
        worstPrice: '1000000000000000000',
        takerPubKey: '0x1234567890abcdef',
        takerAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
        marketId:
          '0x17ef48032cb24375ba7c2e39f384e56433bcab20cbee9a7357e4cba2eb00abe6',
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

  test('fetchPrepareAutoSign', async () => {
    try {
      const response = await indexerGrpcRfqGwApi.fetchPrepareAutoSign({
        direction: 'LONG',
        autosignAccountNumber: 0,
        clientId: 'test-client-id',
        autosignAccountSequence: 0,
        margin: '1000000000000000000',
        quantity: '1000000000000000000',
        worstPrice: '1000000000000000000',
        autosignPubKey: '0x1234567890abcdef',
        autosignAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
        marketId:
          '0x17ef48032cb24375ba7c2e39f384e56433bcab20cbee9a7357e4cba2eb00abe6',
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcRfqGwTransformer.prepareAutoSignResponseToResponse
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcRfqGwApi.fetchPrepareAutoSign => ' + (e as any).message,
      )
    }
  })

  test('fetchPrepareEip712', async () => {
    try {
      const response = await indexerGrpcRfqGwApi.fetchPrepareEip712({
        direction: 'LONG',
        takerAccountNumber: 0,
        takerAccountSequence: 0,
        clientId: 'test-client-id',
        margin: '1000000000000000000',
        quantity: '1000000000000000000',
        worstPrice: '1000000000000000000',
        takerPubKey: '0x1234567890abcdef',
        takerAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
        marketId:
          '0x17ef48032cb24375ba7c2e39f384e56433bcab20cbee9a7357e4cba2eb00abe6',
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcRfqGwTransformer.prepareEip712ResponseToResponse
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcRfqGwApi.fetchPrepareEip712 => ' + (e as any).message,
      )
    }
  })
})
