import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { ChainGrpcPermissionsTransformer } from '../transformers'
import { mockFactory } from '@injectivelabs/test-utils'
import { ChainGrpcPermissionsApi } from './ChainGrpcPermissionsApi'
import { INJ_DENOM } from '@injectivelabs/utils'

const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const chainGrpcPermissionsApi = new ChainGrpcPermissionsApi(endpoints.grpc)
const injectiveAddress = mockFactory.injectiveAddress

describe('ChainGrpcPermissionsApi', () => {
  test('fetchModuleParams', async () => {
    try {
      const response = await chainGrpcPermissionsApi.fetchModuleParams()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcPermissionsTransformer.moduleParamsResponseToModuleParams
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcPermissionsApi.fetchModuleParams => ' + (e as any).message,
      )
    }
  })
  test('fetchAddressRoles', async () => {
    try {
      const response = await chainGrpcPermissionsApi.fetchAddressRoles({
        address: injectiveAddress,
        denom: INJ_DENOM,
      })

      if (response.length === 0) {
        console.warn('fetchAddressRoles.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcPermissionsTransformer.addressRolesResponseToAddressRoles
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcPermissionsApi.fetchAddressRoles => ' + (e as any).message,
      )
    }
  })
  test('fetchAddressesByRoles', async () => {
    try {
      const response = await chainGrpcPermissionsApi.fetchAddressesByRole({
        denom: INJ_DENOM,
        role: 'role',
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcPermissionsTransformer.addressesByRolesResponseToAddressesByRoles
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcPermissionsApi.fetchAddressesByRoles => ' +
          (e as any).message,
      )
    }
  })
  test('fetchAllNamespaces', async () => {
    try {
      const response = await chainGrpcPermissionsApi.fetchAllNamespaces()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcPermissionsTransformer.allNamespacesResponseToAllNamespaces
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcPermissionsApi.fetchAllNamespaces => ' + (e as any).message,
      )
    }
  })
  test('fetchNamespaceByDenom', async () => {
    try {
      const response = await chainGrpcPermissionsApi.fetchNamespaceByDenom({
        denom: INJ_DENOM,
        include_roles: true,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcPermissionsTransformer.namespaceByDenomResponceToNamespaceByDenom
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcPermissionsApi.fetchNamespaceByDenom=> ' + (e as any).message,
      )
    }
  })
  test('fetchVouchersForAddress', async () => {
    try {
      const response = await chainGrpcPermissionsApi.fetchVouchersForAddress({
        address: injectiveAddress,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcPermissionsTransformer.vouchersForAddressResponseToVouchersForAddress
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcPermissionsApi.fetchVouchersForAddress => ' +
          (e as any).message,
      )
    }
  })
})
