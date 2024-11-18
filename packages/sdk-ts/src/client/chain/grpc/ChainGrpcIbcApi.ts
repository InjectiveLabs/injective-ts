import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { IbcApplicationsTransferV1Query } from '@injectivelabs/core-proto-ts'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainModule } from '../types/index.js'
import { PaginationOption } from '../../../types/pagination.js'
import { paginationRequestFromPagination } from '../../../utils/pagination.js'

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
          () => this.client.DenomTrace(request, this.metadata),
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

  async fetchDenomsTrace(pagination?: PaginationOption) {
    const request =
      IbcApplicationsTransferV1Query.QueryDenomTracesRequest.create()

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response =
        await this.retry<IbcApplicationsTransferV1Query.QueryDenomTracesResponse>(
          () => this.client.DenomTraces(request, this.metadata),
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
