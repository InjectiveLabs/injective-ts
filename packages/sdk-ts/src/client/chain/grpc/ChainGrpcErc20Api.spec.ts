import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { ChainGrpcErc20Api } from './ChainGrpcErc20Api.js'
import type { ChainGrpcErc20Transformer } from '../transformers/ChainGrpcErc20Transformer.js'

const endpoints = getNetworkEndpoints(Network.TestnetSentry)
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
        'peggy0x87aB3B4C8661e07D6372361211B96ed4Dc36B1B5',
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
        '0xaDC7bcB5d8fe053Ef19b4E0C861c262Af6e0db60',
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
