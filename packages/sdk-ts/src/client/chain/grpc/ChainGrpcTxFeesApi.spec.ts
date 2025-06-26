import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { ChainGrpcTxFeesTransformer } from '../transformers/index.js'
import { ChainGrpcTxFeesApi } from './ChainGrpcTxFeesApi.js'

const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const chainGrpcTxFeesApi = new ChainGrpcTxFeesApi(endpoints.grpc)

describe('ChainGrpcTxFeesApi', () => {
  test('fetchModuleParams', async () => {
    try {
      const response = await chainGrpcTxFeesApi.fetchModuleParams()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcTxFeesTransformer.moduleParamsResponseToModuleParams
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcTxFeesApi.fetchModuleParams => ' + (e as any).message,
      )
    }
  })

  test('fetchLastAuctionResult', async () => {
    try {
      const response = await chainGrpcTxFeesApi.fetchEipBaseFee()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcTxFeesTransformer.eipBaseFeeResponseToEipBaseFee
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcTxFeesApi.fetchLastAuctionResult => ' + (e as any).message,
      )
    }
  })
})
