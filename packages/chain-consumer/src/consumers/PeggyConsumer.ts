import { Query } from '@injectivelabs/chain-api/injective/peggy/v1/query_pb_service'
import {
  QueryParamsRequest,
  QueryParamsResponse,
} from '@injectivelabs/chain-api/injective/peggy/v1/query_pb'
import { GrpcException } from '@injectivelabs/exceptions'
import BaseConsumer from '../BaseConsumer'
import { GrpcPeggyParams } from '../types'

export class PeggyConsumer extends BaseConsumer {
  async fetchParams() {
    const request = new QueryParamsRequest()

    try {
      const response = await this.request<
        QueryParamsRequest,
        QueryParamsResponse,
        typeof Query.Params
      >(request, Query.Params)

      return response.getParams() as GrpcPeggyParams
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }
}
