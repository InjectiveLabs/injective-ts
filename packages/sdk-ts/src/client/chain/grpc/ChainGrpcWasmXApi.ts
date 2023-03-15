import { ChainModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { getGrpcWebImpl } from '../../BaseGrpcWebConsumer'
import { InjectiveWasmxV1Beta1Query } from '@injectivelabs/core-proto-ts'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcWasmXApi {
  protected module: string = ChainModule.WasmX

  protected client: InjectiveWasmxV1Beta1Query.QueryClientImpl

  constructor(endpoint: string) {
    this.client = new InjectiveWasmxV1Beta1Query.QueryClientImpl(
      getGrpcWebImpl(endpoint),
    )
  }

  async fetchModuleParams() {
    const request = InjectiveWasmxV1Beta1Query.QueryWasmxParamsRequest.create()

    try {
      const response = await this.client.WasmxParams(request)

      return response
    } catch (e: unknown) {
      if (e instanceof InjectiveWasmxV1Beta1Query.GrpcWebError) {
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

  async fetchModuleState() {
    const request = InjectiveWasmxV1Beta1Query.QueryModuleStateRequest.create()

    try {
      const response = await this.client.WasmxModuleState(request)

      return response.state /* TODO */
    } catch (e: unknown) {
      if (e instanceof InjectiveWasmxV1Beta1Query.GrpcWebError) {
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
