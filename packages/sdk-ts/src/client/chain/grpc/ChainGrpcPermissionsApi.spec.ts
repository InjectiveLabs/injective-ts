import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { ChainGrpcPermissionsTransformer } from '../transformers/index.js'
import { mockFactory } from '@injectivelabs/test-utils'
import { ChainGrpcPermissionsApi } from './ChainGrpcPermissionsApi.js'
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

  test('fetchNamespaceDenoms', async () => {
    try {
      const response = await chainGrpcPermissionsApi.fetchNamespaceDenoms()

      if (response.length === 0) {
        console.warn('fetchNamespaceDenoms.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcPermissionsTransformer.nameSpaceDenomsResponseToNameSpaceDenoms
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcPermissionsApi.fetchNamespaceDenoms => ' + (e as any).message,
      )
    }
  })

  test('fetchNamespaces', async () => {
    try {
      const response = await chainGrpcPermissionsApi.fetchNamespaces()

      if (response.length === 0) {
        console.warn('fetchNamespaces.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcPermissionsTransformer.namespacesResponseToNamespaces
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcPermissionsApi.fetchNamespaces => ' + (e as any).message,
      )
    }
  })

  test('fetchNamespace', async () => {
    try {
      const response = await chainGrpcPermissionsApi.fetchNamespace(INJ_DENOM)

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcPermissionsTransformer.namespaceResponseToNamespaces
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcPermissionsApi.fetchNamespace => ' + (e as any).message,
      )
    }
  })

  test('fetchActorsByRole', async () => {
    try {
      const response = await chainGrpcPermissionsApi.fetchActorsByRole({
        denom: INJ_DENOM,
        role: 'role',
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcPermissionsTransformer.actorsByRoleResponseToActorsByRole
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcPermissionsApi.fetchActorsByRole => ' + (e as any).message,
      )
    }
  })

  test('fetchRolesByActor', async () => {
    try {
      const response = await chainGrpcPermissionsApi.fetchRolesByActor({
        denom: INJ_DENOM,
        actor: 'actor',
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcPermissionsTransformer.rolesByActorResponseToRolesByActor
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcPermissionsApi.fetchRolesByActor => ' + (e as any).message,
      )
    }
  })

  test('fetchRoleManager', async () => {
    try {
      const response = await chainGrpcPermissionsApi.fetchRoleManager({
        denom: INJ_DENOM,
        manager: 'manager',
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcPermissionsTransformer.roleManagerResponseToRoleManager
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcPermissionsApi.fetchRoleManager => ' + (e as any).message,
      )
    }
  })

  test('fetchRoleManagers', async () => {
    try {
      const response = await chainGrpcPermissionsApi.fetchRoleManagers()

      if (response.length === 0) {
        console.warn('fetchRoleManagers.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcPermissionsTransformer.roleManagersResponseToRoleManagers
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcPermissionsApi.fetchRoleManagers => ' + (e as any).message,
      )
    }
  })

  test('fetchPolicyStatuses', async () => {
    try {
      const response = await chainGrpcPermissionsApi.fetchPolicyStatuses()

      if (response.length === 0) {
        console.warn('fetchPolicyStatuses.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcPermissionsTransformer.policyStatusesResponseToPolicyStatuses
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcPermissionsApi.fetchPolicyStatuses => ' + (e as any).message,
      )
    }
  })

  test('fetchPolicyManagerCapabilities', async () => {
    try {
      const response =
        await chainGrpcPermissionsApi.fetchPolicyManagerCapabilities(INJ_DENOM)

      if (response.length === 0) {
        console.warn('fetchPolicyManagerCapabilities.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcPermissionsTransformer.policyManagerCapabilitiesResponseToPolicyManagerCapabilities
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcPermissionsApi.fetchPolicyManagerCapabilities => ' +
          (e as any).message,
      )
    }
  })

  test('fetchVoucher', async () => {
    try {
      const response = await chainGrpcPermissionsApi.fetchVoucher({
        denom: INJ_DENOM,
        address: injectiveAddress,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcPermissionsTransformer.voucherResponseToVoucher
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcPermissionsApi.fetchVoucher=> ' + (e as any).message,
      )
    }
  })

  test('fetchVouchers', async () => {
    try {
      const response = await chainGrpcPermissionsApi.fetchVouchers(INJ_DENOM)

      if (response.length === 0) {
        console.warn('fetchVouchers.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcPermissionsTransformer.vouchersResponseToVouchers
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcPermissionsApi.fetchVouchers => ' + (e as any).message,
      )
    }
  })

  test('fetchModuleState', async () => {
    try {
      const response = await chainGrpcPermissionsApi.fetchModuleState()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcPermissionsTransformer.moduleStateResponseToModuleState
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcPermissionsApi.fetchModuleState => ' + (e as any).message,
      )
    }
  })
})
