import { InjectiveWasmxV1Query } from '@injectivelabs/core-proto-ts'
import {
  UnspecifiedErrorCode,
  grpcErrorCodeToErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcWasmXApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.WasmX

  protected client: InjectiveWasmxV1Query.QueryClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new InjectiveWasmxV1Query.QueryClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchModuleParams() {
    const request = InjectiveWasmxV1Query.QueryWasmxParamsRequest.create()

    try {
      const response =
        await this.retry<InjectiveWasmxV1Query.QueryWasmxParamsResponse>(() =>
          this.client.WasmxParams(request, this.metadata),
        )

      return response
    } catch (e: unknown) {
      if (e instanceof InjectiveWasmxV1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'WasmxParams',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'WasmxParams',
        contextModule: this.module,
      })
    }
  }

  async fetchModuleState() {
    const request = InjectiveWasmxV1Query.QueryModuleStateRequest.create()

    try {
      const response =
        await this.retry<InjectiveWasmxV1Query.QueryModuleStateResponse>(() =>
          this.client.WasmxModuleState(request, this.metadata),
        )

      return response.state /* TODO */
    } catch (e: unknown) {
      if (e instanceof InjectiveWasmxV1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'WasmxModuleState',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'WasmxModuleState',
        contextModule: this.module,
      })
    }
  }
}
