import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { ChainGrpcPermissionsTransformer } from '../transformers'
import { mockFactory } from '@injectivelabs/test-utils'
import { ChainGrpcPermissionsApi } from './ChainGrpcPermissionsApi'
import { INJ_DENOM } from '@injectivelabs/utils'

const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const chainGrpcPermissionsApi = new ChainGrpcPermissionsApi(endpoints.grpc)
const injectiveAddress = mockFactory.injectiveAddress


describe('ChainGrpcPermissionsApi', () => {
  test('fetchModuleParams', async () => {
    try {
      const response = await chainGrpcPermissionsApi.fetchModuleParams()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcPermissionsTransformer.moduleParamsResponseToModuleParams
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcPermissionsApi.fetchModuleParams => ' + (e as any).message,
      )
    }
  })
})
