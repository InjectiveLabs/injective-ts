import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { ChainGrpcOracleApi } from './ChainGrpcOracleApi.js'
import { OracleModuleParams } from '../types/index.js'

const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const chainGrpcOracleApi = new ChainGrpcOracleApi(endpoints.grpc)

describe('ChainGrpcOracleApi', () => {
  test('fetchModuleParams', async () => {
    try {
      const response = await chainGrpcOracleApi.fetchModuleParams()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<OracleModuleParams>(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcOracleApi.fetchModuleParams => ' + (e as any).message,
      )
    }
  })
})
