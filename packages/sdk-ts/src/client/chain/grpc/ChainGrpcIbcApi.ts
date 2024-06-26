import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { IbcApplicationsTransferV2Query } from '@injectivelabs/core-proto-ts'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer'
import { ChainModule } from '../types'
import { PaginationOption } from '../../../types/pagination'
import { paginationRequestFromPagination } from '../../../utils/pagination'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcIbcApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Ibc

  protected client: IbcApplicationsTransferV2Query.QueryV2ClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new IbcApplicationsTransferV2Query.QueryV2ClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchDenomTrace(hash: string) {
    const request =
      IbcApplicationsTransferV2Query.QueryDenomRequest.create()

    request.hash = hash

    try {
      const response =
        await this.retry<IbcApplicationsTransferV2Query.QueryDenomResponse>(
          () => this.client.Denom(request, this.metadata),
        )

      return response.denom!
    } catch (e: any) {
      if (e instanceof IbcApplicationsTransferV2Query.GrpcWebError) {
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
      IbcApplicationsTransferV2Query.QueryDenomsRequest.create()

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response =
        await this.retry<IbcApplicationsTransferV2Query.QueryDenomsResponse>(
          () => this.client.Denoms(request, this.metadata),
        )

      return response.denoms
    } catch (e: any) {
      if (e instanceof IbcApplicationsTransferV2Query.GrpcWebError) {
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
