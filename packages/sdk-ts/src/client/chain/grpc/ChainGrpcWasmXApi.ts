import {
  UnspecifiedErrorCode,
  grpcErrorCodeToErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { InjectiveWasmxV1Beta1Query } from '@injectivelabs/core-proto-ts'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainModule } from '../types/index.js'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcWasmXApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.WasmX

  protected client: InjectiveWasmxV1Beta1Query.QueryClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new InjectiveWasmxV1Beta1Query.QueryClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchModuleParams() {
    const request = InjectiveWasmxV1Beta1Query.QueryWasmxParamsRequest.create()

    try {
      const response =
        await this.retry<InjectiveWasmxV1Beta1Query.QueryWasmxParamsResponse>(
          () => this.client.WasmxParams(request, this.metadata),
        )

      return response
    } catch (e: unknown) {
      if (e instanceof InjectiveWasmxV1Beta1Query.GrpcWebError) {
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
    const request = InjectiveWasmxV1Beta1Query.QueryModuleStateRequest.create()

    try {
      const response =
        await this.retry<InjectiveWasmxV1Beta1Query.QueryModuleStateResponse>(
          () => this.client.WasmxModuleState(request, this.metadata),
        )

      return response.state /* TODO */
    } catch (e: unknown) {
      if (e instanceof InjectiveWasmxV1Beta1Query.GrpcWebError) {
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
