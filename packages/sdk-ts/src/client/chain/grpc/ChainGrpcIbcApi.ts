import {
  QueryClientImpl,
  QueryDenomTraceRequest,
  QueryDenomTracesRequest,
} from '@injectivelabs/core-proto-ts/ibc/applications/transfer/v1/query'
import { getRpcInterface } from '../../BaseGrpcConsumer'
import { ChainModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcIbcApi {
  protected module: string = ChainModule.Ibc

  protected query: QueryClientImpl

  constructor(endpoint: string) {
    this.query = new QueryClientImpl(getRpcInterface(endpoint))
  }

  async fetchDenomTrace(hash: string) {
    const request = QueryDenomTraceRequest.create()

    request.hash = hash

    try {
      const response = await this.query.DenomTrace(request)

      return response.denomTrace!
    } catch (e: any) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
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
      const response = await this.query.DenomTraces(request)

      return response.denomTraces
    } catch (e: any) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }
}
