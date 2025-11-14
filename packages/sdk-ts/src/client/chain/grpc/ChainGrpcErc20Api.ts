import * as InjectiveErc20V1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/erc20/v1beta1/query_pb'
import { QueryClient as InjectiveErc20V1Beta1QueryClient } from '@injectivelabs/core-proto-ts-v2/generated/injective/erc20/v1beta1/query_pb.client'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { fetchAllWithPagination } from '../../../utils/pagination.js'
import {
  ChainGrpcErc20Transformer,
  ChainGrpcCommonTransformer,
} from '../transformers/index.js'
import type { PaginationOption } from '../../../types/pagination.js'

const MAX_LIMIT_FOR_SUPPLY = 10000

/**
 * @category Chain Grpc API
 */
export class ChainGrpcErc20Api extends BaseGrpcConsumer {
  protected module: string = ChainModule.Erc20

  private client: InjectiveErc20V1Beta1QueryClient

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new InjectiveErc20V1Beta1QueryClient(this.transport)
  }

  async fetchModuleParams() {
    const request = InjectiveErc20V1Beta1QueryPb.QueryParamsRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveErc20V1Beta1QueryPb.QueryParamsRequest,
      InjectiveErc20V1Beta1QueryPb.QueryParamsResponse
    >(request, this.client.params.bind(this.client))

    return ChainGrpcErc20Transformer.paramsResponseToParams(response)
  }

  async fetchTokenPairs(pagination?: PaginationOption) {
    const request =
      InjectiveErc20V1Beta1QueryPb.QueryAllTokenPairsRequest.create()
    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    const response = await this.executeGrpcCall<
      InjectiveErc20V1Beta1QueryPb.QueryAllTokenPairsRequest,
      InjectiveErc20V1Beta1QueryPb.QueryAllTokenPairsResponse
    >(request, this.client.allTokenPairs.bind(this.client))

    return ChainGrpcErc20Transformer.tokenPairsResponseToTokenPairs(response)
  }

  async fetchAllTokenPairsWithPagination(
    pagination: PaginationOption = { limit: MAX_LIMIT_FOR_SUPPLY },
  ) {
    return fetchAllWithPagination(pagination, this.fetchTokenPairs.bind(this))
  }

  async fetchTokenPairByDenom(denom: string) {
    const request =
      InjectiveErc20V1Beta1QueryPb.QueryTokenPairByDenomRequest.create()
    request.bankDenom = denom

    const response = await this.executeGrpcCall<
      InjectiveErc20V1Beta1QueryPb.QueryTokenPairByDenomRequest,
      InjectiveErc20V1Beta1QueryPb.QueryTokenPairByDenomResponse
    >(request, this.client.tokenPairByDenom.bind(this.client))

    if (!response.tokenPair) {
      return undefined
    }

    return ChainGrpcErc20Transformer.grpcTokenPairToTokenPair(
      response.tokenPair,
    )
  }

  async fetchTokenPairByErc20Address(erc20Address: string) {
    const request =
      InjectiveErc20V1Beta1QueryPb.QueryTokenPairByERC20AddressRequest.create()
    request.erc20Address = erc20Address

    const response = await this.executeGrpcCall<
      InjectiveErc20V1Beta1QueryPb.QueryTokenPairByERC20AddressRequest,
      InjectiveErc20V1Beta1QueryPb.QueryTokenPairByERC20AddressResponse
    >(request, this.client.tokenPairByERC20Address.bind(this.client))

    if (!response.tokenPair) {
      return undefined
    }

    return ChainGrpcErc20Transformer.grpcTokenPairToTokenPair(
      response.tokenPair,
    )
  }
}
