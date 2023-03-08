import {
  QueryClientImpl,
  QueryParamsRequest as QueryOracleParamsRequest,
} from '@injectivelabs/core-proto-ts/injective/oracle/v1beta1/query'
import { ChainModule, OracleModuleParams } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { getGrpcWebImpl } from '../../BaseGrpcWebConsumer'
import { GrpcWebError } from '@injectivelabs/core-proto-ts/tendermint/abci/types'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcOracleApi {
  protected module: string = ChainModule.Oracle

  protected client: QueryClientImpl

  constructor(endpoint: string) {
    this.client = new QueryClientImpl(getGrpcWebImpl(endpoint))
  }

  async fetchModuleParams() {
    const request = QueryOracleParamsRequest.create()

    try {
      const response = await this.client.Params(request)

      return response.params as OracleModuleParams
    } catch (e: unknown) {
      if (e instanceof GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }
}
