import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { ChainGrpcBankApi } from './ChainGrpcBankApi.js'
import { mockFactory } from '@injectivelabs/utils/test-utils'
import { ChainGrpcBankTransformer } from '../transformers/index.js'
import { CosmosBaseV1Beta1Coin } from '@injectivelabs/core-proto-ts'

const injectiveAddress = mockFactory.injectiveAddress
const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const chainGrpcBankApi = new ChainGrpcBankApi(endpoints.grpc)

describe('ChainGrpcBankApi', () => {
  test('fetchModuleParams', async () => {
    try {
      const response = await chainGrpcBankApi.fetchModuleParams()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcBankTransformer.moduleParamsResponseToModuleParams
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcBankApi.fetchModuleParams => ' + (e as any).message,
      )
    }
  })

  test('fetchBalance', async () => {
    try {
      const response = await chainGrpcBankApi.fetchBalance({
        accountAddress: injectiveAddress,
        denom: 'inj',
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<CosmosBaseV1Beta1Coin.Coin>(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcBankApi.fetchModuleState => ' + (e as any).message,
      )
    }
  })

  test('fetchBalances', async () => {
    try {
      const response = await chainGrpcBankApi.fetchBalances(injectiveAddress)

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<typeof ChainGrpcBankTransformer.balancesResponseToBalances>
        >(response),
      )
    } catch (e) {
      console.error('ChainGrpcBankApi.fetchBalances => ' + (e as any).message)
    }
  })

  test('fetchTotalSupply', async () => {
    try {
      const response = await chainGrpcBankApi.fetchTotalSupply({ limit: 1 })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcBankTransformer.totalSupplyResponseToTotalSupply
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcBankApi.fetchTotalSupply => ' + (e as any).message,
      )
    }
  })

  test('fetchSupplyOf', async () => {
    try {
      const response = await chainGrpcBankApi.fetchSupplyOf('inj')

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<typeof ChainGrpcBankTransformer.grpcCoinToCoin>
        >(response),
      )
    } catch (e) {
      console.error('ChainGrpcBankApi.fetchSupplyOf => ' + (e as any).message)
    }
  })

  test('fetchAllTotalSupply', async () => {
    try {
      const response = await chainGrpcBankApi.fetchAllTotalSupply()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcBankTransformer.totalSupplyResponseToTotalSupply
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcBankApi.fetchTotalSupply => ' + (e as any).message,
      )
    }
  })
})
