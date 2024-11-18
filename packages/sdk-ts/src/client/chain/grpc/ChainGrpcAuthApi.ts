import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { CosmosAuthV1Beta1Query } from '@injectivelabs/core-proto-ts'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainModule } from '../types/index.js'
import { PaginationOption } from '../../../types/pagination.js'
import { paginationRequestFromPagination } from '../../../utils/pagination.js'
import { ChainGrpcAuthTransformer } from '../transformers/ChainGrpcAuthTransformer.js'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcAuthApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Auth

  protected client: CosmosAuthV1Beta1Query.QueryClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new CosmosAuthV1Beta1Query.QueryClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchModuleParams() {
    const request = CosmosAuthV1Beta1Query.QueryParamsRequest.create()

    try {
      const response =
        await this.retry<CosmosAuthV1Beta1Query.QueryParamsResponse>(() =>
          this.client.Params(request, this.metadata),
        )

      return ChainGrpcAuthTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmosAuthV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Params',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Params',
        contextModule: this.module,
      })
    }
  }

  async fetchAccount(address: string) {
    const request = CosmosAuthV1Beta1Query.QueryAccountRequest.create()

    request.address = address

    try {
      const response =
        await this.retry<CosmosAuthV1Beta1Query.QueryAccountResponse>(() =>
          this.client.Account(request, this.metadata),
        )

      return ChainGrpcAuthTransformer.accountResponseToAccount(response)
    } catch (e: unknown) {
      if (e instanceof CosmosAuthV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Account',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Account',
        contextModule: this.module,
      })
    }
  }

  async fetchAccounts(pagination?: PaginationOption) {
    const request = CosmosAuthV1Beta1Query.QueryAccountsRequest.create()
    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response =
        await this.retry<CosmosAuthV1Beta1Query.QueryAccountsResponse>(() =>
          this.client.Accounts(request, this.metadata),
        )

      return ChainGrpcAuthTransformer.accountsResponseToAccounts(response)
    } catch (e: unknown) {
      if (e instanceof CosmosAuthV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Accounts',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Accounts',
        contextModule: this.module,
      })
    }
  }
}
