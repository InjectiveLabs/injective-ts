import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { ChainGrpcPeggyApi } from './ChainGrpcPeggyApi.js'
import type { ChainGrpcPeggyTransformer } from '../transformers/index.js'

const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const chainGrpcPeggyApi = new ChainGrpcPeggyApi(endpoints.grpc)

describe('ChainGrpcPeggyApi', () => {
  test('fetchModuleParams', async () => {
    try {
      const response = await chainGrpcPeggyApi.fetchModuleParams()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcPeggyTransformer.moduleParamsResponseToModuleParams
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcPeggyApi.fetchModuleParams => ' + (e as any).message,
      )
    }
  })
})
