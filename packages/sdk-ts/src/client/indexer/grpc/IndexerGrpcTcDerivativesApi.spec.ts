import { IndexerGrpcTcDerivativesApi } from './IndexerGrpcTcDerivativesApi.js'

const indexerGrpcTcDerivativesApi = new IndexerGrpcTcDerivativesApi(
  'https://tc-derivatives.grpc-web.mainnet.asia.injective.network',
)

describe('IndexerGrpcTcDerivativesApi', () => {
  test('fetchOrdersHistory', async () => {
    const response = await indexerGrpcTcDerivativesApi.fetchOrdersHistory({
      perPage: 10,
      accountAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
    })

    expect(response).toBeDefined()
    expect(response).toMatchObject({
      next: expect.any(Array),
      orders: expect.any(Array),
    })
  })

  test('fetchTradesHistory', async () => {
    const response = await indexerGrpcTcDerivativesApi.fetchTradesHistory({
      perPage: 10,
      accountAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
    })

    expect(response).toBeDefined()
    expect(response).toMatchObject({
      next: expect.any(Array),
      trades: expect.any(Array),
    })
  })

  test('fetchPositions', async () => {
    const response = await indexerGrpcTcDerivativesApi.fetchPositions({
      perPage: 10,
      accountAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
    })

    expect(response).toBeDefined()
    expect(response).toMatchObject({
      next: expect.any(Array),
      positions: expect.any(Array),
    })
  })

  test('fetchOrders', async () => {
    const response = await indexerGrpcTcDerivativesApi.fetchOrders({
      perPage: 10,
      accountAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
    })

    expect(response).toBeDefined()
    expect(response).toMatchObject({
      next: expect.any(Array),
      orders: expect.any(Array),
    })
  })

  test('fetchFundingPayments', async () => {
    const response = await indexerGrpcTcDerivativesApi.fetchFundingPayments({
      perPage: 10,
    })

    expect(response).toBeDefined()
    expect(response).toMatchObject({
      next: expect.any(Array),
      payments: expect.any(Array),
    })
  })
})
