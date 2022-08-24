import { Query as OracleQuery } from '@injectivelabs/chain-api/injective/oracle/v1beta1/query_pb_service'
import {
  QueryParamsRequest as QueryOracleParamsRequest,
  QueryParamsResponse as QueryOracleParamsResponse,
} from '@injectivelabs/chain-api/injective/oracle/v1beta1/query_pb'
import BaseConsumer from '../../BaseGrpcConsumer'
import { OracleModuleParams } from '../types'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcOracleApi extends BaseConsumer {
  async fetchModuleParams() {
    const request = new QueryOracleParamsRequest()

    try {
      const response = await this.request<
        QueryOracleParamsRequest,
        QueryOracleParamsResponse,
        typeof OracleQuery.Params
      >(request, OracleQuery.Params)

      return response.toObject() as OracleModuleParams
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
