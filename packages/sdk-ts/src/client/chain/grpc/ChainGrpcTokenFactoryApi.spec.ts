import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { ChainGrpcTokenFactoryApi } from './ChainGrpcTokenFactoryApi.js'
import { ChainGrpcTokenFactoryTransformer } from '../transformers/index.js'

const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const chainGrpcTokenFactoryApi = new ChainGrpcTokenFactoryApi(endpoints.grpc)

describe('ChainTokenFactoryApi.spec', () => {
  test('fetchModuleParams', async () => {
    try {
      const response = await chainGrpcTokenFactoryApi.fetchModuleParams()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcTokenFactoryTransformer.moduleParamsResponseToModuleParams
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcTokenFactoryApi.fetchModuleParams => ' + (e as any).message,
      )
    }
  })

  test('fetchModuleState', async () => {
    try {
      const response = await chainGrpcTokenFactoryApi.fetchModuleState()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcTokenFactoryTransformer.moduleStateResponseToModuleState
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcTokenFactoryApi.fetchModuleState => ' + (e as any).message,
      )
    }
  })

  test('fetchDenomsFromCreator', async () => {
    try {
      const response = await chainGrpcTokenFactoryApi.fetchDenomsFromCreator(
        'inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk',
      )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcTokenFactoryTransformer.denomsCreatorResponseToDenomsString
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcTokenFactoryApi.fetchDenomsFromCreator => ' +
          (e as any).message,
      )
    }
  })

  test('fetchDenomAuthorityMetadata', async () => {
    try {
      const response =
        await chainGrpcTokenFactoryApi.fetchDenomAuthorityMetadata(
          'inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk',
          'inj12pwnhtv7yat2s30xuf4gdk9qm85v4j3e60dgvu',
        )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcTokenFactoryTransformer.authorityMetadataResponseToAuthorityMetadata
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcTokenFactoryApi.fetchDenomAuthorityMetadata => ' +
          (e as any).message,
      )
    }
  })
})
