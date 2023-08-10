import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { CosmosAuthzV1Beta1Query } from '@injectivelabs/core-proto-ts'
import BaseGrpcConsumer from '../../BaseGrpcConsumer'
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

  async fetchGrants(pagination?: PaginationOption) {
    const request = CosmosAuthzV1Beta1Query.QueryGrantsRequest.create()

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response =
        await this.retry<CosmosAuthzV1Beta1Query.QueryGrantsResponse>(() =>
          this.client.Grants(request),
        )

      return ChainGrpcAuthZTransformer.grpcGrantsToGrants(response)
    } catch (e: unknown) {
      if (e instanceof CosmosAuthzV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Params',
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
}
