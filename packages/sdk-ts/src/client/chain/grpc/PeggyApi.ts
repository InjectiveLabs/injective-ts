import { Query as PeggyQuery } from '@injectivelabs/chain-api/injective/peggy/v1/query_pb_service'
import {
  QueryParamsRequest as QueryPeggyParamsRequest,
  QueryParamsResponse as QueryPeggyParamsResponse,
} from '@injectivelabs/chain-api/injective/peggy/v1/query_pb'
import BaseConsumer from '../../BaseGrpcConsumer'

export class PeggyApi extends BaseConsumer {
  async moduleParams() {
    const request = new QueryPeggyParamsRequest()

    try {
      const response = await this.request<
        QueryPeggyParamsRequest,
        QueryPeggyParamsResponse,
        typeof PeggyQuery.Params
      >(request, PeggyQuery.Params)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
