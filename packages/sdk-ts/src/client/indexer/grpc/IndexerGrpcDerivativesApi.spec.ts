import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { getDefaultSubaccountId } from '../../../utils/address.js'
import { mockFactory } from '@injectivelabs/utils/test-utils'
import { IndexerGrpcDerivativeTransformer } from '../transformers/index.js'
import { DerivativeMarket } from '../types/index.js'
import { IndexerGrpcDerivativesApi } from './IndexerGrpcDerivativesApi.js'

const injectiveAddress = mockFactory.injectiveAddress
const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const indexerGrpcDerivativesApi = new IndexerGrpcDerivativesApi(
  endpoints.indexer,
)

describe('IndexerGrpcDerivativeApi', () => {
  let market: DerivativeMarket
  let markets: DerivativeMarket[]

  beforeAll(async () => {
    return new Promise<void>(async (resolve) => {
      markets = await indexerGrpcDerivativesApi.fetchMarkets()
      market = markets[0]

      return resolve()
    })
  })

  test('fetchMarkets', async () => {
    try {
      const response = await indexerGrpcDerivativesApi.fetchMarkets()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcDerivativeTransformer.marketsResponseToMarkets
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcDerivativesApi.fetchMarkets => ' + (e as any).message,
      )
    }
  })

  test('fetchMarket', async () => {
    try {
      const response = await indexerGrpcDerivativesApi.fetchMarket(
        market.marketId,
      )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcDerivativeTransformer.marketResponseToMarket
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcDerivativesApi.fetchMarket => ' + (e as any).message,
      )
    }
  })

  test('fetchOrders', async () => {
    try {
      const response = await indexerGrpcDerivativesApi.fetchOrders({
        marketId: market.marketId,
      })

      if (response.orders.length === 0) {
        console.warn('fetchOrders.ordersIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcDerivativeTransformer.ordersResponseToOrders
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcDerivativesApi.fetchOrders => ' + (e as any).message,
      )
    }
  })

  test('fetchOrderHistory', async () => {
    try {
      const response = await indexerGrpcDerivativesApi.fetchOrderHistory({
        marketId: market.marketId,
        pagination: {
          limit: 1,
        },
      })

      if (response.orderHistory.length === 0) {
        console.warn('fetchOrderHistory.orderHistoryIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcDerivativeTransformer.orderHistoryResponseToOrderHistory
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcDerivativesApi.fetchOrderHistory => ' + (e as any).message,
      )
    }
  })

  test('fetchTrades', async () => {
    try {
      const response = await indexerGrpcDerivativesApi.fetchTrades({
        marketId: market.marketId,
        pagination: {
          limit: 1,
        },
      })

      if (response.trades.length === 0) {
        console.warn('fetchTrades.tradesIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcDerivativeTransformer.tradesResponseToTrades
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcDerivativesApi.fetchTrades => ' + (e as any).message,
      )
    }
  })

  test('fetchSubaccountOrdersList', async () => {
    try {
      const response =
        await indexerGrpcDerivativesApi.fetchSubaccountOrdersList({
          marketId: market.marketId,
          subaccountId: getDefaultSubaccountId(injectiveAddress),
          pagination: {
            limit: 1,
          },
        })

      if (response.orders.length === 0) {
        console.warn('fetchSubaccountOrdersList.ordersIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcDerivativeTransformer.ordersResponseToOrders
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcDerivativesApi.fetchSubaccountOrdersList => ' +
          (e as any).message,
      )
    }
  })

  test('fetchSubaccountTradesList', async () => {
    try {
      const response =
        await indexerGrpcDerivativesApi.fetchSubaccountTradesList({
          marketId: market.marketId,
          subaccountId: getDefaultSubaccountId(injectiveAddress),
          pagination: {
            limit: 1,
          },
        })

      if (response.length === 0) {
        console.warn('fetchOrders.tradesIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcDerivativeTransformer.subaccountTradesListResponseToSubaccountTradesList
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcDerivativesApi.fetchSubaccountTradesList => ' +
          (e as any).message,
      )
    }
  })

  test('fetchOrderbooksV2', async () => {
    try {
      const response = await indexerGrpcDerivativesApi.fetchOrderbooksV2([
        market.marketId,
      ])

      if (response.length === 0) {
        console.warn('fetchOrderbooks.orderbooksIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcDerivativeTransformer.orderbooksV2ResponseToOrderbooksV2
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcDerivativesApi.fetchOrderbooksV2 => ' + (e as any).message,
      )
    }
  })

  test('fetchOrderbookV2', async () => {
    try {
      const response = await indexerGrpcDerivativesApi.fetchOrderbookV2(
        market.marketId,
      )

      if (response.buys.length === 0) {
        console.warn('fetchOrderbookV2.buysIsEmptyArray')
      }

      if (response.sells.length === 0) {
        console.warn('fetchOrderbookV2.sellsIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcDerivativeTransformer.orderbookV2ResponseToOrderbookV2
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcDerivativesApi.fetchOrderbookV2 => ' + (e as any).message,
      )
    }
  })

  test('fetchFundingRates', async () => {
    try {
      const response = await indexerGrpcDerivativesApi.fetchFundingRates({
        marketId: market.marketId,
        pagination: { limit: 1 },
      })

      if (response.fundingRates.length === 0) {
        console.warn('fetchFundingRates.fundingRatesIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcDerivativeTransformer.fundingRatesResponseToFundingRates
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcDerivativesApi.fetchFundingRates => ' + (e as any).message,
      )
    }
  })

  test('fetchFundingPayments', async () => {
    try {
      const response = await indexerGrpcDerivativesApi.fetchFundingPayments({
        marketId: market.marketId,
        pagination: { limit: 1 },
      })

      if (response.fundingPayments.length === 0) {
        console.warn('fetchFundingPayments.fetchFundingPaymentsIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcDerivativeTransformer.fundingPaymentsResponseToFundingPayments
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcDerivativesApi.fetchFundingPayments => ' +
          (e as any).message,
      )
    }
  })

  test('fetchPositions', async () => {
    try {
      const response = await indexerGrpcDerivativesApi.fetchPositions({
        marketId: market.marketId,
        pagination: { limit: 1 },
      })

      if (response.positions.length === 0) {
        console.warn('fetchPositions.fetchPositionsIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcDerivativeTransformer.positionsResponseToPositions
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcDerivativesApi.fetchPositions => ' + (e as any).message,
      )
    }
  })
})
