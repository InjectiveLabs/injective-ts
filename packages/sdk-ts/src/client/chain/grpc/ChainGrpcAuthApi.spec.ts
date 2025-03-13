import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { ChainGrpcAuthApi } from './ChainGrpcAuthApi.js'
import { mockFactory } from '@injectivelabs/utils/test-utils'
import { ChainGrpcAuthTransformer } from '../transformers/ChainGrpcAuthTransformer.js'

const injectiveAddress = mockFactory.injectiveAddress
const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const chainGrpcAuthApi = new ChainGrpcAuthApi(endpoints.grpc)

describe('ChainGrpcAuthApi', () => {
  test('fetchModuleParams', async () => {
    try {
      const response = await chainGrpcAuthApi.fetchModuleParams()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcAuthTransformer.moduleParamsResponseToModuleParams
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcAuthApi.fetchModuleParams => ' + (e as any).message,
      )
    }
  })

  test('fetchAccount', async () => {
    try {
      const response = await chainGrpcAuthApi.fetchAccount(injectiveAddress)

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<typeof ChainGrpcAuthTransformer.grpcAccountToAccount>
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcAuthApi.fetchModuleState => ' + (e as any).message,
      )
    }
  })

  test('fetchAccounts', async () => {
    try {
      const response = await chainGrpcAuthApi.fetchAccounts({ limit: 1 })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<typeof ChainGrpcAuthTransformer.accountsResponseToAccounts>
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcAuthApi.fetchCurrentBasket => ' + (e as any).message,
      )
    }
  })
})
