import { InjectivePeggyV1Query } from '@injectivelabs/core-proto-ts'
import {
  UnspecifiedErrorCode,
  grpcErrorCodeToErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainGrpcPeggyTransformer } from '../transformers/index.js'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcPeggyApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Peggy

  protected client: InjectivePeggyV1Query.QueryClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new InjectivePeggyV1Query.QueryClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchModuleParams() {
    const request = InjectivePeggyV1Query.QueryParamsRequest.create()

    try {
      const response =
        await this.retry<InjectivePeggyV1Query.QueryParamsResponse>(() =>
          this.client.Params(request, this.metadata),
        )

      return ChainGrpcPeggyTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectivePeggyV1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'Params',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Params',
        contextModule: this.module,
      })
    }
  }
}
