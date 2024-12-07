import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { ChainGrpcInsuranceFundApi } from './ChainGrpcInsuranceFundApi.js'
import { ChainGrpcInsuranceFundTransformer } from '../transformers/index.js'
import { mockFactory } from '@injectivelabs/utils/test-utils'
import { IndexerGrpcDerivativesApi } from '../../indexer/index.js'

const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const chainGrpcIbcApi = new ChainGrpcInsuranceFundApi(endpoints.grpc)
const injectiveAddress = mockFactory.injectiveAddress
const derivativeMarketId = mockFactory.derivativeMarketId

describe('ChainGrpcIbcApi', () => {
  test('fetchModuleParams', async () => {
    try {
      const response = await chainGrpcIbcApi.fetchModuleParams()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcInsuranceFundTransformer.moduleParamsResponseToModuleParams
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcIbcApi.fetchModuleParams => ' + (e as any).message,
      )
    }
  })

  test('fetchInsuranceFunds', async () => {
    try {
      const response = await chainGrpcIbcApi.fetchInsuranceFunds()

      if (response.length === 0) {
        console.warn('fetchInsuranceFunds.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcInsuranceFundTransformer.insuranceFundsResponseToInsuranceFunds
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcIbcApi.fetchInsuranceFunds => ' + (e as any).message,
      )
    }
  })
  test('fetchInsuranceFund', async () => {
    const indexerGrpcDerivativesApi = new IndexerGrpcDerivativesApi(
      endpoints.indexer,
    )
    const [derivativeMarket] = await indexerGrpcDerivativesApi.fetchMarkets()

    try {
      const response = await chainGrpcIbcApi.fetchInsuranceFund(
        derivativeMarket.marketId,
      )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcInsuranceFundTransformer.insuranceFundResponseToInsuranceFund
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcIbcApi.fetchInsuranceFund => ' + (e as any).message,
      )
    }
  })
  test('fetchEstimatedRedemptions', async () => {
    try {
      const response = await chainGrpcIbcApi.fetchEstimatedRedemptions({
        address: injectiveAddress,
        marketId: derivativeMarketId,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcInsuranceFundTransformer.estimatedRedemptionsResponseToEstimatedRedemptions
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcIbcApi.fetchEstimatedRedemptions => ' + (e as any).message,
      )
    }
  })
  test('fetchPendingRedemptions', async () => {
    try {
      const response = await chainGrpcIbcApi.fetchPendingRedemptions({
        address: injectiveAddress,
        marketId: derivativeMarketId,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcInsuranceFundTransformer.redemptionsResponseToRedemptions
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcIbcApi.fetchPendingRedemptions => ' + (e as any).message,
      )
    }
  })
})
