import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { CosmosMintV1Beta1Query } from '@injectivelabs/core-proto-ts'
import { cosmosSdkDecToBigNumber, uint8ArrayToString } from '../../../utils'

import { BigNumberInBase } from '@injectivelabs/utils'
import { ChainGrpcMintTransformer } from './../transformers/ChainGrpcMintTransformer'
import { ChainModule } from '../types'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer'

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
          this.client.Params(request),
        )

      return ChainGrpcMintTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmosMintV1Beta1Query.GrpcWebError) {
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

  async fetchInflation() {
    const request = CosmosMintV1Beta1Query.QueryInflationRequest.create()

    try {
      const response =
        await this.retry<CosmosMintV1Beta1Query.QueryInflationResponse>(() =>
          this.client.Inflation(request),
        )

      return {
        inflation: cosmosSdkDecToBigNumber(
          new BigNumberInBase(uint8ArrayToString(response.inflation)),
        ).toFixed(),
      }
    } catch (e: unknown) {
      if (e instanceof CosmosMintV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
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
          () => this.client.AnnualProvisions(request),
        )

      return {
        annualProvisions: cosmosSdkDecToBigNumber(
          new BigNumberInBase(uint8ArrayToString(response.annualProvisions)),
        ).toFixed(),
      }
    } catch (e: unknown) {
      if (e instanceof CosmosMintV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
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
