import { Query as PeggyQuery } from '@injectivelabs/chain-api/injective/peggy/v1/query_pb_service'
import {
  QueryParamsRequest as QueryPeggyParamsRequest,
  QueryParamsResponse as QueryPeggyParamsResponse,
} from '@injectivelabs/chain-api/injective/peggy/v1/query_pb'
import BaseConsumer from '../../BaseGrpcConsumer'
import { ChainGrpcPeggyTransformer } from '../transformers'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcPeggyApi extends BaseConsumer {
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
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
