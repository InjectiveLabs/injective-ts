import {
  UnspecifiedErrorCode,
  grpcErrorCodeToErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { InjectiveTxFeesV1Beta1Query } from '@injectivelabs/core-proto-ts'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainGrpcTxFeesTransformer } from '../transformers/index.js'
import { ChainModule } from '../types/index.js'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcTxFeesApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.TxFees

  protected client: InjectiveTxFeesV1Beta1Query.QueryClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new InjectiveTxFeesV1Beta1Query.QueryClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchModuleParams() {
    const request = InjectiveTxFeesV1Beta1Query.QueryParamsRequest.create()

    try {
      const response =
        await this.retry<InjectiveTxFeesV1Beta1Query.QueryParamsResponse>(() =>
          this.client.Params(request, this.metadata),
        )

      return ChainGrpcTxFeesTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveTxFeesV1Beta1Query.GrpcWebError) {
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

  async fetchEipBaseFee() {
    const request = InjectiveTxFeesV1Beta1Query.QueryEipBaseFeeRequest.create()

    try {
      const response =
        await this.retry<InjectiveTxFeesV1Beta1Query.QueryEipBaseFeeResponse>(
          () => this.client.GetEipBaseFee(request, this.metadata),
        )

      return ChainGrpcTxFeesTransformer.eipBaseFeeResponseToEipBaseFee(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveTxFeesV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'EipBaseFee',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'EipBaseFee',
        contextModule: this.module,
      })
    }
  }
}
