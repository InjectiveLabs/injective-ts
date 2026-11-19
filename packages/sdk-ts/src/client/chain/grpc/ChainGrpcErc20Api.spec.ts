import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { ChainGrpcErc20Api } from './ChainGrpcErc20Api.js'
import type { ChainGrpcErc20Transformer } from '../transformers/ChainGrpcErc20Transformer.js'

const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const chainGrpcErc20Api = new ChainGrpcErc20Api(endpoints.grpc)

describe('ChainGrpcErc20Api', () => {
  test('fetchModuleParams', async () => {
    try {
      const response = await chainGrpcErc20Api.fetchModuleParams()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<typeof ChainGrpcErc20Transformer.paramsResponseToParams>
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcErc20Api.fetchModuleParams => ' + (e as any).message,
      )
    }
  })

  test('fetchTokenPairs', async () => {
    try {
      const response = await chainGrpcErc20Api.fetchTokenPairs({ limit: 10 })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcErc20Transformer.tokenPairsResponseToTokenPairs
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcErc20Api.fetchTokenPairs => ' + (e as any).message,
      )
    }
  })

  test('fetchAllTokenPairsWithPagination', async () => {
    try {
      const response =
        await chainGrpcErc20Api.fetchAllTokenPairsWithPagination()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcErc20Transformer.tokenPairsResponseToTokenPairs
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcErc20Api.fetchTokenPairs => ' + (e as any).message,
      )
    }
  })

  test('fetchTokenPairByDenom', async () => {
    try {
      const response = await chainGrpcErc20Api.fetchTokenPairByDenom(
        'peggy0xdAC17F958D2ee523a2206206994597C13D831ec7',
      )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          | ReturnType<
              typeof ChainGrpcErc20Transformer.grpcTokenPairToTokenPair
            >
          | undefined
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcErc20Api.fetchTokenPairByDenom => ' + (e as any).message,
      )
    }
  })

  test('fetchTokenPairByErc20Address', async () => {
    try {
      const response = await chainGrpcErc20Api.fetchTokenPairByErc20Address(
        '0x88f7F2b685F9692caf8c478f5BADF09eE9B1Cc13',
      )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          | ReturnType<
              typeof ChainGrpcErc20Transformer.grpcTokenPairToTokenPair
            >
          | undefined
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcErc20Api.fetchTokenPairByErc20Address => ' +
          (e as any).message,
      )
    }
  })
})
