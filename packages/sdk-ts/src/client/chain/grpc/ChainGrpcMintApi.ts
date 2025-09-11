import { toHumanReadable } from '@injectivelabs/utils'
import { CosmosMintV1Beta1Query } from '@injectivelabs/core-proto-ts'
import {
  UnspecifiedErrorCode,
  grpcErrorCodeToErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { ChainModule } from '../types/index.js'
import { uint8ArrayToString } from '../../../utils/index.js'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainGrpcMintTransformer } from './../transformers/ChainGrpcMintTransformer.js'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcMintApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Mint

  protected client: CosmosMintV1Beta1Query.QueryClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new CosmosMintV1Beta1Query.QueryClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchModuleParams() {
    const request = CosmosMintV1Beta1Query.QueryParamsRequest.create()

    try {
      const response =
        await this.retry<CosmosMintV1Beta1Query.QueryParamsResponse>(() =>
          this.client.Params(request, this.metadata),
        )

      return ChainGrpcMintTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmosMintV1Beta1Query.GrpcWebError) {
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

  async fetchInflation() {
    const request = CosmosMintV1Beta1Query.QueryInflationRequest.create()

    try {
      const response =
        await this.retry<CosmosMintV1Beta1Query.QueryInflationResponse>(() =>
          this.client.Inflation(request, this.metadata),
        )

      return {
        inflation: toHumanReadable(uint8ArrayToString(response.inflation)),
      }
    } catch (e: unknown) {
      if (e instanceof CosmosMintV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'Inflation',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Inflation',
        contextModule: this.module,
      })
    }
  }

  async fetchAnnualProvisions() {
    const request = CosmosMintV1Beta1Query.QueryAnnualProvisionsRequest.create()

    try {
      const response =
        await this.retry<CosmosMintV1Beta1Query.QueryAnnualProvisionsResponse>(
          () => this.client.AnnualProvisions(request, this.metadata),
        )

      return {
        annualProvisions: toHumanReadable(
          uint8ArrayToString(response.annualProvisions),
        ).toFixed(),
      }
    } catch (e: unknown) {
      if (e instanceof CosmosMintV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'AnnualProvisions',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'AnnualProvisions',
        contextModule: this.module,
      })
    }
  }
}
