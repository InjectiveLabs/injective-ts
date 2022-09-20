import { Query as WasmXQuery } from '@injectivelabs/chain-api/injective/wasmx/v1/query_pb_service'
import {
  QueryModuleStateRequest,
  QueryModuleStateResponse,
  QueryWasmxParamsRequest,
  QueryWasmxParamsResponse,
} from '@injectivelabs/chain-api/injective/wasmx/v1/query_pb'
import BaseConsumer from '../../BaseGrpcConsumer'
import { ChainModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcWasmXApi extends BaseConsumer {
  protected module: string = ChainModule.WasmX

  async fetchModuleParams() {
    const request = new QueryWasmxParamsRequest()

    try {
      const response = await this.request<
        QueryWasmxParamsRequest,
        QueryWasmxParamsResponse,
        typeof WasmXQuery.WasmxParams
      >(request, WasmXQuery.WasmxParams)

      return response.toObject()
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

  async fetchModuleState() {
    const request = new QueryModuleStateRequest()

    try {
      const response = await this.request<
        QueryModuleStateRequest,
        QueryModuleStateResponse,
        typeof WasmXQuery.WasmxModuleState
      >(request, WasmXQuery.WasmxModuleState)

      return response.getState()!.toObject() /* TODO */
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
