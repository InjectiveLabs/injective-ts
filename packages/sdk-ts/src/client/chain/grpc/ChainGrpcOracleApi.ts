import * as InjectiveOracleV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/oracle/v1beta1/query_pb'
import { QueryClient as InjectiveOracleV1Beta1QueryClient } from '@injectivelabs/core-proto-ts-v2/generated/injective/oracle/v1beta1/query_pb.client'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import type { OracleModuleParams } from '../types/index.js'
import type { GrpcCallOptions } from '../../../types/index.js'
/**
 * @category Chain Grpc API
 */
export class ChainGrpcOracleApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Oracle

  private get client() {
    return this.initClient(InjectiveOracleV1Beta1QueryClient)
  }

  async fetchModuleParams(options?: GrpcCallOptions) {
    const request = InjectiveOracleV1Beta1QueryPb.QueryParamsRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveOracleV1Beta1QueryPb.QueryParamsRequest,
      InjectiveOracleV1Beta1QueryPb.QueryParamsResponse
    >(request, this.client.params.bind(this.client), options?.signal)

    return response.params as OracleModuleParams
  }
}
