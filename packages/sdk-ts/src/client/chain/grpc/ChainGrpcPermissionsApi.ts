import * as InjectivePermissionsV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/permissions/v1beta1/query_pb.mjs'
import { QueryClient as InjectivePermissionsV1Beta1QueryClient } from '@injectivelabs/core-proto-ts-v2/generated/injective/permissions/v1beta1/query_pb.client.mjs'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainGrpcPermissionsTransformer } from '../transformers/index.js'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcPermissionsApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Permissions
  private client: InjectivePermissionsV1Beta1QueryClient

  constructor(endpoint: string) {
    super(endpoint)
    this.client = new InjectivePermissionsV1Beta1QueryClient(this.transport)
  }

  async fetchModuleParams() {
    const request =
      InjectivePermissionsV1Beta1QueryPb.QueryParamsRequest.create()

    const response = await this.executeGrpcCall<
      InjectivePermissionsV1Beta1QueryPb.QueryParamsRequest,
      InjectivePermissionsV1Beta1QueryPb.QueryParamsResponse
    >(request, this.client.params.bind(this.client))

    return ChainGrpcPermissionsTransformer.moduleParamsResponseToModuleParams(
      response,
    )
  }

  async fetchNamespaceDenoms() {
    const request =
      InjectivePermissionsV1Beta1QueryPb.QueryNamespaceDenomsRequest.create()

    const response = await this.executeGrpcCall<
      InjectivePermissionsV1Beta1QueryPb.QueryNamespaceDenomsRequest,
      InjectivePermissionsV1Beta1QueryPb.QueryNamespaceDenomsResponse
    >(request, this.client.namespaceDenoms.bind(this.client))

    return ChainGrpcPermissionsTransformer.nameSpaceDenomsResponseToNameSpaceDenoms(
      response,
    )
  }

  async fetchNamespaces() {
    const request =
      InjectivePermissionsV1Beta1QueryPb.QueryNamespacesRequest.create()

    const response = await this.executeGrpcCall<
      InjectivePermissionsV1Beta1QueryPb.QueryNamespacesRequest,
      InjectivePermissionsV1Beta1QueryPb.QueryNamespacesResponse
    >(request, this.client.namespaces.bind(this.client))

    return ChainGrpcPermissionsTransformer.namespacesResponseToNamespaces(
      response,
    )
  }

  async fetchNamespace(denom: string) {
    const request =
      InjectivePermissionsV1Beta1QueryPb.QueryNamespaceRequest.create()

    request.denom = denom

    const response = await this.executeGrpcCall<
      InjectivePermissionsV1Beta1QueryPb.QueryNamespaceRequest,
      InjectivePermissionsV1Beta1QueryPb.QueryNamespaceResponse
    >(request, this.client.namespace.bind(this.client))

    return ChainGrpcPermissionsTransformer.namespaceResponseToNamespaces(
      response,
    )
  }

  async fetchActorsByRole({ denom, role }: { denom: string; role: string }) {
    const request =
      InjectivePermissionsV1Beta1QueryPb.QueryActorsByRoleRequest.create()

    request.denom = denom
    request.role = role

    const response = await this.executeGrpcCall<
      InjectivePermissionsV1Beta1QueryPb.QueryActorsByRoleRequest,
      InjectivePermissionsV1Beta1QueryPb.QueryActorsByRoleResponse
    >(request, this.client.actorsByRole.bind(this.client))

    return ChainGrpcPermissionsTransformer.actorsByRoleResponseToActorsByRole(
      response,
    )
  }

  async fetchRolesByActor({ actor, denom }: { actor: string; denom: string }) {
    const request =
      InjectivePermissionsV1Beta1QueryPb.QueryRolesByActorRequest.create()

    request.actor = actor
    request.denom = denom

    const response = await this.executeGrpcCall<
      InjectivePermissionsV1Beta1QueryPb.QueryRolesByActorRequest,
      InjectivePermissionsV1Beta1QueryPb.QueryRolesByActorResponse
    >(request, this.client.rolesByActor.bind(this.client))

    return ChainGrpcPermissionsTransformer.rolesByActorResponseToRolesByActor(
      response,
    )
  }

  async fetchRoleManager({
    denom,
    manager,
  }: {
    denom: string
    manager: string
  }) {
    const request =
      InjectivePermissionsV1Beta1QueryPb.QueryRoleManagerRequest.create()

    request.denom = denom
    request.manager = manager

    const response = await this.executeGrpcCall<
      InjectivePermissionsV1Beta1QueryPb.QueryRoleManagerRequest,
      InjectivePermissionsV1Beta1QueryPb.QueryRoleManagerResponse
    >(request, this.client.roleManager.bind(this.client))

    return ChainGrpcPermissionsTransformer.roleManagerResponseToRoleManager(
      response,
    )
  }

  async fetchRoleManagers() {
    const request =
      InjectivePermissionsV1Beta1QueryPb.QueryRoleManagersRequest.create()

    const response = await this.executeGrpcCall<
      InjectivePermissionsV1Beta1QueryPb.QueryRoleManagersRequest,
      InjectivePermissionsV1Beta1QueryPb.QueryRoleManagersResponse
    >(request, this.client.roleManagers.bind(this.client))

    return ChainGrpcPermissionsTransformer.roleManagersResponseToRoleManagers(
      response,
    )
  }

  async fetchPolicyStatuses() {
    const request =
      InjectivePermissionsV1Beta1QueryPb.QueryPolicyStatusesRequest.create()

    const response = await this.executeGrpcCall<
      InjectivePermissionsV1Beta1QueryPb.QueryPolicyStatusesRequest,
      InjectivePermissionsV1Beta1QueryPb.QueryPolicyStatusesResponse
    >(request, this.client.policyStatuses.bind(this.client))

    return ChainGrpcPermissionsTransformer.policyStatusesResponseToPolicyStatuses(
      response,
    )
  }

  async fetchPolicyManagerCapabilities(denom: string) {
    const request =
      InjectivePermissionsV1Beta1QueryPb.QueryPolicyManagerCapabilitiesRequest.create()

    request.denom = denom

    const response = await this.executeGrpcCall<
      InjectivePermissionsV1Beta1QueryPb.QueryPolicyManagerCapabilitiesRequest,
      InjectivePermissionsV1Beta1QueryPb.QueryPolicyManagerCapabilitiesResponse
    >(request, this.client.policyManagerCapabilities.bind(this.client))

    return ChainGrpcPermissionsTransformer.policyManagerCapabilitiesResponseToPolicyManagerCapabilities(
      response,
    )
  }

  async fetchVoucher({ denom, address }: { denom: string; address: string }) {
    const request =
      InjectivePermissionsV1Beta1QueryPb.QueryVoucherRequest.create()

    request.denom = denom
    request.address = address

    const response = await this.executeGrpcCall<
      InjectivePermissionsV1Beta1QueryPb.QueryVoucherRequest,
      InjectivePermissionsV1Beta1QueryPb.QueryVoucherResponse
    >(request, this.client.voucher.bind(this.client))

    return ChainGrpcPermissionsTransformer.voucherResponseToVoucher(response)
  }

  async fetchVouchers(denom: string) {
    const request =
      InjectivePermissionsV1Beta1QueryPb.QueryVouchersRequest.create()

    request.denom = denom

    const response = await this.executeGrpcCall<
      InjectivePermissionsV1Beta1QueryPb.QueryVouchersRequest,
      InjectivePermissionsV1Beta1QueryPb.QueryVouchersResponse
    >(request, this.client.vouchers.bind(this.client))

    return ChainGrpcPermissionsTransformer.vouchersResponseToVouchers(response)
  }

  async fetchModuleState() {
    const request =
      InjectivePermissionsV1Beta1QueryPb.QueryModuleStateRequest.create()

    const response = await this.executeGrpcCall<
      InjectivePermissionsV1Beta1QueryPb.QueryModuleStateRequest,
      InjectivePermissionsV1Beta1QueryPb.QueryModuleStateResponse
    >(request, this.client.permissionsModuleState.bind(this.client))

    return ChainGrpcPermissionsTransformer.moduleStateResponseToModuleState(
      response,
    )
  }
}
