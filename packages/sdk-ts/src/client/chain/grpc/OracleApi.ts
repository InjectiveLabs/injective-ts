import { Query as OracleQuery } from '@injectivelabs/chain-api/injective/oracle/v1beta1/query_pb_service'
import {
  QueryParamsRequest as QueryOracleParamsRequest,
  QueryParamsResponse as QueryOracleParamsResponse,
} from '@injectivelabs/chain-api/injective/oracle/v1beta1/query_pb'
import BaseConsumer from '../../BaseGrpcConsumer'

export class OracleApi extends BaseConsumer {
  async fetchModuleParams() {
    const request = new QueryOracleParamsRequest()

    try {
      const response = await this.request<
        QueryOracleParamsRequest,
        QueryOracleParamsResponse,
        typeof OracleQuery.Params
      >(request, OracleQuery.Params)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
