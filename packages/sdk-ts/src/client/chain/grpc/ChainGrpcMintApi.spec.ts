import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { ChainGrpcMintApi } from './ChainGrpcMintApi.js'
import { ChainGrpcMintTransformer } from '../transformers/index.js'

const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const chainGrpcMintApi = new ChainGrpcMintApi(endpoints.grpc)

describe('ChainGrpcMintApi', () => {
  test('fetchModuleParams', async () => {
    try {
      const response = await chainGrpcMintApi.fetchModuleParams()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcMintTransformer.moduleParamsResponseToModuleParams
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcMintApi.fetchModuleParams => ' + (e as any).message,
      )
    }
  })

  test('fetchInflation', async () => {
    try {
      const response = await chainGrpcMintApi.fetchInflation()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<{ inflation: string }>(response),
      )
    } catch (e) {
      console.error('chainGrpcMintApi.fetchInflation => ' + (e as any).message)
    }
  })

  test('fetchAnnualProvisions', async () => {
    try {
      const response = await chainGrpcMintApi.fetchAnnualProvisions()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<{ annualProvisions: string }>(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcMintApi.fetchAnnualProvisions => ' + (e as any).message,
      )
    }
  })
})
