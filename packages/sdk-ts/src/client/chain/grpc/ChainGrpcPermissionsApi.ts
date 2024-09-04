import {
    GrpcUnaryRequestException,
    UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { InjectivePermissionsV1Beta1Query } from '@injectivelabs/core-proto-ts'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer'
import { ChainGrpcPermissionsTransformer } from '../transformers'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcPermissionsApi extends BaseGrpcConsumer {
  //protected module: string = ChainModule.

  protected client: InjectivePermissionsV1Beta1Query.QueryClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new InjectivePermissionsV1Beta1Query.QueryClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }



  async fetchModuleParams() {
    const request = InjectivePermissionsV1Beta1Query.QueryParamsRequest.create()

    try {
      const response =
        await this.retry<InjectivePermissionsV1Beta1Query.QueryParamsResponse>(() =>
          this.client.Params(request, this.metadata),
        )

      return ChainGrpcPermissionsTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectivePermissionsV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Params',
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Params',
      })
    }
  }

}
