import { Query } from '@injectivelabs/chain-api/injective/exchange/v1beta1/query_pb_service'
import {
  QueryExchangeParamsRequest,
  QueryExchangeParamsResponse,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/query_pb'
import { GrpcException } from '@injectivelabs/exceptions'
import { GrpcExchangeParams } from '../types'
import BaseConsumer from '../BaseConsumer'

export class ExchangeConsumer extends BaseConsumer {
  async fetchParams() {
    const request = new QueryExchangeParamsRequest()

    try {
      const response = await this.request<
        QueryExchangeParamsRequest,
        QueryExchangeParamsResponse,
        typeof Query.QueryExchangeParams
      >(request, Query.QueryExchangeParams)

      return response.getParams() as GrpcExchangeParams
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }
}
