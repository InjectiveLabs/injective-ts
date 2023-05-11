import { ChainModule, OracleModuleParams } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { getGrpcWebImpl } from '../../BaseGrpcWebConsumer'
import { InjectiveOracleV1Beta1Query } from '@injectivelabs/core-proto-ts'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcOracleApi {
  protected module: string = ChainModule.Oracle

  protected client: InjectiveOracleV1Beta1Query.QueryClientImpl

  constructor(endpoint: string) {
    this.client = new InjectiveOracleV1Beta1Query.QueryClientImpl(
      getGrpcWebImpl(endpoint),
    )
  }

  async fetchModuleParams() {
    const request = InjectiveOracleV1Beta1Query.QueryParamsRequest.create()

    try {
      const response = await this.client.Params(request)

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
