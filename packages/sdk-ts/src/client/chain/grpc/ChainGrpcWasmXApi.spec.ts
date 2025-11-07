import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { ChainGrpcWasmXApi } from './ChainGrpcWasmXApi.js'

const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const chainGrpcWasmXApi = new ChainGrpcWasmXApi(endpoints.grpc)

describe('ChainGrpcWasmXApi', () => {
  test('fetchModuleParams', async () => {
    try {
      const response = await chainGrpcWasmXApi.fetchModuleParams()

      expect(response).toBeDefined()
      expect(response).toEqual(expect.objectContaining(response))
    } catch (e) {
      console.error(
        'ChainGrpcWasmXApi.fetchModuleParams => ' + (e as any).message,
      )
    }
  })

  test('fetchModuleState', async () => {
    try {
      const response = await chainGrpcWasmXApi.fetchModuleState()

      expect(response).toBeDefined()
      expect(response).toEqual(expect.objectContaining(response))
    } catch (e) {
      console.error(
        'ChainGrpcWasmXApi.fetchModuleState => ' + (e as any).message,
      )
    }
  })
})
