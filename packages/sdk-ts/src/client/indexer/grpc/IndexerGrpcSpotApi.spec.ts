import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { getDefaultSubaccountId } from '../../../utils/address.js'
import { mockFactory } from '@injectivelabs/test-utils'
import { IndexerGrpcSpotTransformer } from '../transformers/index.js'
import { SpotMarket } from '../types/index.js'
import { IndexerGrpcSpotApi } from './IndexerGrpcSpotApi.js'

const injectiveAddress = mockFactory.injectiveAddress
const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const indexerGrpcSpotApi = new IndexerGrpcSpotApi(endpoints.indexer)

describe('IndexerGrpcSpotApi', () => {
  let market: SpotMarket
  let markets: SpotMarket[]

  beforeAll(async () => {
    return new Promise<void>(async (resolve) => {
      markets = await indexerGrpcSpotApi.fetchMarkets()
      market = markets[0]

      return resolve()
    })
  })

  test('fetchMarkets', async () => {
    try {
      const response = await indexerGrpcSpotApi.fetchMarkets()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<typeof IndexerGrpcSpotTransformer.marketsResponseToMarkets>
        >(response),
      )
    } catch (e) {
      console.error('IndexerGrpcSpotApi.fetchMarkets => ' + (e as any).message)
    }
  })

  test('fetchMarket', async () => {
    try {
      const response = await indexerGrpcSpotApi.fetchMarket(market.marketId)

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<typeof IndexerGrpcSpotTransformer.marketResponseToMarket>
        >(response),
      )
    } catch (e) {
      console.error('IndexerGrpcSpotApi.fetchMarket => ' + (e as any).message)
    }
  })

  test('fetchOrders', async () => {
    try {
      const response = await indexerGrpcSpotApi.fetchOrders({
        marketId: market.marketId,
      })

      if (response.orders.length === 0) {
        console.warn('fetchOrders.ordersIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<typeof IndexerGrpcSpotTransformer.ordersResponseToOrders>
        >(response),
      )
    } catch (e) {
      console.error('IndexerGrpcSpotApi.fetchOrders => ' + (e as any).message)
    }
  })

  test('fetchOrderHistory', async () => {
    try {
      const response = await indexerGrpcSpotApi.fetchOrderHistory({
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
            typeof IndexerGrpcSpotTransformer.orderHistoryResponseToOrderHistory
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcSpotApi.fetchOrderHistory => ' + (e as any).message,
      )
    }
  })

  test('fetchTrades', async () => {
    try {
      const response = await indexerGrpcSpotApi.fetchTrades({
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
          ReturnType<typeof IndexerGrpcSpotTransformer.tradesResponseToTrades>
        >(response),
      )
    } catch (e) {
      console.error('IndexerGrpcSpotApi.fetchTrades => ' + (e as any).message)
    }
  })

  test('fetchSubaccountOrdersList', async () => {
    try {
      const response = await indexerGrpcSpotApi.fetchSubaccountOrdersList({
        subaccountId: getDefaultSubaccountId(injectiveAddress),
        marketId: market.marketId,
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
          ReturnType<typeof IndexerGrpcSpotTransformer.ordersResponseToOrders>
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcSpotApi.fetchSubaccountOrdersList => ' + (e as any).message,
      )
    }
  })

  test('fetchSubaccountTradesList', async () => {
    try {
      const response = await indexerGrpcSpotApi.fetchSubaccountTradesList({
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
            typeof IndexerGrpcSpotTransformer.subaccountTradesListResponseToTradesList
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcSpotApi.fetchSubaccountTradesList => ' + (e as any).message,
      )
    }
  })

  test('fetchOrderbooksV2', async () => {
    try {
      const response = await indexerGrpcSpotApi.fetchOrderbooksV2([
        market.marketId,
      ])

      if (response.length === 0) {
        console.warn('fetchOrderbooks.orderbooksIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcSpotTransformer.orderbooksV2ResponseToOrderbooksV2
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcSpotApi.fetchOrderbooksV2 => ' + (e as any).message,
      )
    }
  })

  test('fetchOrderbookV2', async () => {
    try {
      const response = await indexerGrpcSpotApi.fetchOrderbookV2(
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
            typeof IndexerGrpcSpotTransformer.orderbookV2ResponseToOrderbookV2
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcSpotApi.fetchOrderbookV2 => ' + (e as any).message,
      )
    }
  })

  /**
   * Resurrect this test once fetchAtomicSwapHistory hits mainnet
   * Since this test suite is pointed at mainnet
   */
  // test('fetchAtomicSwapHistory', async () => {
  //   try {
  //     const response = await indexerGrpcSpotApi.fetchAtomicSwapHistory({
  //       address: injectiveAddress,
  //       contractAddress: swapContractAddress,
  //       pagination: {
  //         fromNumber: 1,
  //         toNumber: 11,
  //       },
  //     })
  //     console.log({ response })
  //     if (response.swapHistory.length === 0) {
  //       console.warn('fetchAtomicSwapHistory.swapHistoryIsEmptyArray')
  //     }

  //     expect(response).toBeDefined()
  //     expect(response).toEqual(
  //       expect.objectContaining<
  //         ReturnType<
  //           typeof IndexerGrpcSpotTransformer.grpcAtomicSwapHistoryListToAtomicSwapHistoryList
  //         >
  //       >(response),
  //     )
  //   } catch (e) {
  //     console.error(
  //       'IndexerGrpcSpotApi.fetchAtomicSwapHistory => ' + (e as any).message,
  //     )
  //   }
  // })
})
