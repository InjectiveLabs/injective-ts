import { Query as OracleQuery } from '@injectivelabs/chain-api/injective/oracle/v1beta1/query_pb_service'
import {
  QueryParamsRequest as QueryOracleParamsRequest,
  QueryParamsResponse as QueryOracleParamsResponse,
} from '@injectivelabs/chain-api/injective/oracle/v1beta1/query_pb'
import BaseConsumer from '../../BaseGrpcConsumer'
import { ChainModule, OracleModuleParams } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcOracleApi extends BaseConsumer {
  protected module: string = ChainModule.Oracle

  async fetchModuleParams() {
    const request = new QueryOracleParamsRequest()

    try {
      const response = await this.request<
        QueryOracleParamsRequest,
        QueryOracleParamsResponse,
        typeof OracleQuery.Params
      >(request, OracleQuery.Params)

      return response.toObject() as OracleModuleParams
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }
}
