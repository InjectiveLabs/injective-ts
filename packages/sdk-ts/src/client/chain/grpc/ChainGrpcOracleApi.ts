import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { InjectiveOracleV1Beta1Query } from '@injectivelabs/core-proto-ts'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer'
import { ChainModule, OracleModuleParams } from '../types'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcOracleApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Oracle

  protected client: InjectiveOracleV1Beta1Query.QueryClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new InjectiveOracleV1Beta1Query.QueryClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchModuleParams() {
    const request = InjectiveOracleV1Beta1Query.QueryParamsRequest.create()

    try {
      const response =
        await this.retry<InjectiveOracleV1Beta1Query.QueryParamsResponse>(() =>
          this.client.Params(request, this.metadata),
        )

      return response.params as OracleModuleParams
    } catch (e: unknown) {
      if (e instanceof InjectiveOracleV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
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
