import {
  QueryClientImpl,
  QueryModuleStateRequest,
  QueryWasmxParamsRequest,
} from '@injectivelabs/core-proto-ts/injective/wasmx/v1/query'
import { ChainModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { getRpcInterface } from '../../BaseGrpcConsumer'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcWasmXApi {
  protected module: string = ChainModule.WasmX

  protected query: QueryClientImpl

  constructor(endpoint: string) {
    this.query = new QueryClientImpl(getRpcInterface(endpoint))
  }

  async fetchModuleParams() {
    const request = QueryWasmxParamsRequest.create()

    try {
      const response = await this.query.WasmxParams(request)

      return response
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
    const request = QueryModuleStateRequest.create()

    try {
      const response = await this.query.WasmxModuleState(request)

      return response.state /* TODO */
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
