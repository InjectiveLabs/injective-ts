import { mockFactory } from '@injectivelabs/utils/test-utils'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { ChainGrpcExchangeApiV2 } from './ChainGrpcExchangeApiV2.js'
import type * as InjectiveExchangeV2QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/query_pb'
import type { ChainGrpcExchangeTransformerV2 } from '../transformers/index.js'

const derivativeMarketId = mockFactory.derivativeMarketId
const injectiveAddress = mockFactory.injectiveAddress
const subaccountId = mockFactory.subaccountId
const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const chainGrpcExchangeApiV2 = new ChainGrpcExchangeApiV2(endpoints.grpc)

describe('ChainGrpcExchangeApiV2', () => {
  test('fetchModuleParams', async () => {
    try {
      const response = await chainGrpcExchangeApiV2.fetchModuleParams()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcExchangeTransformerV2.moduleParamsResponseToParams
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcExchangeApiV2.fetchModuleParams => ' + (e as any).message,
      )
    }
  })

  test('fetchFeeDiscountSchedule', async () => {
    try {
      const response = await chainGrpcExchangeApiV2.fetchFeeDiscountSchedule()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcExchangeTransformerV2.feeDiscountScheduleResponseToFeeDiscountSchedule
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcExchangeApiV2.fetchFeeDiscountSchedule => ' +
          (e as any).message,
      )
    }
  })

  test('fetchFeeDiscountAccountInfo', async () => {
    try {
      const response =
        await chainGrpcExchangeApiV2.fetchFeeDiscountAccountInfo(
          injectiveAddress,
        )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcExchangeTransformerV2.feeDiscountAccountInfoResponseToFeeDiscountAccountInfo
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcExchangeApiV2.fetchFeeDiscountAccountInfo => ' +
          (e as any).message,
      )
    }
  })

  test('fetchTradingRewardsCampaign', async () => {
    try {
      const response =
        await chainGrpcExchangeApiV2.fetchTradingRewardsCampaign()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcExchangeTransformerV2.tradingRewardsCampaignResponseToTradingRewardsCampaign
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcExchangeApiV2.fetchTradingRewardsCampaign => ' +
          (e as any).message,
      )
    }
  })

  test('fetchTradeRewardPoints', async () => {
    try {
      const response = await chainGrpcExchangeApiV2.fetchTradeRewardPoints([
        injectiveAddress,
      ])

      if (response.accountTradeRewardPoints.length === 0) {
        console.warn('fetchTradeRewardPoints.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<{ accountTradeRewardPoints: string[] }>(
          response,
        ),
      )
    } catch (e) {
      console.error(
        'chainGrpcExchangeApiV2.fetchTradeRewardPoints => ' +
          (e as any).message,
      )
    }
  })

  test('fetchPendingTradeRewardPoints', async () => {
    try {
      const response =
        await chainGrpcExchangeApiV2.fetchPendingTradeRewardPoints([
          injectiveAddress,
        ])

      if (response.accountTradeRewardPoints.length === 0) {
        console.warn('fetchPendingTradeRewardPoints.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<{ accountTradeRewardPoints: string[] }>(
          response,
        ),
      )
    } catch (e) {
      console.error(
        'chainGrpcExchangeApiV2.fetchPendingTradeRewardPoints => ' +
          (e as any).message,
      )
    }
  })

  test('fetchPositions', async () => {
    try {
      const response = await chainGrpcExchangeApiV2.fetchPositions()

      if (response.length === 0) {
        console.warn('fetchPositions.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcExchangeTransformerV2.positionsResponseToPositions
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcExchangeApiV2.fetchPositions => ' + (e as any).message,
      )
    }
  })

  test('fetchCrossMarginPoolSnapshot', async () => {
    try {
      const response =
        await chainGrpcExchangeApiV2.fetchCrossMarginPoolSnapshot({
          subaccountId,
          quoteDenom: 'peggy0xdAC17F958D2ee523a2206206994597C13D831ec7',
        })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcExchangeTransformerV2.crossMarginPoolSnapshotResponseToCrossMarginPoolSnapshot
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcExchangeApiV2.fetchCrossMarginPoolSnapshot => ' +
          (e as any).message,
      )
    }
  })

  test('fetchSubaccountTradeNonce', async () => {
    try {
      const response =
        await chainGrpcExchangeApiV2.fetchSubaccountTradeNonce(subaccountId)

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<InjectiveExchangeV2QueryPb.QuerySubaccountTradeNonceResponse>(
          response,
        ),
      )
    } catch (e) {
      console.error(
        'chainGrpcExchangeApiV2.fetchSubaccountTradeNonce => ' +
          (e as any).message,
      )
    }
  })

  test('fetchIsOptedOutOfRewards', async () => {
    try {
      const response =
        await chainGrpcExchangeApiV2.fetchIsOptedOutOfRewards(injectiveAddress)

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcExchangeTransformerV2.isOptedOutOfRewardsResponseToIsOptedOutOfRewards
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcExchangeApiV2.fetchIsOptedOutOfRewards => ' +
          (e as any).message,
      )
    }
  })

  test('fetchActiveStakeGrant', async () => {
    try {
      const response =
        await chainGrpcExchangeApiV2.fetchActiveStakeGrant(injectiveAddress)

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcExchangeTransformerV2.activeStakeGrantResponseToActiveStakeGrant
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcExchangeApiV2.fetchActiveStakeGrant => ' + (e as any).message,
      )
    }
  })

  test('fetchDenomDecimal', async () => {
    try {
      expect(
        await chainGrpcExchangeApiV2.fetchDenomDecimal('inj'),
      ).toBeDefined()
    } catch (e) {
      console.error(
        'chainGrpcExchangeApiV2.fetchDenomDecimal => ' + (e as any).message,
      )
    }
  })

  test('fetchDenomDecimals', async () => {
    try {
      const response = await chainGrpcExchangeApiV2.fetchDenomDecimals()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcExchangeTransformerV2.denomDecimalsResponseToDenomDecimals
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcExchangeApiV2.fetchDenomDecimals => ' + (e as any).message,
      )
    }
  })

  test('fetchDenomMinNotional', async () => {
    try {
      expect(
        await chainGrpcExchangeApiV2.fetchDenomMinNotional('inj'),
      ).toBeDefined()
    } catch (e) {
      console.error(
        'chainGrpcExchangeApiV2.fetchDenomMinNotional => ' + (e as any).message,
      )
    }
  })

  test('fetchDenomMinNotionals', async () => {
    try {
      const response = await chainGrpcExchangeApiV2.fetchDenomMinNotionals()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcExchangeTransformerV2.denomMinNotionalsResponseToDenomMinNotionals
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcExchangeApiV2.fetchDenomMinNotionals => ' +
          (e as any).message,
      )
    }
  })

  test('fetchDerivativeMarkets', async () => {
    try {
      const response = await chainGrpcExchangeApiV2.fetchDerivativeMarkets()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcExchangeTransformerV2.derivativeMarketsResponseToDerivativeMarkets
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcExchangeApiV2.fetchDerivativeMarkets => ' +
          (e as any).message,
      )
    }
  })

  test('fetchSpotMarkets', async () => {
    try {
      const response = await chainGrpcExchangeApiV2.fetchSpotMarkets()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcExchangeTransformerV2.spotMarketsResponseToSpotMarkets
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcExchangeApiV2.fetchSpotMarkets => ' + (e as any).message,
      )
    }
  })

  test('fetchFullSpotMarkets', async () => {
    try {
      const response = await chainGrpcExchangeApiV2.fetchFullSpotMarkets()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcExchangeTransformerV2.fullSpotMarketsResponseToSpotMarkets
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcExchangeApiV2.fetchFullSpotMarkets => ' + (e as any).message,
      )
    }
  })

  // skipped as the module state can be quite huge and it times out
  test.skip('fetchModuleState', async () => {
    try {
      const response = await chainGrpcExchangeApiV2.fetchModuleState()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcExchangeTransformerV2.moduleStateResponseToModuleState
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcExchangeApiV2.fetchModuleState => ' + (e as any).message,
      )
    }
  })

  test('fetchOpenInterest', async () => {
    try {
      const response =
        await chainGrpcExchangeApiV2.fetchOpenInterest(derivativeMarketId)

      expect(response).toBeDefined()
      expect(response.amount).toEqual(
        expect.objectContaining<
          NonNullable<
            InjectiveExchangeV2QueryPb.QueryOpenInterestResponse['amount']
          >
        >(response.amount!),
      )
    } catch (e) {
      console.error(
        'chainGrpcExchangeApiV2.fetchOpenInterest => ' + (e as any).message,
      )
    }
  })
})
