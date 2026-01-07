import * as CosmosBankV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/bank/v1beta1/query_pb'
import { QueryClient as CosmosBankV1BetaQueryClient } from '@injectivelabs/core-proto-ts-v2/generated/cosmos/bank/v1beta1/query_pb.client'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainGrpcBankTransformer } from '../transformers/index.js'
import { fetchAllWithPagination } from '../../../utils/pagination.js'
import { ChainGrpcCommonTransformer } from '../transformers/ChainGrpcCommonTransformer.js'
import type { PaginationOption } from '../../../types/pagination.js'
const MAX_LIMIT_FOR_SUPPLY = 10000

/**
 * @category Chain Grpc API
 */
export class ChainGrpcBankApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Bank

  private get client() {
    return this.initClient(CosmosBankV1BetaQueryClient)
  }

  async fetchModuleParams() {
    const request = CosmosBankV1Beta1QueryPb.QueryParamsRequest.create()

    const response = await this.executeGrpcCall<
      CosmosBankV1Beta1QueryPb.QueryParamsRequest,
      CosmosBankV1Beta1QueryPb.QueryParamsResponse
    >(request, this.client.params.bind(this.client))

    return ChainGrpcBankTransformer.moduleParamsResponseToModuleParams(response)
  }

  async fetchBalance({
    accountAddress,
    denom,
  }: {
    accountAddress: string
    denom: string
  }) {
    const request = CosmosBankV1Beta1QueryPb.QueryBalanceRequest.create()

    request.address = accountAddress
    request.denom = denom

    const response = await this.executeGrpcCall<
      CosmosBankV1Beta1QueryPb.QueryBalanceRequest,
      CosmosBankV1Beta1QueryPb.QueryBalanceResponse
    >(request, this.client.balance.bind(this.client))

    return ChainGrpcBankTransformer.balanceResponseToBalance(response)
  }

  async fetchBalances(address: string, pagination?: PaginationOption) {
    const request = CosmosBankV1Beta1QueryPb.QueryAllBalancesRequest.create()

    request.address = address

    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    const response = await this.executeGrpcCall<
      CosmosBankV1Beta1QueryPb.QueryAllBalancesRequest,
      CosmosBankV1Beta1QueryPb.QueryAllBalancesResponse
    >(request, this.client.allBalances.bind(this.client))

    return ChainGrpcBankTransformer.balancesResponseToBalances(response)
  }

  async fetchTotalSupply(pagination?: PaginationOption) {
    const request = CosmosBankV1Beta1QueryPb.QueryTotalSupplyRequest.create()
    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    const response = await this.executeGrpcCall<
      CosmosBankV1Beta1QueryPb.QueryTotalSupplyRequest,
      CosmosBankV1Beta1QueryPb.QueryTotalSupplyResponse
    >(request, this.client.totalSupply.bind(this.client))

    return ChainGrpcBankTransformer.totalSupplyResponseToTotalSupply(response)
  }

  /** a way to ensure all total supply is fully fetched */
  async fetchAllTotalSupply(
    pagination: PaginationOption = { limit: MAX_LIMIT_FOR_SUPPLY },
  ) {
    return fetchAllWithPagination(pagination, this.fetchTotalSupply.bind(this))
  }

  async fetchSupplyOf(denom: string) {
    const request = CosmosBankV1Beta1QueryPb.QuerySupplyOfRequest.create()

    request.denom = denom

    const response = await this.executeGrpcCall<
      CosmosBankV1Beta1QueryPb.QuerySupplyOfRequest,
      CosmosBankV1Beta1QueryPb.QuerySupplyOfResponse
    >(request, this.client.supplyOf.bind(this.client))

    return ChainGrpcCommonTransformer.grpcCoinToCoin(response.amount!)
  }

  async fetchDenomsMetadata(pagination?: PaginationOption) {
    const request = CosmosBankV1Beta1QueryPb.QueryDenomsMetadataRequest.create()
    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    const response = await this.executeGrpcCall<
      CosmosBankV1Beta1QueryPb.QueryDenomsMetadataRequest,
      CosmosBankV1Beta1QueryPb.QueryDenomsMetadataResponse
    >(request, this.client.denomsMetadata.bind(this.client))

    return ChainGrpcBankTransformer.denomsMetadataResponseToDenomsMetadata(
      response,
    )
  }

  async fetchDenomMetadata(denom: string) {
    const request = CosmosBankV1Beta1QueryPb.QueryDenomMetadataRequest.create()

    request.denom = denom

    const response = await this.executeGrpcCall<
      CosmosBankV1Beta1QueryPb.QueryDenomMetadataRequest,
      CosmosBankV1Beta1QueryPb.QueryDenomMetadataResponse
    >(request, this.client.denomMetadata.bind(this.client))

    return ChainGrpcBankTransformer.metadataToMetadata(response.metadata!)
  }

  async fetchDenomOwners(denom: string, pagination?: PaginationOption) {
    const request = CosmosBankV1Beta1QueryPb.QueryDenomOwnersRequest.create()

    request.denom = denom

    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    const response = await this.executeGrpcCall<
      CosmosBankV1Beta1QueryPb.QueryDenomOwnersRequest,
      CosmosBankV1Beta1QueryPb.QueryDenomOwnersResponse
    >(request, this.client.denomOwners.bind(this.client))

    return ChainGrpcBankTransformer.denomOwnersResponseToDenomOwners(response)
  }
}
