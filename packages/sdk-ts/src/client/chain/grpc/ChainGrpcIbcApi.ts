import { getGrpcWebImpl } from '../../BaseGrpcWebConsumer'
import { ChainModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { IbcApplicationsTransferV1Query } from '@injectivelabs/core-proto-ts'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcIbcApi {
  protected module: string = ChainModule.Ibc

  protected client: IbcApplicationsTransferV1Query.QueryClientImpl

  constructor(endpoint: string) {
    this.client = new IbcApplicationsTransferV1Query.QueryClientImpl(
      getGrpcWebImpl(endpoint),
    )
  }

  async fetchDenomTrace(hash: string) {
    const request =
      IbcApplicationsTransferV1Query.QueryDenomTraceRequest.create()

    request.hash = hash

    try {
      const response = await this.client.DenomTrace(request)

      return response.denomTrace!
    } catch (e: any) {
      if (e instanceof IbcApplicationsTransferV1Query.GrpcWebError) {
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
    const request =
      IbcApplicationsTransferV1Query.QueryDenomTracesRequest.create()

    try {
      const response = await this.client.DenomTraces(request)

      return response.denomTraces
    } catch (e: any) {
      if (e instanceof IbcApplicationsTransferV1Query.GrpcWebError) {
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
