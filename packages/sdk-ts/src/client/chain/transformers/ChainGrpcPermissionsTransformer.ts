import {
  Voucher,
  Namespace,
  RoleManager,
  PolicyStatus,
  AddressVoucher,
  PolicyManagerCapability,
  PermissionsModuleParams,
} from '../types/permissions.js'
import { InjectivePermissionsV1Beta1Query } from '@injectivelabs/core-proto-ts'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcPermissionsTransformer {
  static paramsResponseToParams(
    response: InjectivePermissionsV1Beta1Query.QueryParamsResponse,
  ): PermissionsModuleParams {
    return {
      wasmHookQueryMaxGas: response.params?.wasmHookQueryMaxGas || '0',
    }
  }

  static namespacesResponseToNamespaces(
    response: InjectivePermissionsV1Beta1Query.QueryNamespacesResponse,
  ): Namespace[] {
    return response.namespaces
  }

  static namespaceResponseToNamespace(
    response: InjectivePermissionsV1Beta1Query.QueryNamespaceResponse,
  ): Namespace {
    return response.namespace!
  }

  static namespaceDenomsResponseToNamespaceDenoms(
    response: InjectivePermissionsV1Beta1Query.QueryNamespaceDenomsResponse,
  ): string[] {
    return response.denoms
  }

  static actorsByRoleResponseToActorsByRole(
    response: InjectivePermissionsV1Beta1Query.QueryActorsByRoleResponse,
  ): string[] {
    return response.actors
  }

  static rolesByActorResponseToRolesByActor(
    response: InjectivePermissionsV1Beta1Query.QueryRolesByActorResponse,
  ): string[] {
    return response.roles
  }

  static roleManagersResponseToRoleManagers(
    response: InjectivePermissionsV1Beta1Query.QueryRoleManagersResponse,
  ): RoleManager[] {
    return response.roleManagers
  }

  static roleManagerResponseToRoleManager(
    response: InjectivePermissionsV1Beta1Query.QueryRoleManagerResponse,
  ): RoleManager {
    return response.roleManager!
  }

  static policyStatusesResponseToPolicyStatuses(
    response: InjectivePermissionsV1Beta1Query.QueryPolicyStatusesResponse,
  ): PolicyStatus[] {
    return response.policyStatuses
  }

  static policyManagerCapabilitiesResponseToPolicyManagerCapabilities(
    response: InjectivePermissionsV1Beta1Query.QueryPolicyManagerCapabilitiesResponse,
  ): PolicyManagerCapability[] {
    return response.policyManagerCapabilities
  }

  static vouchersResponseToVouchers(
    response: InjectivePermissionsV1Beta1Query.QueryVouchersResponse,
  ): AddressVoucher[] {
    return response.vouchers
  }

  static voucherResponseToVoucher(
    response: InjectivePermissionsV1Beta1Query.QueryVoucherResponse,
  ): Voucher {
    return response.voucher
  }
}
