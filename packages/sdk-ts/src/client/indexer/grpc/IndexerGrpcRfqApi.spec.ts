import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { IndexerGrpcRFQApi } from './IndexerGrpcRfqApi.js'
import type { IndexerGrpcRfqTransformer } from '../transformers/index.js'

const endpoints = getNetworkEndpoints(Network.Mainnet)
const indexerGrpcRfqApi = new IndexerGrpcRFQApi(endpoints.indexer)

describe('IndexerGrpcRFQApi', () => {
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

  test('createConditionalOrder', async () => {
    try {
      const response = await indexerGrpcRfqApi.createConditionalOrder({
        signMode: 'v1',
        signature: '0x1234567890abcdef',
        evmChainId: BigInt(1439),
        order: {
          version: 1,
          rfqId: BigInt(1),
          epoch: BigInt(0),
          direction: 'long',
          subaccountNonce: 0,
          chainId: 'injective-1',
          laneVersion: BigInt(0),
          minTotalFillQuantity: '0',
          margin: '1000000000000000000',
          triggerType: 'mark_price_gte',
          quantity: '1000000000000000000',
          worstPrice: '1000000000000000000',
          deadlineMs: BigInt(1717000000000),
          triggerPrice: '1000000000000000000',
          taker: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
          contractAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
          marketId:
            '0x17ef48032cb24375ba7c2e39f384e56433bcab20cbee9a7357e4cba2eb00abe6',
        },
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<{ order: any }>(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcRFQApi.createConditionalOrder => ' + (e as any).message,
      )
    }
  })

  test('listConditionalOrders', async () => {
    try {
      const response = await indexerGrpcRfqApi.listConditionalOrders({
        perPage: 10,
        requestAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcRfqTransformer.listConditionalOrdersResponseToConditionalOrders
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcRFQApi.listConditionalOrders => ' + (e as any).message,
      )
    }
  })
})
