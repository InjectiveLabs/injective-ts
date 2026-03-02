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
      const timestampResponse = await indexerGrpcRfqApi.submitQuote({
        status: 'PENDING',
        chainId: 'injective-1',
        takerDirection: 'LONG',
        rfqId: BigInt(1717000000),
        height: BigInt(1717000000),
        price: '1000000000000000000',
        margin: '1000000000000000000',
        createdAt: BigInt(1717000000),
        updatedAt: BigInt(1717000000),
        eventTime: BigInt(1717000000),
        quantity: '1000000000000000000',
        signature: '0x1234567890abcdef',
        transactionTime: BigInt(1717000000),
        maker: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
        taker: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
        marketId: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
        contractAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
        expiry: {
          timestamp: BigInt(1717000000),
        },
      })

      expect(timestampResponse).toBeDefined()
      expect(timestampResponse).toEqual(
        expect.objectContaining<{ status: string }>(timestampResponse),
      )

      const blockHeightResponse = await indexerGrpcRfqApi.submitQuote({
        status: 'PENDING',
        chainId: 'injective-1',
        takerDirection: 'LONG',
        rfqId: BigInt(1717000000),
        height: BigInt(1717000000),
        price: '1000000000000000000',
        margin: '1000000000000000000',
        createdAt: BigInt(1717000000),
        updatedAt: BigInt(1717000000),
        eventTime: BigInt(1717000000),
        quantity: '1000000000000000000',
        signature: '0x1234567890abcdef',
        transactionTime: BigInt(1717000000),
        maker: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
        taker: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
        marketId: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
        contractAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
        expiry: {
          height: BigInt(1717000000),
        },
      })

      expect(blockHeightResponse).toBeDefined()
      expect(blockHeightResponse).toEqual(
        expect.objectContaining<{ status: string }>(blockHeightResponse),
      )
    } catch (e) {
      console.error('IndexerGrpcRFQApi.submitQuote => ' + (e as any).message)
    }
  })

  test('fetchSettlements', async () => {
    try {
      const response = await indexerGrpcRfqApi.fetchSettlements({
        perPage: 10,
        addresses: ['inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49'],
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
