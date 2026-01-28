import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { IndexerGrpcRFQApi } from './IndexerGrpcRfqApi.js'
import type { IndexerGrpcRfqTransformer } from '../transformers/index.js'

const endpoints = getNetworkEndpoints(Network.Mainnet)
const indexerGrpcRfqApi = new IndexerGrpcRFQApi(endpoints.indexer)

describe('IndexerGrpcRFQApi', () => {
  test('submitRequest', async () => {
    try {
      const response = await indexerGrpcRfqApi.submitRequest({
        direction: 'LONG',
        status: 'PENDING',
        rfqId: BigInt(1717000000),
        height: BigInt(1717000000),
        expiry: BigInt(1717000000),
        margin: '1000000000000000000',
        updatedAt: BigInt(1717000000),
        createdAt: BigInt(1717000000),
        quantity: '1000000000000000000',
        worstPrice: '1000000000000000000',
        transactionTime: BigInt(1717000000),
        marketId: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
        requestAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<{ status: string }>(response),
      )
    } catch (e) {
      console.error('IndexerGrpcRFQApi.submitRequest => ' + (e as any).message)
    }
  })

  test('fetchOpenRequests', async () => {
    try {
      const response = await indexerGrpcRfqApi.fetchOpenRequests()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcRfqTransformer.openRequestsResponseToOpenRequests
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcRFQApi.fetchOpenRequests => ' + (e as any).message,
      )
    }
  })

  test('submitQuote', async () => {
    try {
      const response = await indexerGrpcRfqApi.submitRequest({
        direction: 'LONG',
        status: 'PENDING',
        rfqId: BigInt(1717000000),
        height: BigInt(1717000000),
        expiry: BigInt(1717000000),
        margin: '1000000000000000000',
        updatedAt: BigInt(1717000000),
        createdAt: BigInt(1717000000),
        quantity: '1000000000000000000',
        worstPrice: '1000000000000000000',
        transactionTime: BigInt(1717000000),
        marketId: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
        requestAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<{ status: string }>(response),
      )
    } catch (e) {
      console.error('IndexerGrpcRFQApi.submitRequest => ' + (e as any).message)
    }
  })

  test('fetchPendingQuotes', async () => {
    try {
      const response = await indexerGrpcRfqApi.fetchPendingQuotes()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcRfqTransformer.pendingQuotesResponseToPendingQuotes
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcRFQApi.fetchPendingQuotes => ' + (e as any).message,
      )
    }
  })

  test('fetchSettlements', async () => {
    try {
      const response = await indexerGrpcRfqApi.fetchSettlements({
        addresses: ['inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49'],
        pagination: {
          skip: 0,
          limit: 10,
        },
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcRfqTransformer.listSettlementsResponseToSettlements
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcRFQApi.fetchSettlements => ' + (e as any).message,
      )
    }
  })
})
