import * as CosmosAuthV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/auth/v1beta1/query_pb'
import { QueryClient as CosmosAuthV1BetaQueryClient } from '@injectivelabs/core-proto-ts-v2/generated/cosmos/auth/v1beta1/query_pb.client'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainGrpcAuthTransformer } from '../transformers/ChainGrpcAuthTransformer.js'
import { ChainGrpcCommonTransformer } from '../transformers/ChainGrpcCommonTransformer.js'
import type { GrpcCallOptions } from '../../../types/index.js'
import type { PaginationOption } from '../../../types/pagination.js'
/**
 * @category Chain Grpc API
 */
export class ChainGrpcAuthApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Auth

  private get client() {
    return this.initClient(CosmosAuthV1BetaQueryClient)
  }

  async fetchModuleParams(options?: GrpcCallOptions) {
    const request = CosmosAuthV1Beta1QueryPb.QueryParamsRequest.create()

    const response = await this.executeGrpcCall<
      CosmosAuthV1Beta1QueryPb.QueryParamsRequest,
      CosmosAuthV1Beta1QueryPb.QueryParamsResponse
    >(request, this.client.params.bind(this.client), options?.signal)

    return ChainGrpcAuthTransformer.moduleParamsResponseToModuleParams(response)
  }

  async fetchAccount(address: string, options?: GrpcCallOptions) {
    const request = CosmosAuthV1Beta1QueryPb.QueryAccountRequest.create()

    request.address = address

    const response = await this.executeGrpcCall<
      CosmosAuthV1Beta1QueryPb.QueryAccountRequest,
      CosmosAuthV1Beta1QueryPb.QueryAccountResponse
    >(request, this.client.account.bind(this.client), options?.signal)

    return ChainGrpcAuthTransformer.accountResponseToAccount(response)
  }

  async fetchAccounts(
    pagination?: PaginationOption,
    options?: GrpcCallOptions,
  ) {
    const request = CosmosAuthV1Beta1QueryPb.QueryAccountsRequest.create()
    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    const response = await this.executeGrpcCall<
      CosmosAuthV1Beta1QueryPb.QueryAccountsRequest,
      CosmosAuthV1Beta1QueryPb.QueryAccountsResponse
    >(request, this.client.accounts.bind(this.client), options?.signal)

    return ChainGrpcAuthTransformer.accountsResponseToAccounts(response)
  }
}
