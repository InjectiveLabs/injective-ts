import {
  UnspecifiedErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { CosmosAuthzV1Beta1Query } from '@injectivelabs/core-proto-ts'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer'
import { ChainModule } from '../types'
import { PaginationOption } from '../../../types/pagination'
import { paginationRequestFromPagination } from '../../../utils/pagination'
import { ChainGrpcAuthZTransformer } from '../transformers/ChainGrpcAuthZTransformer'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcAuthZApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Authz

  protected client: CosmosAuthzV1Beta1Query.QueryClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new CosmosAuthzV1Beta1Query.QueryClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
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
    const request = CosmosAuthzV1Beta1Query.QueryGrantsRequest.create()

    if (granter) {
      request.granter = granter
    }

    if (grantee) {
      request.grantee = grantee
    }

    if (msgTypeUrl) {
      request.msgTypeUrl = msgTypeUrl
    }

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response =
        await this.retry<CosmosAuthzV1Beta1Query.QueryGrantsResponse>(() =>
          this.client.Grants(request, this.metadata),
        )

      return ChainGrpcAuthZTransformer.grpcGrantsToGrants(response)
    } catch (e: unknown) {
      if (e instanceof CosmosAuthzV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Grants',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Grants',
        contextModule: this.module,
      })
    }
  }

  async fetchGranterGrants(granter: string, pagination?: PaginationOption) {
    const request = CosmosAuthzV1Beta1Query.QueryGranterGrantsRequest.create()

    if (granter) {
      request.granter = granter
    }

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response =
        await this.retry<CosmosAuthzV1Beta1Query.QueryGranterGrantsResponse>(
          () => this.client.GranterGrants(request, this.metadata),
        )

      return ChainGrpcAuthZTransformer.grpcGranterGrantsToGranterGrants(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmosAuthzV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'GranterGrants',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GranterGrants',
        contextModule: this.module,
      })
    }
  }

  async fetchGranteeGrants(grantee: string, pagination?: PaginationOption) {
    const request = CosmosAuthzV1Beta1Query.QueryGranteeGrantsRequest.create()

    if (grantee) {
      request.grantee = grantee
    }

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response =
        await this.retry<CosmosAuthzV1Beta1Query.QueryGranteeGrantsResponse>(
          () => this.client.GranteeGrants(request, this.metadata),
        )

      return ChainGrpcAuthZTransformer.grpcGranteeGrantsToGranteeGrants(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmosAuthzV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'GranteeGrants',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GranteeGrants',
        contextModule: this.module,
      })
    }
  }
}
