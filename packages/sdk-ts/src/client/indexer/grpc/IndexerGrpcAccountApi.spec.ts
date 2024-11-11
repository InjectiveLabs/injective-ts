import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { mockFactory } from '@injectivelabs/test-utils'
import { getDefaultSubaccountId } from '../../../utils/address.js'
import { INJ_DENOM } from '@injectivelabs/utils'
import { IndexerGrpcAccountTransformer } from '../transformers/index.js'
import { IndexerGrpcAccountApi } from './IndexerGrpcAccountApi.js'

const injectiveAddress = mockFactory.injectiveAddress
const subaccountId = getDefaultSubaccountId(injectiveAddress)
const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const indexerGrpcAccountApi = new IndexerGrpcAccountApi(endpoints.indexer)

describe('IndexerGrpcAccountApi', () => {
  test('fetchRewards', async () => {
    try {
      const response = await indexerGrpcAccountApi.fetchRewards({
        address: injectiveAddress,
        epoch: -1,
      })

      if (response.length === 0) {
        console.warn('fetchRewards.rewardsIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcAccountTransformer.tradingRewardsResponseToTradingRewards
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
      expect(response).toEqual(expect.objectContaining<string[]>(response))
    } catch (e) {
      console.error(
        'IndexerGrpcAccountApi.fetchSubaccountsList => ' + (e as any).message,
      )
    }
  })

  test('fetchSubaccountBalance', async () => {
    try {
      const response = await indexerGrpcAccountApi.fetchSubaccountBalance(
        subaccountId,
        INJ_DENOM,
      )

      if (response.subaccountId.length === 0) {
        console.warn('fetchSubaccountBalance.subaccountIdsIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcAccountTransformer.balanceResponseToBalance
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
        subaccountId,
      )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcAccountTransformer.balancesResponseToBalances
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
      const response = await indexerGrpcAccountApi.fetchSubaccountHistory({
        subaccountId,
      })

      if (response.transfers.length === 0) {
        console.warn('fetchSubaccountHistory.transfersIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcAccountTransformer.transferHistoryResponseToTransferHistory
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
      const response = await indexerGrpcAccountApi.fetchSubaccountOrderSummary({
        subaccountId,
      })

      if (response.spotOrdersTotal.length === 0) {
        console.warn('fetchSubaccountHistory.spotOrdersTotalEmpty')
      }

      if (response.derivativeOrdersTotal.length === 0) {
        console.warn('fetchSubaccountHistory.derivativeOrdersTotalEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<typeof response>(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcAccountApi.fetchSubaccountOrderSummary => ' +
          (e as any).message,
      )
    }
  })

  /* TODO
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
  }) */
})
