import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { ChainGrpcEvmApi } from './ChainGrpcEvmApi.js'
import type { ChainGrpcEvmTransformer } from '../transformers/ChainGrpcEvmTransformer.js'

const endpoints = getNetworkEndpoints(Network.TestnetSentry)
const chainGrpcEvmApi = new ChainGrpcEvmApi(endpoints.grpc)

describe('ChainGrpcEvmApi', () => {
  test('fetchAccount', async () => {
    try {
      const response = await chainGrpcEvmApi.fetchAccount(
        '0x4e627B30b91aA49b47946596BeC0ba75ac8CAeb2',
      )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<typeof ChainGrpcEvmTransformer.accountResponseToAccount>
        >(response),
      )
    } catch (e) {
      console.error('ChainGrpcEvmApi.fetchAccount => ' + (e as any).message)
    }
  })

  test('fetchCosmosAccount', async () => {
    try {
      const response = await chainGrpcEvmApi.fetchCosmosAccount(
        '0x4e627B30b91aA49b47946596BeC0ba75ac8CAeb2',
      )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcEvmTransformer.cosmosAccountResponseToCosmosAccount
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcEvmApi.fetchCosmosAccount => ' + (e as any).message,
      )
    }
  })

  test.skip('fetchValidatorAccount', async () => {
    try {
      const response = await chainGrpcEvmApi.fetchValidatorAccount(
        'injvalcons1clqrvujvy9uf5ad4nnlz007x29zdcm2n7m8xkq',
      )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcEvmTransformer.validatorAccountResponseToValidatorAccount
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcEvmApi.fetchValidatorAccount => ' + (e as any).message,
      )
    }
  })

  test('fetchBalance', async () => {
    try {
      const response = await chainGrpcEvmApi.fetchBalance(
        '0x4e627B30b91aA49b47946596BeC0ba75ac8CAeb2',
      )

      expect(response).toBeDefined()
      expect(typeof response).toBe('string')
    } catch (e) {
      console.error('ChainGrpcEvmApi.fetchBalance => ' + (e as any).message)
    }
  })

  test('fetchStorage', async () => {
    try {
      const response = await chainGrpcEvmApi.fetchStorage(
        '0x4e627B30b91aA49b47946596BeC0ba75ac8CAeb2',
        '0',
      )

      expect(response).toBeDefined()
      expect(typeof response).toBe('string')
    } catch (e) {
      console.error('ChainGrpcEvmApi.fetchStorage => ' + (e as any).message)
    }
  })

  test('fetchCode', async () => {
    try {
      const response = await chainGrpcEvmApi.fetchCode(
        '0x4e627B30b91aA49b47946596BeC0ba75ac8CAeb2',
      )

      expect(response).toBeDefined()
      expect(response).toBeInstanceOf(Uint8Array)
    } catch (e) {
      console.error('ChainGrpcEvmApi.fetchCode => ' + (e as any).message)
    }
  })

  test('fetchParams', async () => {
    try {
      const response = await chainGrpcEvmApi.fetchParams()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<typeof ChainGrpcEvmTransformer.paramsResponseToParams>
        >(response),
      )
    } catch (e) {
      console.error('ChainGrpcEvmApi.fetchParams => ' + (e as any).message)
    }
  })

  test('fetchBaseFee', async () => {
    try {
      const response = await chainGrpcEvmApi.fetchBaseFee()

      expect(response).toBeDefined()
      expect(typeof response).toBe('string')
    } catch (e) {
      console.error('ChainGrpcEvmApi.fetchBaseFee => ' + (e as any).message)
    }
  })
})
