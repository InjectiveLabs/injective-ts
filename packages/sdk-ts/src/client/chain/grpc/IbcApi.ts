import { Query as IBCQuery } from '@injectivelabs/chain-api/ibc/applications/transfer/v1/query_pb_service'
import {
  QueryDenomTraceRequest,
  QueryDenomTraceResponse,
  QueryDenomTracesRequest,
  QueryDenomTracesResponse,
} from '@injectivelabs/chain-api/ibc/applications/transfer/v1/query_pb'
import BaseConsumer from '../../BaseGrpcConsumer'

export class IbcApi extends BaseConsumer {
  async denomTrace(hash: string) {
    const request = new QueryDenomTraceRequest()
    request.setHash(hash)

    try {
      const response = await this.request<
        QueryDenomTraceRequest,
        QueryDenomTraceResponse,
        typeof IBCQuery.DenomTrace
      >(request, IBCQuery.DenomTrace)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async denomsTrace() {
    const request = new QueryDenomTracesRequest()

    try {
      const response = await this.request<
        QueryDenomTracesRequest,
        QueryDenomTracesResponse,
        typeof IBCQuery.DenomTraces
      >(request, IBCQuery.DenomTraces)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
