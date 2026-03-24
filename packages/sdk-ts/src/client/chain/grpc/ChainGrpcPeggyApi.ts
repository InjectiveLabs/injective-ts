import * as InjectivePeggyV1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/peggy/v1/query_pb'
import { QueryClient as InjectivePeggyV1QueryClient } from '@injectivelabs/core-proto-ts-v2/generated/injective/peggy/v1/query_pb.client'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainGrpcPeggyTransformer } from '../transformers/index.js'
import type { GrpcCallOptions } from '../../../types/index.js'
/**
 * @category Chain Grpc API
 */
export class ChainGrpcPeggyApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Peggy

  private get client() {
    return this.initClient(InjectivePeggyV1QueryClient)
  }

  async fetchModuleParams(options?: GrpcCallOptions) {
    const request = InjectivePeggyV1QueryPb.QueryParamsRequest.create()

    const response = await this.executeGrpcCall<
      InjectivePeggyV1QueryPb.QueryParamsRequest,
      InjectivePeggyV1QueryPb.QueryParamsResponse
    >(request, this.client.params.bind(this.client), options?.signal)

    return ChainGrpcPeggyTransformer.moduleParamsResponseToModuleParams(
      response,
    )
  }
}
