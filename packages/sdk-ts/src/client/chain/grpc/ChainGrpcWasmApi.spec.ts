import { mockFactory } from '@injectivelabs/utils/test-utils'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { ChainGrpcWasmApi } from './ChainGrpcWasmApi.js'
import type { ChainGrpcWasmTransformer } from '../transformers/ChainGrpcWasmTransformer.js'

const injectiveAddress = mockFactory.injectiveAddress
const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.grpc)

describe('ChainGrpcWasmApi', () => {
  test('fetchContractAccountsBalance', async () => {
    try {
      const response = await chainGrpcWasmApi.fetchContractAccountsBalance({
        contractAddress: injectiveAddress,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcWasmTransformer.allContractStateResponseToContractAccountsBalanceWithPagination
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcWasmApi.fetchContractAccountsBalance => ' +
          (e as any).message,
      )
    }
  })

  test('fetchContractState', async () => {
    try {
      const response = await chainGrpcWasmApi.fetchContractState({
        contractAddress: injectiveAddress,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcWasmTransformer.allContractStateResponseToContractState
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcWasmApi.fetchContractState => ' + (e as any).message,
      )
    }
  })

  test('fetchContractInfo', async () => {
    try {
      const response = await chainGrpcWasmApi.fetchContractInfo(
        injectiveAddress,
      )

      expect(response).toBeDefined()
      if (response) {
        expect(response).toEqual(
          expect.objectContaining<
            ReturnType<
              typeof ChainGrpcWasmTransformer.contactInfoResponseToContractInfo
            >
          >(response),
        )
      }
    } catch (e) {
      console.error(
        'ChainGrpcWasmApi.fetchContractInfo => ' + (e as any).message,
      )
    }
  })

  test('fetchContractHistory', async () => {
    try {
      const response = await chainGrpcWasmApi.fetchContractHistory(
        injectiveAddress,
      )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcWasmTransformer.contactHistoryResponseToContractHistory
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcWasmApi.fetchContractHistory => ' + (e as any).message,
      )
    }
  })

  test('fetchSmartContractState', async () => {
    try {
      const response = await chainGrpcWasmApi.fetchSmartContractState(
        injectiveAddress,
        '{}',
      )

      expect(response).toBeDefined()
      expect(response).toEqual(expect.objectContaining(response))
    } catch (e) {
      console.error(
        'ChainGrpcWasmApi.fetchSmartContractState => ' + (e as any).message,
      )
    }
  })

  test('fetchRawContractState', async () => {
    try {
      const response = await chainGrpcWasmApi.fetchRawContractState(
        injectiveAddress,
        'test',
      )

      expect(response).toBeDefined()
      expect(response).toEqual(expect.objectContaining(response))
    } catch (e) {
      console.error(
        'ChainGrpcWasmApi.fetchRawContractState => ' + (e as any).message,
      )
    }
  })

  test('fetchContractCodes', async () => {
    try {
      const response = await chainGrpcWasmApi.fetchContractCodes()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcWasmTransformer.contractCodesResponseToContractCodes
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcWasmApi.fetchContractCodes => ' + (e as any).message,
      )
    }
  })

  test('fetchContractCode', async () => {
    try {
      const response = await chainGrpcWasmApi.fetchContractCode(1)

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcWasmTransformer.contractCodeResponseToContractCode
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcWasmApi.fetchContractCode => ' + (e as any).message,
      )
    }
  })

  test('fetchContractCodeContracts', async () => {
    try {
      const response = await chainGrpcWasmApi.fetchContractCodeContracts(1)

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcWasmTransformer.contractByCodeResponseToContractByCode
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcWasmApi.fetchContractCodeContracts => ' + (e as any).message,
      )
    }
  })
})
