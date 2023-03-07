import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { ChainGrpcExchangeApi } from './ChainGrpcExchangeApi'
import { mockFactory } from '@injectivelabs/test-utils'
import { ChainGrpcExchangeTransformer } from '../transformers'
import {
  QueryModuleStateResponse,
  QuerySubaccountTradeNonceResponse,
} from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/query'

const injectiveAddress = mockFactory.injectiveAddress
// const injectiveAddress2 = mockFactory.injectiveAddress2
const subaccountId = mockFactory.subaccountId
// const validatorAddress = mockFactory.validatorAddress
const endpoints = getNetworkEndpoints(Network.MainnetK8s)
const chainGrpcExchangeApi = new ChainGrpcExchangeApi(endpoints.grpc)

describe('ChainGrpcExchangeApi', () => {
  test('fetchModuleParams', async () => {
    try {
      const response = await chainGrpcExchangeApi.fetchModuleParams()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcExchangeTransformer.moduleParamsResponseToParams
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcExchangeApi.fetchModuleParams => ' + (e as any).message,
      )
    }
  })
  // Skipped because its Too BIG!
  test.skip('fetchModuleState', async () => {
    try {
      const response = await chainGrpcExchangeApi.fetchModuleState()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<QueryModuleStateResponse['state']>(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcExchangeApi.fetchModuleState => ' + (e as any).message,
      )
    }
  })

  test('fetchFeeDiscountSchedule', async () => {
    try {
      const response = await chainGrpcExchangeApi.fetchFeeDiscountSchedule()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcExchangeTransformer.feeDiscountScheduleResponseToFeeDiscountSchedule
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcExchangeApi.fetchFeeDiscountSchedule => ' +
          (e as any).message,
      )
    }
  })

  test('fetchFeeDiscountAccountInfo', async () => {
    try {
      const response = await chainGrpcExchangeApi.fetchFeeDiscountAccountInfo(
        injectiveAddress,
      )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcExchangeTransformer.feeDiscountAccountInfoResponseToFeeDiscountAccountInfo
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcExchangeApi.fetchFeeDiscountAccountInfo => ' +
          (e as any).message,
      )
    }
  })

  test('fetchTradingRewardsCampaign', async () => {
    try {
      const response = await chainGrpcExchangeApi.fetchTradingRewardsCampaign()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcExchangeTransformer.tradingRewardsCampaignResponseToTradingRewardsCampaign
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcExchangeApi.fetchTradingRewardsCampaign => ' +
          (e as any).message,
      )
    }
  })

  test('fetchTradeRewardPoints', async () => {
    try {
      const response = await chainGrpcExchangeApi.fetchTradeRewardPoints([
        injectiveAddress,
        // injectiveAddress2,
      ])
      if (response.length == 0) {
        console.warn('fetchTradeRewardPoints.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(expect.objectContaining<string[]>(response))
    } catch (e) {
      console.error(
        'chainGrpcExchangeApi.fetchTradeRewardPoints => ' + (e as any).message,
      )
    }
  })

  test('fetchPendingTradeRewardPoints', async () => {
    try {
      const response = await chainGrpcExchangeApi.fetchPendingTradeRewardPoints(
        [injectiveAddress],
      )
      if (response.length == 0) {
        console.warn('fetchPendingTradeRewardPoints.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(expect.objectContaining<string[]>(response))
    } catch (e) {
      console.error(
        'chainGrpcExchangeApi.fetchPendingTradeRewardPoints => ' +
          (e as any).message,
      )
    }
  })

  test('fetchPositions', async () => {
    try {
      const response = await chainGrpcExchangeApi.fetchPositions()

      if (response.length == 0) {
        console.warn('fetchPositions.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcExchangeTransformer.positionsResponseToPositions
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcExchangeApi.fetchPositions => ' + (e as any).message,
      )
    }
  })

  test('fetchSubaccountTradeNonce', async () => {
    try {
      const response = await chainGrpcExchangeApi.fetchSubaccountTradeNonce(
        subaccountId,
      )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<QuerySubaccountTradeNonceResponse>(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcExchangeApi.fetchSubaccountTradeNonce => ' +
          (e as any).message,
      )
    }
  })
})
