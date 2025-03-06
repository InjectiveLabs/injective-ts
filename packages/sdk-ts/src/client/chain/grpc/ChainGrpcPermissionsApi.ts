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
          contextModule: this.module
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Params',
        contextModule: this.module
      })
    }
  }

  async fetchNamespaceDenoms() {
    const request =
      InjectivePermissionsV1Beta1Query.QueryNamespaceDenomsRequest.create()

    try {
      const response =
        await this.retry<InjectivePermissionsV1Beta1Query.QueryNamespaceDenomsResponse>(
          () => this.client.NamespaceDenoms(request, this.metadata),
        )

      return ChainGrpcPermissionsTransformer.nameSpaceDenomsResponseToNameSpaceDenoms(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectivePermissionsV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'NamespaceByDenoms',
          contextModule: this.module
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'NamespaceDenoms',
        contextModule: this.module
      })
    }
  }

  async fetchNamespaces() {
    const request =
      InjectivePermissionsV1Beta1Query.QueryNamespacesRequest.create()

    try {
      const response =
        await this.retry<InjectivePermissionsV1Beta1Query.QueryNamespacesResponse>(
          () => this.client.Namespaces(request, this.metadata),
        )

      return ChainGrpcPermissionsTransformer.namespacesResponseToNamespaces(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectivePermissionsV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'Namespaces',
          contextModule: this.module
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Namespaces',
        contextModule: this.module
      })
    }
  }

  async fetchNamespace(denom: string) {
    const request =
      InjectivePermissionsV1Beta1Query.QueryNamespaceRequest.create()

    request.denom = denom

    try {
      const response =
        await this.retry<InjectivePermissionsV1Beta1Query.QueryNamespaceResponse>(
          () => this.client.Namespace(request, this.metadata),
        )

      return ChainGrpcPermissionsTransformer.namespaceResponseToNamespaces(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectivePermissionsV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'Namespace',
          contextModule: this.module
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Namespace',
        contextModule: this.module
      })
    }
  }

  async fetchActorsByRole({ denom, role }: { denom: string; role: string }) {
    const request =
      InjectivePermissionsV1Beta1Query.QueryActorsByRoleRequest.create()

    request.denom = denom
    request.role = role

    try {
      const response =
        await this.retry<InjectivePermissionsV1Beta1Query.QueryActorsByRoleResponse>(
          () => this.client.ActorsByRole(request, this.metadata),
        )

      return ChainGrpcPermissionsTransformer.actorsByRoleResponseToActorsByRole(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectivePermissionsV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'ActorsByRole',
          contextModule: this.module
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'ActorsByRole',
        contextModule: this.module
      })
    }
  }

  async fetchRolesByActor({ actor, denom }: { actor: string; denom: string }) {
    const request =
      InjectivePermissionsV1Beta1Query.QueryRolesByActorRequest.create()

    request.actor = actor
    request.denom = denom

    try {
      const response =
        await this.retry<InjectivePermissionsV1Beta1Query.QueryRolesByActorResponse>(
          () => this.client.RolesByActor(request, this.metadata),
        )

      return ChainGrpcPermissionsTransformer.rolesByActorResponseToRolesByActor(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectivePermissionsV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'RolesByActor',
          contextModule: this.module
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'RolesByActor',
        contextModule: this.module
      })
    }
  }

  async fetchRoleManager({
    denom,
    manager,
  }: {
    denom: string
    manager: string
  }) {
    const request =
      InjectivePermissionsV1Beta1Query.QueryRoleManagerRequest.create()

    request.denom = denom
    request.manager = manager

    try {
      const response =
        await this.retry<InjectivePermissionsV1Beta1Query.QueryRoleManagerResponse>(
          () => this.client.RoleManager(request, this.metadata),
        )

      return ChainGrpcPermissionsTransformer.roleManagerResponseToRoleManager(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectivePermissionsV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'RoleManager',
          contextModule: this.module
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'RoleManager',
        contextModule: this.module
      })
    }
  }

  async fetchRoleManagers() {
    const request =
      InjectivePermissionsV1Beta1Query.QueryRoleManagersRequest.create()

    try {
      const response =
        await this.retry<InjectivePermissionsV1Beta1Query.QueryRoleManagersResponse>(
          () => this.client.RoleManagers(request, this.metadata),
        )

      return ChainGrpcPermissionsTransformer.roleManagersResponseToRoleManagers(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectivePermissionsV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'RoleManagers',
          contextModule: this.module
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'RoleManagers',
        contextModule: this.module
      })
    }
  }

  async fetchPolicyStatuses() {
    const request =
      InjectivePermissionsV1Beta1Query.QueryPolicyStatusesRequest.create()

    try {
      const response =
        await this.retry<InjectivePermissionsV1Beta1Query.QueryPolicyStatusesResponse>(
          () => this.client.PolicyStatuses(request, this.metadata),
        )

      return ChainGrpcPermissionsTransformer.policyStatusesResponseToPolicyStatuses(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectivePermissionsV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'PolicyStatuses',
          contextModule: this.module
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'PolicyStatuses',
      })
    }
  }

  async fetchPolicyManagerCapabilities(denom: string) {
    const request =
      InjectivePermissionsV1Beta1Query.QueryPolicyManagerCapabilitiesRequest.create()

    request.denom = denom

    try {
      const response =
        await this.retry<InjectivePermissionsV1Beta1Query.QueryPolicyManagerCapabilitiesResponse>(
          () => this.client.PolicyManagerCapabilities(request, this.metadata),
        )

      return ChainGrpcPermissionsTransformer.policyManagerCapabilitiesResponseToPolicyManagerCapabilities(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectivePermissionsV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'PolicyManagerCapabilities',
          contextModule: this.module
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'PolicyManagerCapabilities',
        contextModule: this.module
      })
    }
  }

  async fetchVoucher({ denom, address }: { denom: string; address: string }) {
    const request =
      InjectivePermissionsV1Beta1Query.QueryVoucherRequest.create()

    request.denom = denom
    request.address = address

    try {
      const response =
        await this.retry<InjectivePermissionsV1Beta1Query.QueryVoucherResponse>(
          () => this.client.Voucher(request, this.metadata),
        )

      return ChainGrpcPermissionsTransformer.voucherResponseToVoucher(response)
    } catch (e: unknown) {
      if (e instanceof InjectivePermissionsV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'Voucher',
          contextModule: this.module
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Voucher',
      })
    }
  }

  async fetchVouchers(denom: string) {
    const request =
      InjectivePermissionsV1Beta1Query.QueryVouchersRequest.create()

    request.denom = denom

    try {
      const response =
        await this.retry<InjectivePermissionsV1Beta1Query.QueryVouchersResponse>(
          () => this.client.Vouchers(request, this.metadata),
        )

      return ChainGrpcPermissionsTransformer.vouchersResponseToVouchers(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectivePermissionsV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'VouchersForAddress',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'VouchersForAddress',
        contextModule: this.module,
      })
    }
  }

  async fetchModuleState() {
    const request =
      InjectivePermissionsV1Beta1Query.QueryModuleStateRequest.create()

    try {
      const response =
        await this.retry<InjectivePermissionsV1Beta1Query.QueryModuleStateResponse>(
          () => this.client.PermissionsModuleState(request, this.metadata),
        )

      return ChainGrpcPermissionsTransformer.moduleStateResponseToModuleState(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectivePermissionsV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'ModuleState',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'ModuleState',
      })
    }
  }
}
