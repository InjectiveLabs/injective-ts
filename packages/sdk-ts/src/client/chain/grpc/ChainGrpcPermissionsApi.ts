import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
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

  async fetchParams() {
    const request = InjectivePermissionsV1Beta1Query.QueryParamsRequest.create()

    try {
      const response =
        await this.retry<InjectivePermissionsV1Beta1Query.QueryParamsResponse>(
          () => this.client.Params(request, this.metadata),
        )

      return ChainGrpcPermissionsTransformer.paramsResponseToParams(response)
    } catch (e: unknown) {
      if (e instanceof InjectivePermissionsV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Params',
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Params',
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
          code: e.code,
          context: 'Namespaces',
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Namespaces',
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

      return ChainGrpcPermissionsTransformer.namespaceResponseToNamespace(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectivePermissionsV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Namespace',
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Namespace',
      })
    }
  }

  async fetchNamespaceDenoms(_namespace: string) {
    const request =
      InjectivePermissionsV1Beta1Query.QueryNamespaceDenomsRequest.create()

    // request.namespace = namespace

    try {
      const response =
        await this.retry<InjectivePermissionsV1Beta1Query.QueryNamespaceDenomsResponse>(
          () => this.client.NamespaceDenoms(request, this.metadata),
        )

      return ChainGrpcPermissionsTransformer.namespaceDenomsResponseToNamespaceDenoms(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectivePermissionsV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Namespace',
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Namespace',
      })
    }
  }

  async fetchActorsByRole(role: string, denom: string) {
    const request =
      InjectivePermissionsV1Beta1Query.QueryActorsByRoleRequest.create()

    request.role = role
    request.denom = denom

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
          code: e.code,
          context: 'ActorsByRole',
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'ActorsByRole',
      })
    }
  }

  async fetchRolesByActor(actor: string, denom: string) {
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
          code: e.code,
          context: 'RolesByActor',
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'RolesByActor',
      })
    }
  }

  async fetchRoleManagers(denom: string) {
    const request =
      InjectivePermissionsV1Beta1Query.QueryRoleManagersRequest.create()

    request.denom = denom

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
          code: e.code,
          context: 'RoleManagers',
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'RoleManagers',
      })
    }
  }

  async fetchRoleManager(manager: string, denom: string) {
    const request =
      InjectivePermissionsV1Beta1Query.QueryRoleManagerRequest.create()

    request.manager = manager
    request.denom = denom

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
          code: e.code,
          context: 'RoleManager',
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'RoleManager',
      })
    }
  }

  async fetchPolicyStatuses(denom: string) {
    const request =
      InjectivePermissionsV1Beta1Query.QueryPolicyStatusesRequest.create()

    request.denom = denom

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
          code: e.code,
          context: 'PolicyStatuses',
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
          code: e.code,
          context: 'PolicyManagerCapabilities',
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'PolicyManagerCapabilities',
      })
    }
  }

  async fetchVoucher(denom: string, address: string) {
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
          code: e.code,
          context: 'Voucher',
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
          code: e.code,
          context: 'Vouchers',
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Vouchers',
      })
    }
  }
}
