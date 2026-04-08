import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { IndexerGrpcTcDerivativesApi } from './IndexerGrpcTcDerivativesApi.js'
import type { IndexerGrpcTcDerivativesTransformer } from '../transformers/index.js'

const endpoints = getNetworkEndpoints(Network.Mainnet)
const indexerGrpcTcDerivativesApi = new IndexerGrpcTcDerivativesApi(
  endpoints.indexer,
)

describe('IndexerGrpcTcDerivativesApi', () => {
  test('fetchOrdersHistory', async () => {
    try {
      const response = await indexerGrpcTcDerivativesApi.fetchOrdersHistory({
        perPage: 10,
        accountAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcTcDerivativesTransformer.ordersHistoryResponseToOrdersHistory
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcTcDerivativesApi.fetchOrdersHistory => ' +
          (e as any).message,
      )
    }
  })

  test('fetchTradesHistory', async () => {
    try {
      const response = await indexerGrpcTcDerivativesApi.fetchTradesHistory({
        perPage: 10,
        accountAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcTcDerivativesTransformer.tradesResponseToTrades
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcTcDerivativesApi.fetchTradesHistory => ' +
          (e as any).message,
      )
    }
  })

  test('fetchPositions', async () => {
    try {
      const response = await indexerGrpcTcDerivativesApi.fetchPositions({
        perPage: 10,
        accountAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcTcDerivativesTransformer.positionsResponseToPositions
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcTcDerivativesApi.fetchPositions => ' + (e as any).message,
      )
    }
  })

  test('fetchOrders', async () => {
    try {
      const response = await indexerGrpcTcDerivativesApi.fetchOrders({
        perPage: 10,
        accountAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcTcDerivativesTransformer.ordersResponseToOrders
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcTcDerivativesApi.fetchOrders => ' + (e as any).message,
      )
    }
  })
})
