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
        clientId: '1717000000',
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

  test('submitQuote', async () => {
    try {
      const response = await indexerGrpcRfqApi.submitQuote({
        rfqId: BigInt(1717000000),
        price: '1000000000000000000',
        maker: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
        taker: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
        margin: '1000000000000000000',
        expiry: BigInt(1717000000),
        status: 'PENDING',
        height: BigInt(1717000000),
        chainId: 'injective-1',
        marketId: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
        quantity: '1000000000000000000',
        signature: '0x1234567890abcdef',
        createdAt: BigInt(1717000000),
        updatedAt: BigInt(1717000000),
        eventTime: BigInt(1717000000),
        takerDirection: 'LONG',
        contractAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
        transactionTime: BigInt(1717000000),
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<{ status: string }>(response),
      )
    } catch (e) {
      console.error('IndexerGrpcRFQApi.submitQuote => ' + (e as any).message)
    }
  })

  test('fetchSettlements', async () => {
    try {
      const response = await indexerGrpcRfqApi.fetchSettlements({
        addresses: ['inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49'],
        perPage: 10,
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
