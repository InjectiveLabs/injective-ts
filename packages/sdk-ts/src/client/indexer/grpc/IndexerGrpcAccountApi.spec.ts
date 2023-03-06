import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { mockFactory } from '@injectivelabs/test-utils'
import { IndexerGrpcAccountTransformer } from '../transformers'
import { IndexerGrpcAccountApi } from './IndexerGrpcAccountApi'

const injectiveAddress = mockFactory.injectiveAddress
const endpoints = getNetworkEndpoints(Network.MainnetK8s)
const indexerGrpcAccountApi = new IndexerGrpcAccountApi(endpoints.indexer)

describe('IndexerGrpcAccountApi', () => {
  test('fetchPortfolio', async () => {
    try {
      const response = await indexerGrpcAccountApi.fetchPortfolio(
        injectiveAddress,
      )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcAccountTransformer.accountPortfolioResponseToAccountPortfolio
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcAccountApi.fetchPortfolio => ' + (e as any).message,
      )
    }
  })

  test('fetchRewards', async () => {
    try {
      const response = await indexerGrpcAccountApi.fetchRewards(
        injectiveAddress,
      )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcAccountTransformer.accountPortfolioResponseToAccountPortfolio
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcAccountApi.fetchRewards => ' + (e as any).message,
      )
    }
  })

  test('fetchSubaccountsList', async () => {
    try {
      const response = await indexerGrpcAccountApi.fetchSubaccountsList(
        injectiveAddress,
      )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcAccountTransformer.accountPortfolioResponseToAccountPortfolio
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcAccountApi.fetchSubaccountsList => ' + (e as any).message,
      )
    }
  })

  test('fetchSubaccountBalance', async () => {
    try {
      const response = await indexerGrpcAccountApi.fetchSubaccountBalance(
        injectiveAddress,
      )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcAccountTransformer.accountPortfolioResponseToAccountPortfolio
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcAccountApi.fetchSubaccountBalance => ' + (e as any).message,
      )
    }
  })

  test('fetchSubaccountBalancesList', async () => {
    try {
      const response = await indexerGrpcAccountApi.fetchSubaccountBalancesList(
        injectiveAddress,
      )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcAccountTransformer.accountPortfolioResponseToAccountPortfolio
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcAccountApi.fetchSubaccountBalancesList => ' +
          (e as any).message,
      )
    }
  })

  test('fetchSubaccountHistory', async () => {
    try {
      const response = await indexerGrpcAccountApi.fetchSubaccountHistory(
        injectiveAddress,
      )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcAccountTransformer.accountPortfolioResponseToAccountPortfolio
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcAccountApi.fetchSubaccountHistory => ' + (e as any).message,
      )
    }
  })

  test('fetchSubaccountOrderSummary', async () => {
    try {
      const response = await indexerGrpcAccountApi.fetchSubaccountOrderSummary(
        injectiveAddress,
      )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcAccountTransformer.accountPortfolioResponseToAccountPortfolio
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcAccountApi.fetchSubaccountOrderSummary => ' +
          (e as any).message,
      )
    }
  })

  test('fetchOrderStates', async () => {
    try {
      const response = await indexerGrpcAccountApi.fetchOrderStates(
        injectiveAddress,
      )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcAccountTransformer.accountPortfolioResponseToAccountPortfolio
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcAccountApi.fetchOrderStates => ' + (e as any).message,
      )
    }
  })
})
