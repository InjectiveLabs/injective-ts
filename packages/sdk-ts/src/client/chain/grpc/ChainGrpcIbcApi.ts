import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { IbcApplicationsTransferV1Query } from '@injectivelabs/core-proto-ts'
import BaseGrpcConsumer from '../../BaseGrpcConsumer'
import { ChainModule } from '../types'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcIbcApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Ibc

  protected client: IbcApplicationsTransferV1Query.QueryClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new IbcApplicationsTransferV1Query.QueryClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchDenomTrace(hash: string) {
    const request =
      IbcApplicationsTransferV1Query.QueryDenomTraceRequest.create()

    request.hash = hash

    try {
      const response =
        await this.retry<IbcApplicationsTransferV1Query.QueryDenomTraceResponse>(
          () => this.client.DenomTrace(request),
        )

      return response.denomTrace!
    } catch (e: any) {
      if (e instanceof IbcApplicationsTransferV1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'DenomTrace',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'DenomTrace',
        contextModule: this.module,
      })
    }
  }

  async fetchDenomsTrace() {
    const request =
      IbcApplicationsTransferV1Query.QueryDenomTracesRequest.create()

    try {
      const response =
        await this.retry<IbcApplicationsTransferV1Query.QueryDenomTracesResponse>(
          () => this.client.DenomTraces(request),
        )

      return response.denomTraces
    } catch (e: any) {
      if (e instanceof IbcApplicationsTransferV1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'DenomTraces',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'DenomTraces',
        contextModule: this.module,
      })
    }
  }
}
