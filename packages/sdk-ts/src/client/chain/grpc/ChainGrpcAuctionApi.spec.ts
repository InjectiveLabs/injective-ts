import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { ChainGrpcAuctionTransformer } from '../transformers/index.js'
import { ChainGrpcAuctionApi } from './ChainGrpcAuctionApi.js'

const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const chainGrpcAuctionApi = new ChainGrpcAuctionApi(endpoints.grpc)

describe('ChainGrpcAuctionApi', () => {
  test('fetchModuleParams', async () => {
    try {
      const response = await chainGrpcAuctionApi.fetchModuleParams()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcAuctionTransformer.moduleParamsResponseToModuleParams
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcAuctionApi.fetchModuleParams => ' + (e as any).message,
      )
    }
  })

  test('fetchModuleState', async () => {
    try {
      const response = await chainGrpcAuctionApi.fetchModuleState()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcAuctionTransformer.auctionModuleStateResponseToAuctionModuleState
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcAuctionApi.fetchModuleState => ' + (e as any).message,
      )
    }
  })

  test('fetchCurrentBasket', async () => {
    try {
      const response = await chainGrpcAuctionApi.fetchCurrentBasket()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcAuctionTransformer.currentBasketResponseToCurrentBasket
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcAuctionApi.fetchCurrentBasket => ' + (e as any).message,
      )
    }
  })
})
