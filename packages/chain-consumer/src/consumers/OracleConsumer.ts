import { Query } from '@injectivelabs/chain-api/injective/oracle/v1beta1/query_pb_service'
import {
  QueryParamsRequest,
  QueryParamsResponse,
} from '@injectivelabs/chain-api/injective/oracle/v1beta1/query_pb'
import { GrpcException } from '@injectivelabs/exceptions'
import BaseConsumer from '../BaseConsumer'
import { GrpcOracleParams } from '../types'

export class OracleConsumer extends BaseConsumer {
  async fetchParams() {
    const request = new QueryParamsRequest()

    try {
      const response = await this.request<
        QueryParamsRequest,
        QueryParamsResponse,
        typeof Query.Params
      >(request, Query.Params)

      return response.getParams() as GrpcOracleParams
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }
}
