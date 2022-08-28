import { Query as IBCQuery } from '@injectivelabs/chain-api/ibc/applications/transfer/v1/query_pb_service'
import {
  QueryDenomTraceRequest,
  QueryDenomTraceResponse,
  QueryDenomTracesRequest,
  QueryDenomTracesResponse,
} from '@injectivelabs/chain-api/ibc/applications/transfer/v1/query_pb'
import BaseConsumer from '../../BaseGrpcConsumer'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcIbcApi extends BaseConsumer {
  async fetchDenomTrace(hash: string) {
    const request = new QueryDenomTraceRequest()
    request.setHash(hash)

    try {
      const response = await this.request<
        QueryDenomTraceRequest,
        QueryDenomTraceResponse,
        typeof IBCQuery.DenomTrace
      >(request, IBCQuery.DenomTrace)

      return response.getDenomTrace()!.toObject()
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchDenomsTrace() {
    const request = new QueryDenomTracesRequest()

    try {
      const response = await this.request<
        QueryDenomTracesRequest,
        QueryDenomTracesResponse,
        typeof IBCQuery.DenomTraces
      >(request, IBCQuery.DenomTraces)

      return response.getDenomTracesList().map((trace) => trace.toObject())
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
