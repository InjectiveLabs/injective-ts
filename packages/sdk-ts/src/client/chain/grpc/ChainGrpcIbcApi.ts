import * as IbcApplicationsTransferV1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/ibc/applications/transfer/v1/query_pb.mjs'
import { QueryClient as IbcApplicationsTransferV1QueryClient } from '@injectivelabs/core-proto-ts-v2/generated/ibc/applications/transfer/v1/query_pb.client.mjs'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainGrpcCommonTransformer } from '../transformers/ChainGrpcCommonTransformer.js'
import type { PaginationOption } from '../../../types/pagination.js'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcIbcApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Ibc
  private client: IbcApplicationsTransferV1QueryClient

  constructor(endpoint: string) {
    super(endpoint)
    this.client = new IbcApplicationsTransferV1QueryClient(this.transport)
  }

  async fetchDenomTrace(hash: string) {
    const request =
      IbcApplicationsTransferV1QueryPb.QueryDenomTraceRequest.create()

    request.hash = hash

    const response = await this.executeGrpcCall<
      IbcApplicationsTransferV1QueryPb.QueryDenomTraceRequest,
      IbcApplicationsTransferV1QueryPb.QueryDenomTraceResponse
    >(request, this.client.denomTrace.bind(this.client))

    return response.denomTrace!
  }

  async fetchDenomsTrace(pagination?: PaginationOption) {
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
    >(request, this.client.denomTraces.bind(this.client))

    return response.denomTraces
  }
}
