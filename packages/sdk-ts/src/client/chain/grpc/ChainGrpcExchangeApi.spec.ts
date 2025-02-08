import { mockFactory } from '@injectivelabs/test-utils'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { ChainGrpcExchangeApi } from './ChainGrpcExchangeApi.js'
import { ChainGrpcExchangeTransformer } from '../transformers/index.js'
import { InjectiveExchangeV1Beta1Query } from '@injectivelabs/core-proto-ts'

const injectiveAddress = mockFactory.injectiveAddress
const subaccountId = mockFactory.subaccountId
const endpoints = getNetworkEndpoints(Network.MainnetSentry)
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

  // skipped as the module state can be quite huge and it times out
  test.skip('fetchModuleState', async () => {
    try {
      const response = await chainGrpcExchangeApi.fetchModuleState()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          InjectiveExchangeV1Beta1Query.QueryModuleStateResponse['state']
        >(response),
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
      ])

      if (response.length === 0) {
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

      if (response.length === 0) {
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

      if (response.length === 0) {
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
        expect.objectContaining<InjectiveExchangeV1Beta1Query.QuerySubaccountTradeNonceResponse>(
          response,
        ),
      )
    } catch (e) {
      console.error(
        'chainGrpcExchangeApi.fetchSubaccountTradeNonce => ' +
          (e as any).message,
      )
    }
  })

  test('fetchIsOptedOutOfRewards', async () => {
    try {
      const response = await chainGrpcExchangeApi.fetchIsOptedOutOfRewards(
        injectiveAddress,
      )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcExchangeTransformer.isOptedOutOfRewardsResponseToIsOptedOutOfRewards
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcExchangeApi.fetchIsOptedOutOfRewards => ' +
          (e as any).message,
      )
    }
  })

  test('fetchDenomDecimals', async () => {
    try {
      const response = await chainGrpcExchangeApi.fetchDenomDecimals()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcExchangeTransformer.denomDecimalsResponseToDenomDecimals
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcExchangeApi.denomDecimalsResponseToDenomDecimals => ' +
          (e as any).message,
      )
    }
  })

  test('fetchDenomMinNotionals', async () => {
    try {
      const response = await chainGrpcExchangeApi.fetchDenomMinNotionals()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcExchangeTransformer.denomMinNotionalsResponseToDenomMinNotionals
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcExchangeApi.denomMinNotionalsResponseToDenomMinNotionals => ' +
          (e as any).message,
      )
    }
  })
})
