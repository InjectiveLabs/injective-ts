import * as IbcApplicationsTransferV1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/ibc/applications/transfer/v1/query_pb'
import { QueryClient as IbcApplicationsTransferV1QueryClient } from '@injectivelabs/core-proto-ts-v2/generated/ibc/applications/transfer/v1/query_pb.client'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainGrpcCommonTransformer } from '../transformers/ChainGrpcCommonTransformer.js'
import type { GrpcCallOptions } from '../../../types/index.js'
import type { PaginationOption } from '../../../types/pagination.js'
/**
 * @category Chain Grpc API
 */
export class ChainGrpcIbcApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Ibc

  private get client() {
    return this.initClient(IbcApplicationsTransferV1QueryClient)
  }

  async fetchDenomTrace(hash: string, options?: GrpcCallOptions) {
    const request =
      IbcApplicationsTransferV1QueryPb.QueryDenomTraceRequest.create()

    request.hash = hash

    const response = await this.executeGrpcCall<
      IbcApplicationsTransferV1QueryPb.QueryDenomTraceRequest,
      IbcApplicationsTransferV1QueryPb.QueryDenomTraceResponse
    >(request, this.client.denomTrace.bind(this.client), options?.signal)

    return response.denomTrace!
  }

  async fetchDenomsTrace(
    pagination?: PaginationOption,
    options?: GrpcCallOptions,
  ) {
    const request =
      IbcApplicationsTransferV1QueryPb.QueryDenomTracesRequest.create()

    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    const response = await this.executeGrpcCall<
      IbcApplicationsTransferV1QueryPb.QueryDenomTracesRequest,
      IbcApplicationsTransferV1QueryPb.QueryDenomTracesResponse
    >(request, this.client.denomTraces.bind(this.client), options?.signal)

    return response.denomTraces
  }
}
