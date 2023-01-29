import {
  QueryClientImpl,
  QueryParamsRequest as QueryOracleParamsRequest,
} from '@injectivelabs/core-proto-ts/injective/oracle/v1beta1/query'
import { ChainModule, OracleModuleParams } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { getRpcInterface } from '../../BaseGrpcConsumer'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcOracleApi {
  protected module: string = ChainModule.Oracle

  protected query: QueryClientImpl

  constructor(endpoint: string) {
    this.query = new QueryClientImpl(getRpcInterface(endpoint))
  }

  async fetchModuleParams() {
    const request = QueryOracleParamsRequest.create()

    try {
      const response = await this.query.Params(request)

      return response as OracleModuleParams
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
