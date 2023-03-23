import { getGrpcWebImpl } from '../../BaseGrpcWebConsumer'
import { cosmosSdkDecToBigNumber, uint8ArrayToString } from '../../../utils'
import { BigNumberInBase } from '@injectivelabs/utils'
import { ChainGrpcMintTransformer } from './../transformers/ChainGrpcMintTransformer'
import { ChainModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { CosmosMintV1Beta1Query } from '@injectivelabs/core-proto-ts'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcMintApi {
  protected module: string = ChainModule.Mint

  protected client: CosmosMintV1Beta1Query.QueryClientImpl

  constructor(endpoint: string) {
    this.client = new CosmosMintV1Beta1Query.QueryClientImpl(
      getGrpcWebImpl(endpoint),
    )
  }

  async fetchModuleParams() {
    const request = CosmosMintV1Beta1Query.QueryParamsRequest.create()

    try {
      const response = await this.client.Params(request)

      return ChainGrpcMintTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmosMintV1Beta1Query.GrpcWebError) {
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

  async fetchInflation() {
    const request = CosmosMintV1Beta1Query.QueryInflationRequest.create()

    try {
      const response = await this.client.Inflation(request)

      return {
        inflation: cosmosSdkDecToBigNumber(
          new BigNumberInBase(uint8ArrayToString(response.inflation)),
        ).toFixed(),
      }
    } catch (e: unknown) {
      if (e instanceof CosmosMintV1Beta1Query.GrpcWebError) {
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

  async fetchAnnualProvisions() {
    const request = CosmosMintV1Beta1Query.QueryAnnualProvisionsRequest.create()

    try {
      const response = await this.client.AnnualProvisions(request)

      return {
        annualProvisions: cosmosSdkDecToBigNumber(
          new BigNumberInBase(uint8ArrayToString(response.annualProvisions)),
        ).toFixed(),
      }
    } catch (e: unknown) {
      if (e instanceof CosmosMintV1Beta1Query.GrpcWebError) {
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
