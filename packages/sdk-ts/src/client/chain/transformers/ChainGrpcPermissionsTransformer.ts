import {
    Namespace,
    PermissionsModuleParams,
    GrpcPermissionsNamespace,
} from '../types/permissions';
import { InjectivePermissionsV1Beta1Query } from '@injectivelabs/core-proto-ts';

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcPermissionsTransformer {
    static moduleParamsResponseToModuleParams(
        response: InjectivePermissionsV1Beta1Query.QueryParamsResponse,
    ): PermissionsModuleParams {
        const params = response.params!

        return {
            wasmHookQueryMaxGas: params.wasmHookQueryMaxGas,
        }
    }

    static grpcNamespaceToNamespace (
        grpcNamespace: GrpcPermissionsNamespace,
    ): Namespace {
        return {
            denom: grpcNamespace.denom,
            wasmHook: grpcNamespace.wasmHook,
            mintsPaused: grpcNamespace.mintsPaused,
            sendsPaused: grpcNamespace.sendsPaused,
            burnsPaused: grpcNamespace.burnsPaused,
            rolePermissions: grpcNamespace.rolePermissions,
            addressRoles: grpcNamespace.addressRoles,
        }
    }

    static addressRolesResponseToAddressRoles(
        response: InjectivePermissionsV1Beta1Query.QueryAddressRolesResponse,
    ){ return response.roles.map((role) => {
            return {
              roles: role,
          }
        })
    }

    static AddressesByRolesResponseToAddressesByRoles (
        response: InjectivePermissionsV1Beta1Query.QueryAddressesByRoleResponse,
    ){ return response.addresses.map((address) => {
        return {
            addresses: address,
        }
    })
    }

    static allNamespacesResponseToAllNamespaces (
        response: InjectivePermissionsV1Beta1Query.QueryAllNamespacesResponse,
    ) {
        return response.namespaces.map((namespace) => {
            ChainGrpcPermissionsTransformer.grpcNamespaceToNamespace(namespace)
        })
    }

    static namespaceByDenomResponceToNamespaceByDenom (
        response: InjectivePermissionsV1Beta1Query.QueryNamespaceByDenomResponse,
    ) {
        return ChainGrpcPermissionsTransformer.grpcNamespaceToNamespace(response.namespace!)
    }

    static vouchersForAddressResponseToVouchersForAddress (
        response: InjectivePermissionsV1Beta1Query.QueryVouchersForAddressResponse,
    ) {
        return response.vouchers.map((voucher) => {
           return {
                vouchers: voucher,
           }
        })
    }
}
