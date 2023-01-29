import {
  QueryClientImpl,
  QueryInflationRequest,
  QueryParamsRequest as QueryMintParamsRequest,
  QueryAnnualProvisionsRequest,
} from '@injectivelabs/core-proto-ts/cosmos/mint/v1beta1/query'
import { getGrpcWebImpl } from '../../BaseGrpcWebConsumer'
import { cosmosSdkDecToBigNumber, uint8ArrayToString } from '../../../utils'
import { BigNumberInBase } from '@injectivelabs/utils'
import { ChainGrpcMintTransformer } from './../transformers/ChainGrpcMintTransformer'
import { ChainModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { GrpcWebError } from '@injectivelabs/core-proto-ts/tendermint/abci/types'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcMintApi {
  protected module: string = ChainModule.Mint

  protected query: QueryClientImpl

  constructor(endpoint: string) {
    this.query = new QueryClientImpl(getGrpcWebImpl(endpoint))
  }

  async fetchModuleParams() {
    const request = QueryMintParamsRequest.create()

    try {
      const response = await this.query.Params(request)

      return ChainGrpcMintTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcWebError) {
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
    const request = QueryInflationRequest.create()

    try {
      const response = await this.query.Inflation(request)

      return {
        inflation: cosmosSdkDecToBigNumber(
          new BigNumberInBase(uint8ArrayToString(response.inflation)),
        ).toFixed(),
      }
    } catch (e: unknown) {
      if (e instanceof GrpcWebError) {
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
    const request = QueryAnnualProvisionsRequest.create()

    try {
      const response = await this.query.AnnualProvisions(request)

      return {
        annualProvisions: cosmosSdkDecToBigNumber(
          new BigNumberInBase(uint8ArrayToString(response.annualProvisions)),
        ).toFixed(),
      }
    } catch (e: unknown) {
      if (e instanceof GrpcWebError) {
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
