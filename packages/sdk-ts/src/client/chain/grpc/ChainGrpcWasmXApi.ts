import { Query as WasmXQuery } from '@injectivelabs/chain-api/injective/wasmx/v1/query_pb_service'
import {
  QueryModuleStateRequest,
  QueryModuleStateResponse,
  QueryWasmxParamsRequest,
  QueryWasmxParamsResponse,
} from '@injectivelabs/chain-api/injective/wasmx/v1/query_pb'
import BaseConsumer from '../../BaseGrpcConsumer'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcWasmXApi extends BaseConsumer {
  async fetchModuleParams() {
    const request = new QueryWasmxParamsRequest()

    try {
      const response = await this.request<
        QueryWasmxParamsRequest,
        QueryWasmxParamsResponse,
        typeof WasmXQuery.WasmxParams
      >(request, WasmXQuery.WasmxParams)

      return response.toObject()
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchModuleState() {
    const request = new QueryModuleStateRequest()

    try {
      const response = await this.request<
        QueryModuleStateRequest,
        QueryModuleStateResponse,
        typeof WasmXQuery.WasmxModuleState
      >(request, WasmXQuery.WasmxModuleState)

      return response.getState()!.toObject() /* TODO */
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
