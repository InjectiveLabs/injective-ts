import { ChainGrpcCommonTransformer } from './ChainGrpcCommonTransformer.js'
import type * as InjectivePermissionsV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/permissions/v1beta1/query_pb'
import type {
  PermissionRole,
  GrpcPermissionRole,
  PermissionNamespace,
  PermissionActorRoles,
  PermissionRoleManager,
  PermissionPolicyStatus,
  PermissionsModuleParams,
  GrpcPermissionNamespace,
  PermissionAddressVoucher,
  GrpcPermissionActorRoles,
  GrpcPermissionRoleManager,
  GrpcPermissionPolicyStatus,
  GrpcPermissionAddressVoucher,
  PermissionPolicyManagerCapability,
  GrpcPermissionPolicyStatusManagerCapability,
} from '../types/permissions.js'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcPermissionsTransformer {
  static grpcRoleToRole(grpcRole: GrpcPermissionRole): PermissionRole {
    return {
      name: grpcRole.name,
      roleId: grpcRole.roleId,
      permissions: grpcRole.permissions,
    }
  }

  static grpcActorRolesToActorRoles(
    grpcActorRoles: GrpcPermissionActorRoles,
  ): PermissionActorRoles {
    return {
      actor: grpcActorRoles.actor,
      roles: grpcActorRoles.roles,
    }
  }

  static grpcRoleManagerToRoleManager(
    grpcRoleManager: GrpcPermissionRoleManager,
  ): PermissionRoleManager {
    return {
      roles: grpcRoleManager.roles,
      manager: grpcRoleManager.manager,
    }
  }

  static grpcPolicyStatusToPolicyStatus(
    grpcPolicyStatus: GrpcPermissionPolicyStatus,
  ): PermissionPolicyStatus {
    return {
      action: grpcPolicyStatus.action,
      isSealed: grpcPolicyStatus.isSealed,
      isDisabled: grpcPolicyStatus.isDisabled,
    }
  }

  static grpcPolicyManagerCapabilityToPolicyManagerCapability(
    grpcPolicyManagerCapability: GrpcPermissionPolicyStatusManagerCapability,
  ): PermissionPolicyManagerCapability {
    return {
      action: grpcPolicyManagerCapability.action,
      canSeal: grpcPolicyManagerCapability.canSeal,
      manager: grpcPolicyManagerCapability.manager,
      canDisable: grpcPolicyManagerCapability.canDisable,
    }
  }

  static grpcAddressVoucherToAddressVoucher(
    grpcAddressVoucher: GrpcPermissionAddressVoucher,
  ): PermissionAddressVoucher {
    return {
      address: grpcAddressVoucher.address,
      voucher: grpcAddressVoucher.voucher
        ? ChainGrpcCommonTransformer.grpcCoinToCoin(grpcAddressVoucher.voucher)
        : undefined,
    }
  }

  static grpcNamespaceToNamespace(
    grpcNamespace: GrpcPermissionNamespace,
  ): PermissionNamespace {
    return {
      denom: grpcNamespace.denom,
      evmHook: grpcNamespace.evmHook,
      wasmHook: grpcNamespace.wasmHook,
      rolePermissions: grpcNamespace.rolePermissions.map(
        ChainGrpcPermissionsTransformer.grpcRoleToRole,
      ),
      actorRoles: grpcNamespace.actorRoles.map(
        ChainGrpcPermissionsTransformer.grpcActorRolesToActorRoles,
      ),
      roleManagers: grpcNamespace.roleManagers.map(
        ChainGrpcPermissionsTransformer.grpcRoleManagerToRoleManager,
      ),
      policyStatuses: grpcNamespace.policyStatuses.map(
        ChainGrpcPermissionsTransformer.grpcPolicyStatusToPolicyStatus,
      ),
      policyManagerCapabilities: grpcNamespace.policyManagerCapabilities.map(
        ChainGrpcPermissionsTransformer.grpcPolicyManagerCapabilityToPolicyManagerCapability,
      ),
    }
  }

  static moduleParamsResponseToModuleParams(
    response: InjectivePermissionsV1Beta1QueryPb.QueryParamsResponse,
  ): PermissionsModuleParams {
    const params = response.params

    if (!params) {
      throw new Error('Params not found in response')
    }

    return {
      wasmHookQueryMaxGas: params.contractHookMaxGas.toString(),
    }
  }

  static nameSpaceDenomsResponseToNameSpaceDenoms(
    response: InjectivePermissionsV1Beta1QueryPb.QueryNamespaceDenomsResponse,
  ) {
    return response.denoms.map((denom) => denom)
  }

  static namespaceResponseToNamespaces(
    response: InjectivePermissionsV1Beta1QueryPb.QueryNamespaceResponse,
  ) {
    if (!response.namespace) {
      return
    }

    return ChainGrpcPermissionsTransformer.grpcNamespaceToNamespace(
      response.namespace,
    )
  }

  static namespacesResponseToNamespaces(
    response: InjectivePermissionsV1Beta1QueryPb.QueryNamespacesResponse,
  ) {
    return response.namespaces.map((namespace) => {
      ChainGrpcPermissionsTransformer.grpcNamespaceToNamespace(namespace)
    })
  }

  static actorsByRoleResponseToActorsByRole(
    response: InjectivePermissionsV1Beta1QueryPb.QueryActorsByRoleResponse,
  ) {
    return response.actors.map((role) => {
      return {
        roles: role,
      }
    })
  }

  static rolesByActorResponseToRolesByActor(
    response: InjectivePermissionsV1Beta1QueryPb.QueryRolesByActorResponse,
  ) {
    return response.roles.map((role) => {
      return {
        roles: role,
      }
    })
  }

  static roleManagerResponseToRoleManager(
    response: InjectivePermissionsV1Beta1QueryPb.QueryRoleManagerResponse,
  ) {
    if (!response.roleManager) {
      return
    }

    return ChainGrpcPermissionsTransformer.grpcRoleManagerToRoleManager(
      response.roleManager,
    )
  }

  static roleManagersResponseToRoleManagers(
    response: InjectivePermissionsV1Beta1QueryPb.QueryRoleManagersResponse,
  ) {
    return response.roleManagers.map(
      ChainGrpcPermissionsTransformer.grpcRoleManagerToRoleManager,
    )
  }

  static policyStatusesResponseToPolicyStatuses(
    response: InjectivePermissionsV1Beta1QueryPb.QueryPolicyStatusesResponse,
  ) {
    return response.policyStatuses.map(
      ChainGrpcPermissionsTransformer.grpcPolicyStatusToPolicyStatus,
    )
  }

  static policyManagerCapabilitiesResponseToPolicyManagerCapabilities(
    response: InjectivePermissionsV1Beta1QueryPb.QueryPolicyManagerCapabilitiesResponse,
  ) {
    return response.policyManagerCapabilities.map(
      ChainGrpcPermissionsTransformer.grpcPolicyManagerCapabilityToPolicyManagerCapability,
    )
  }

  static voucherResponseToVoucher(
    response: InjectivePermissionsV1Beta1QueryPb.QueryVoucherResponse,
  ) {
    if (!response.voucher) {
      return
    }

    return ChainGrpcCommonTransformer.grpcCoinToCoin(response.voucher)
  }

  static vouchersResponseToVouchers(
    response: InjectivePermissionsV1Beta1QueryPb.QueryVouchersResponse,
  ) {
    return response.vouchers.map(
      ChainGrpcPermissionsTransformer.grpcAddressVoucherToAddressVoucher,
    )
  }

  static moduleStateResponseToModuleState(
    response: InjectivePermissionsV1Beta1QueryPb.QueryModuleStateResponse,
  ) {
    if (!response.state) {
      return
    }

    return {
      params:
        ChainGrpcPermissionsTransformer.moduleParamsResponseToModuleParams(
          response.state,
        ),
      namespaces: response.state.namespaces.map(
        ChainGrpcPermissionsTransformer.grpcNamespaceToNamespace,
      ),
      vouchers: response.state.vouchers.map(
        ChainGrpcPermissionsTransformer.grpcAddressVoucherToAddressVoucher,
      ),
    }
  }
}
