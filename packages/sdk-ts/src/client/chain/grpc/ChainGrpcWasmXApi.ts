import * as InjectiveWasmxV1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/wasmx/v1/query_pb.mjs'
import { QueryClient as InjectiveWasmxV1QueryClient } from '@injectivelabs/core-proto-ts-v2/generated/injective/wasmx/v1/query_pb.client.mjs'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumerV2 from '../../base/BaseGrpcConsumerV2.js'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcWasmXApi extends BaseGrpcConsumerV2 {
  protected module: string = ChainModule.WasmX
  private client: InjectiveWasmxV1QueryClient

  constructor(endpoint: string) {
    super(endpoint)
    this.client = new InjectiveWasmxV1QueryClient(this.transport)
  }

  async fetchModuleParams() {
    const request = InjectiveWasmxV1QueryPb.QueryWasmxParamsRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveWasmxV1QueryPb.QueryWasmxParamsRequest,
      InjectiveWasmxV1QueryPb.QueryWasmxParamsResponse
    >(request, this.client.wasmxParams.bind(this.client))

    return response
  }

  async fetchModuleState() {
    const request = InjectiveWasmxV1QueryPb.QueryModuleStateRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveWasmxV1QueryPb.QueryModuleStateRequest,
      InjectiveWasmxV1QueryPb.QueryModuleStateResponse
    >(request, this.client.wasmxModuleState.bind(this.client))

    return response.state /* TODO */
  }
}
