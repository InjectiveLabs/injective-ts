import * as CosmosAuthzV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/authz/v1beta1/query_pb'
import { QueryClient as CosmosAuthzV1BetaQueryClient } from '@injectivelabs/core-proto-ts-v2/generated/cosmos/authz/v1beta1/query_pb.client'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainGrpcAuthZTransformer } from '../transformers/ChainGrpcAuthZTransformer.js'
import { ChainGrpcCommonTransformer } from '../transformers/ChainGrpcCommonTransformer.js'
import type { PaginationOption } from '../../../types/pagination.js'
/**
 * @category Chain Grpc API
 */
export class ChainGrpcAuthZApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Authz

  private get client() {
    return this.initClient(CosmosAuthzV1BetaQueryClient)
  }

  async fetchGrants({
    pagination,
    granter,
    grantee,
    msgTypeUrl,
  }: {
    pagination?: PaginationOption
    granter: string
    grantee: string
    msgTypeUrl?: string
  }) {
    const request = CosmosAuthzV1Beta1QueryPb.QueryGrantsRequest.create()

    if (granter) {
      request.granter = granter
    }

    if (grantee) {
      request.grantee = grantee
    }

    if (msgTypeUrl) {
      request.msgTypeUrl = msgTypeUrl
    }

    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    const response = await this.executeGrpcCall<
      CosmosAuthzV1Beta1QueryPb.QueryGrantsRequest,
      CosmosAuthzV1Beta1QueryPb.QueryGrantsResponse
    >(request, this.client.grants.bind(this.client))

    return ChainGrpcAuthZTransformer.grpcGrantsToGrants(response)
  }

  async fetchGranterGrants(granter: string, pagination?: PaginationOption) {
    const request = CosmosAuthzV1Beta1QueryPb.QueryGranterGrantsRequest.create()

    if (granter) {
      request.granter = granter
    }

    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    const response = await this.executeGrpcCall<
      CosmosAuthzV1Beta1QueryPb.QueryGranterGrantsRequest,
      CosmosAuthzV1Beta1QueryPb.QueryGranterGrantsResponse
    >(request, this.client.granterGrants.bind(this.client))

    return ChainGrpcAuthZTransformer.grpcGranterGrantsToGranterGrants(response)
  }

  async fetchGranteeGrants(grantee: string, pagination?: PaginationOption) {
    const request = CosmosAuthzV1Beta1QueryPb.QueryGranteeGrantsRequest.create()

    if (grantee) {
      request.grantee = grantee
    }

    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    const response = await this.executeGrpcCall<
      CosmosAuthzV1Beta1QueryPb.QueryGranteeGrantsRequest,
      CosmosAuthzV1Beta1QueryPb.QueryGranteeGrantsResponse
    >(request, this.client.granteeGrants.bind(this.client))

    return ChainGrpcAuthZTransformer.grpcGranteeGrantsToGranteeGrants(response)
  }
}
