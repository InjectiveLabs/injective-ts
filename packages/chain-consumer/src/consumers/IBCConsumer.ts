import { Query } from '@injectivelabs/chain-api/ibc/applications/transfer/v1/query_pb_service'
import { GrpcException } from '@injectivelabs/exceptions'
import {
  QueryDenomTraceRequest,
  QueryDenomTraceResponse,
  QueryDenomTracesRequest,
  QueryDenomTracesResponse,
} from '@injectivelabs/chain-api/ibc/applications/transfer/v1/query_pb'
import BaseConsumer from '../BaseConsumer'

export class IBCConsumer extends BaseConsumer {
  async fetchDenomTrace(hash: string) {
    const request = new QueryDenomTraceRequest()
    request.setHash(hash)

    try {
      const response = await this.request<
        QueryDenomTraceRequest,
        QueryDenomTraceResponse,
        typeof Query.DenomTrace
      >(request, Query.DenomTrace)

      return response.getDenomTrace()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchDenomsTrace() {
    const request = new QueryDenomTracesRequest()

    try {
      const response = await this.request<
        QueryDenomTracesRequest,
        QueryDenomTracesResponse,
        typeof Query.DenomTraces
      >(request, Query.DenomTraces)

      return response.getDenomTracesList()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }
}
