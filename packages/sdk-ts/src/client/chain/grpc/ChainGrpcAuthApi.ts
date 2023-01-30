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
import { getGrpcWebImpl } from '../../BaseGrpcWebConsumer'
import { GrpcWebError } from '@injectivelabs/core-proto-ts/tendermint/abci/types'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcAuthApi {
  protected module: string = ChainModule.Auth

  protected client: QueryClientImpl

  constructor(endpoint: string) {
    this.client = new QueryClientImpl(getGrpcWebImpl(endpoint))
  }

  async fetchModuleParams() {
    const request = QueryParamsRequest.create()

    try {
      const response = await this.client.Params(request)

      return ChainGrpcAuthTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error)
    }
  }

  async fetchAccount(address: string) {
    const request = QueryAccountRequest.create()

    request.address = address

    try {
      const response = await this.client.Account(request)

      return ChainGrpcAuthTransformer.accountResponseToAccount(response)
    } catch (e: unknown) {
      if (e instanceof GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
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
      const response = await this.client.Accounts(request)

      return ChainGrpcAuthTransformer.accountsResponseToAccounts(response)
    } catch (e: unknown) {
      if (e instanceof GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error)
    }
  }
}
