import {
  QueryClientImpl,
  QueryDenomTraceRequest,
  QueryDenomTracesRequest,
} from '@injectivelabs/core-proto-ts/ibc/applications/transfer/v1/query'
import { getGrpcWebImpl } from '../../BaseGrpcWebConsumer'
import { ChainModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { GrpcWebError } from '@injectivelabs/core-proto-ts/tendermint/abci/types'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcIbcApi {
  protected module: string = ChainModule.Ibc

  protected client: QueryClientImpl

  constructor(endpoint: string) {
    this.client = new QueryClientImpl(getGrpcWebImpl(endpoint))
  }

  async fetchDenomTrace(hash: string) {
    const request = QueryDenomTraceRequest.create()

    request.hash = hash

    try {
      const response = await this.client.DenomTrace(request)

      return response.denomTrace!
    } catch (e: any) {
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

  async fetchDenomsTrace() {
    const request = QueryDenomTracesRequest.create()

    try {
      const response = await this.client.DenomTraces(request)

      return response.denomTraces
    } catch (e: any) {
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
