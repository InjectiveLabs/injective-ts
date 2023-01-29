import {
  QueryClientImpl,
  QueryAccountRequest,
  QueryAccountsRequest,
  QueryParamsRequest,
} from '@injectivelabs/core-proto-ts/cosmos/auth/v1beta1/query'
import { PaginationOption } from '../../../types/pagination'
import { paginationRequestFromPagination } from '../../../utils/pagination'
import { ChainGrpcAuthTransformer } from '../transformers/ChainGrpcAuthTransformer'
import { ChainModule } from '../types'
import { GrpcUnaryRequestException } from '@injectivelabs/exceptions'
import { getRpcInterface } from '../../BaseGrpcConsumer'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcAuthApi {
  protected module: string = ChainModule.Auth

  protected query: QueryClientImpl

  constructor(endpoint: string) {
    this.query = new QueryClientImpl(getRpcInterface(endpoint))
  }

  async fetchModuleParams() {
    const request = QueryParamsRequest.create()

    try {
      const response = await this.query.Params(request)

      return ChainGrpcAuthTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error)
    }
  }

  async fetchAccount(address: string) {
    const request = QueryAccountRequest.create()

    request.address = address

    try {
      const response = await this.query.Account(request)

      return ChainGrpcAuthTransformer.accountResponseToAccount(response)
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error)
    }
  }

  async fetchAccounts(pagination?: PaginationOption) {
    const request = QueryAccountsRequest.create()
    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response = await this.query.Accounts(request)

      return ChainGrpcAuthTransformer.accountsResponseToAccounts(response)
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error)
    }
  }
}
