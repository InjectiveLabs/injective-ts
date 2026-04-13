import { mockFactory } from '@injectivelabs/utils/test-utils'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { ChainGrpcAuthZApi } from './ChainGrpcAuthZApi.js'
import type { ChainGrpcAuthZTransformer } from '../transformers/ChainGrpcAuthZTransformer.js'

const injectiveAddress = mockFactory.injectiveAddress
const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const chainGrpcAuthZApi = new ChainGrpcAuthZApi(endpoints.grpc)

describe('ChainGrpcAuthZApi', () => {
  test('fetchGrants', async () => {
    try {
      const response = await chainGrpcAuthZApi.fetchGrants({
        granter: injectiveAddress,
        grantee: injectiveAddress,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<typeof ChainGrpcAuthZTransformer.grpcGrantsToGrants>
        >(response),
      )
    } catch (e) {
      console.error('ChainGrpcAuthZApi.fetchGrants => ' + (e as any).message)
    }
  })

  test('fetchGranterGrants', async () => {
    try {
      const response =
        await chainGrpcAuthZApi.fetchGranterGrants(injectiveAddress)

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcAuthZTransformer.grpcGranterGrantsToGranterGrants
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcAuthZApi.fetchGranterGrants => ' + (e as any).message,
      )
    }
  })

  test('fetchGranteeGrants', async () => {
    try {
      const response =
        await chainGrpcAuthZApi.fetchGranteeGrants(injectiveAddress)

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcAuthZTransformer.grpcGranteeGrantsToGranteeGrants
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcAuthZApi.fetchGranteeGrants => ' + (e as any).message,
      )
    }
  })
})
