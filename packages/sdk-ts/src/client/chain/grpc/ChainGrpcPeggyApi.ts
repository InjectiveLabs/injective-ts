import { Query as PeggyQuery } from '@injectivelabs/chain-api/injective/peggy/v1/query_pb_service'
import {
  QueryParamsRequest as QueryPeggyParamsRequest,
  QueryParamsResponse as QueryPeggyParamsResponse,
} from '@injectivelabs/chain-api/injective/peggy/v1/query_pb'
import BaseConsumer from '../../BaseGrpcConsumer'
import { ChainGrpcPeggyTransformer } from '../transformers'
import { ChainModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcPeggyApi extends BaseConsumer {
  protected module: string = ChainModule.Peggy

  async fetchModuleParams() {
    const request = new QueryPeggyParamsRequest()

    try {
      const response = await this.request<
        QueryPeggyParamsRequest,
        QueryPeggyParamsResponse,
        typeof PeggyQuery.Params
      >(request, PeggyQuery.Params)

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
