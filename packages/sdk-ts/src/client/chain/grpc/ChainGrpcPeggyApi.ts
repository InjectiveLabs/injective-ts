import {
  QueryClientImpl,
  QueryParamsRequest as QueryPeggyParamsRequest,
} from '@injectivelabs/core-proto-ts/injective/peggy/v1/query'
import { ChainGrpcPeggyTransformer } from '../transformers'
import { ChainModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { getRpcInterface } from '../../BaseGrpcConsumer'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcPeggyApi {
  protected module: string = ChainModule.Peggy

  protected query: QueryClientImpl

  constructor(endpoint: string) {
    this.query = new QueryClientImpl(getRpcInterface(endpoint))
  }

  async fetchModuleParams() {
    const request = QueryPeggyParamsRequest.create()

    try {
      const response = await this.query.Params(request)

      return ChainGrpcPeggyTransformer.moduleParamsResponseToModuleParams(
        response,
      )
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
