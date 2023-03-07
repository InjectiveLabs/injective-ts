import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { ChainGrpcBankApi } from './ChainGrpcBankApi'
import { mockFactory } from '@injectivelabs/test-utils'
import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
import { ChainGrpcBankTransformer } from '../transformers'

const injectiveAddress = mockFactory.injectiveAddress
const endpoints = getNetworkEndpoints(Network.MainnetK8s)
const chainGrpcBankApi = new ChainGrpcBankApi(endpoints.grpc)

describe.skip('ChainGrpcBankApi', () => {
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
      expect(response).toEqual(expect.objectContaining<Coin>(response))
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
})
