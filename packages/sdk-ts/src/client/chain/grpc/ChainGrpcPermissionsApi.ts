import {
  UnspecifiedErrorCode,
  grpcErrorCodeToErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { InjectivePermissionsV1Beta1Query } from '@injectivelabs/core-proto-ts'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainGrpcPermissionsTransformer } from '../transformers/index.js'
import { ChainModule } from '../types/index.js'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcPermissionsApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Permissions

  protected client: InjectivePermissionsV1Beta1Query.QueryClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new InjectivePermissionsV1Beta1Query.QueryClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchAddressesByRole({ denom, role }: { denom: string; role: string }) {
    const request =
      InjectivePermissionsV1Beta1Query.QueryAddressesByRoleRequest.create()

    request.denom = denom
    request.role = role

    try {
      const response =
        await this.retry<InjectivePermissionsV1Beta1Query.QueryAddressesByRoleResponse>(
          () => this.client.AddressesByRole(request, this.metadata),
        )

      return ChainGrpcPermissionsTransformer.addressesByRolesResponseToAddressesByRoles(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectivePermissionsV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'AddressesByRole',
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'AddressesByRole',
      })
    }
  }

  async fetchAddressRoles({
    address,
    denom,
  }: {
    address: string
    denom: string
  }) {
    const request =
      InjectivePermissionsV1Beta1Query.QueryAddressRolesRequest.create()

    request.address = address
    request.denom = denom

    try {
      const response =
        await this.retry<InjectivePermissionsV1Beta1Query.QueryAddressRolesResponse>(
          () => this.client.AddressRoles(request, this.metadata),
        )

      return ChainGrpcPermissionsTransformer.addressRolesResponseToAddressRoles(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectivePermissionsV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'AddressRoles',
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'AddressRoles',
      })
    }
  }

  async fetchAllNamespaces() {
    const request =
      InjectivePermissionsV1Beta1Query.QueryAllNamespacesRequest.create()

    try {
      const response =
        await this.retry<InjectivePermissionsV1Beta1Query.QueryAllNamespacesResponse>(
          () => this.client.AllNamespaces(request, this.metadata),
        )

      return ChainGrpcPermissionsTransformer.allNamespacesResponseToAllNamespaces(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectivePermissionsV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'AllNamespaces',
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'AllNamespaces',
      })
    }
  }

  async fetchModuleParams() {
    const request = InjectivePermissionsV1Beta1Query.QueryParamsRequest.create()

    try {
      const response =
        await this.retry<InjectivePermissionsV1Beta1Query.QueryParamsResponse>(
          () => this.client.Params(request, this.metadata),
        )

      return ChainGrpcPermissionsTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectivePermissionsV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'Params',
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Params',
      })
    }
  }

  async fetchNamespaceByDenom({
    denom,
    includeRoles,
  }: {
    denom: string
    includeRoles: boolean
  }) {
    const request =
      InjectivePermissionsV1Beta1Query.QueryNamespaceByDenomRequest.create()

    request.denom = denom
    request.includeRoles = includeRoles

    try {
      const response =
        await this.retry<InjectivePermissionsV1Beta1Query.QueryNamespaceByDenomResponse>(
          () => this.client.NamespaceByDenom(request, this.metadata),
        )

      return ChainGrpcPermissionsTransformer.namespaceByDenomResponceToNamespaceByDenom(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectivePermissionsV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'NamespaceByDenom',
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'NamespaceByDenom',
      })
    }
  }

  async fetchVouchersForAddress({ address }: { address: string }) {
    const request =
      InjectivePermissionsV1Beta1Query.QueryVouchersForAddressRequest.create()

    request.address = address

    try {
      const response =
        await this.retry<InjectivePermissionsV1Beta1Query.QueryVouchersForAddressResponse>(
          () => this.client.VouchersForAddress(request, this.metadata),
        )

      return ChainGrpcPermissionsTransformer.vouchersForAddressResponseToVouchersForAddress(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectivePermissionsV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'VouchersForAddress',
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'VouchersForAddress',
      })
    }
  }
}
