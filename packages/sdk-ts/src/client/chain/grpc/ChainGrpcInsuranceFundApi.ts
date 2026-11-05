import { throwIfAborted } from '@injectivelabs/utils'
import * as InjectiveInsuranceV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/insurance/v1beta1/query_pb'
import { QueryClient as InjectiveInsuranceV1Beta1QueryClient } from '@injectivelabs/core-proto-ts-v2/generated/injective/insurance/v1beta1/query_pb.client'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainGrpcCommonTransformer } from '../transformers/ChainGrpcCommonTransformer.js'
import { ChainGrpcInsuranceFundTransformer } from '../transformers/ChainGrpcInsuranceFundTransformer.js'
import type { RequestOptions } from '@injectivelabs/utils'
import type { PaginationOption } from '../../../types/pagination.js'
/**
 * @category Chain Grpc API
 */
export class ChainGrpcInsuranceFundApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.InsuranceFund

  private get client() {
    return this.initClient(InjectiveInsuranceV1Beta1QueryClient)
  }

  async fetchModuleParams(options?: RequestOptions) {
    throwIfAborted(options?.signal)
    const request =
      InjectiveInsuranceV1Beta1QueryPb.QueryInsuranceParamsRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveInsuranceV1Beta1QueryPb.QueryInsuranceParamsRequest,
      InjectiveInsuranceV1Beta1QueryPb.QueryInsuranceParamsResponse
    >(request, this.client.insuranceParams.bind(this.client), options)

    return ChainGrpcInsuranceFundTransformer.moduleParamsResponseToModuleParams(
      response,
    )
  }

  async fetchInsuranceFunds(options?: RequestOptions) {
    throwIfAborted(options?.signal)
    const request =
      InjectiveInsuranceV1Beta1QueryPb.QueryInsuranceFundsRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveInsuranceV1Beta1QueryPb.QueryInsuranceFundsRequest,
      InjectiveInsuranceV1Beta1QueryPb.QueryInsuranceFundsResponse
    >(request, this.client.insuranceFunds.bind(this.client), options)

    return ChainGrpcInsuranceFundTransformer.insuranceFundsResponseToInsuranceFunds(
      response,
    )
  }

  async fetchInsuranceFund(marketId: string, options?: RequestOptions) {
    throwIfAborted(options?.signal)
    const request =
      InjectiveInsuranceV1Beta1QueryPb.QueryInsuranceFundRequest.create()

    request.marketId = marketId

    const response = await this.executeGrpcCall<
      InjectiveInsuranceV1Beta1QueryPb.QueryInsuranceFundRequest,
      InjectiveInsuranceV1Beta1QueryPb.QueryInsuranceFundResponse
    >(request, this.client.insuranceFund.bind(this.client), options)

    return ChainGrpcInsuranceFundTransformer.insuranceFundResponseToInsuranceFund(
      response,
    )
  }

  async fetchEstimatedRedemptions(
    {
      marketId,
      address,
    }: {
      marketId: string
      address: string
    },
    options?: RequestOptions,
  ) {
    throwIfAborted(options?.signal)
    const request =
      InjectiveInsuranceV1Beta1QueryPb.QueryEstimatedRedemptionsRequest.create()

    request.marketId = marketId
    request.address = address

    const response = await this.executeGrpcCall<
      InjectiveInsuranceV1Beta1QueryPb.QueryEstimatedRedemptionsRequest,
      InjectiveInsuranceV1Beta1QueryPb.QueryEstimatedRedemptionsResponse
    >(request, this.client.estimatedRedemptions.bind(this.client), options)

    return ChainGrpcInsuranceFundTransformer.estimatedRedemptionsResponseToEstimatedRedemptions(
      response,
    )
  }

  async fetchPendingRedemptions(
    {
      marketId,
      address,
    }: {
      marketId: string
      address: string
    },
    options?: RequestOptions,
  ) {
    throwIfAborted(options?.signal)
    const request =
      InjectiveInsuranceV1Beta1QueryPb.QueryPendingRedemptionsRequest.create()

    request.marketId = marketId
    request.address = address

    const response = await this.executeGrpcCall<
      InjectiveInsuranceV1Beta1QueryPb.QueryPendingRedemptionsRequest,
      InjectiveInsuranceV1Beta1QueryPb.QueryPendingRedemptionsResponse
    >(request, this.client.pendingRedemptions.bind(this.client), options)

    return ChainGrpcInsuranceFundTransformer.redemptionsResponseToRedemptions(
      response,
    )
  }

  /** chain v1.21+, empty `depositDenom` returns every consolidated pool */
  async fetchConsolidatedInsurancePools(
    { depositDenom }: { depositDenom?: string } = {},
    options?: RequestOptions,
  ) {
    throwIfAborted(options?.signal)
    const request =
      InjectiveInsuranceV1Beta1QueryPb.QueryConsolidatedInsurancePoolsRequest.create()

    request.depositDenom = depositDenom || ''

    const response = await this.executeGrpcCall<
      InjectiveInsuranceV1Beta1QueryPb.QueryConsolidatedInsurancePoolsRequest,
      InjectiveInsuranceV1Beta1QueryPb.QueryConsolidatedInsurancePoolsResponse
    >(
      request,
      this.client.consolidatedInsurancePools.bind(this.client),
      options,
    )

    return ChainGrpcInsuranceFundTransformer.consolidatedPoolsResponseToConsolidatedPools(
      response,
    )
  }

  async fetchConsolidatedInsurancePolicy(
    marketId: string,
    options?: RequestOptions,
  ) {
    throwIfAborted(options?.signal)
    const request =
      InjectiveInsuranceV1Beta1QueryPb.QueryConsolidatedInsurancePolicyRequest.create()

    request.marketId = marketId

    const response = await this.executeGrpcCall<
      InjectiveInsuranceV1Beta1QueryPb.QueryConsolidatedInsurancePolicyRequest,
      InjectiveInsuranceV1Beta1QueryPb.QueryConsolidatedInsurancePolicyResponse
    >(
      request,
      this.client.consolidatedInsurancePolicy.bind(this.client),
      options,
    )

    return ChainGrpcInsuranceFundTransformer.consolidatedPolicyResponseToConsolidatedPolicy(
      response,
    )
  }

  /**
   * chain v1.21+, empty `poolDenom` returns every policy.
   * Key-only pagination: use `key`, offset / total-count scans are rejected by the chain.
   */
  async fetchConsolidatedInsurancePolicies(
    {
      poolDenom,
      pagination,
    }: { poolDenom?: string; pagination?: PaginationOption } = {},
    options?: RequestOptions,
  ) {
    throwIfAborted(options?.signal)
    const request =
      InjectiveInsuranceV1Beta1QueryPb.QueryConsolidatedInsurancePoliciesRequest.create()

    request.poolDenom = poolDenom || ''

    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    const response = await this.executeGrpcCall<
      InjectiveInsuranceV1Beta1QueryPb.QueryConsolidatedInsurancePoliciesRequest,
      InjectiveInsuranceV1Beta1QueryPb.QueryConsolidatedInsurancePoliciesResponse
    >(
      request,
      this.client.consolidatedInsurancePolicies.bind(this.client),
      options,
    )

    return ChainGrpcInsuranceFundTransformer.consolidatedPoliciesResponseToConsolidatedPolicies(
      response,
    )
  }

  /**
   * chain v1.21+, empty `redeemer` returns every pending schedule.
   * Key-only pagination: use `key`, offset / total-count scans are rejected by the chain.
   */
  async fetchConsolidatedRedemptions(
    {
      redeemer,
      pagination,
    }: { redeemer?: string; pagination?: PaginationOption } = {},
    options?: RequestOptions,
  ) {
    throwIfAborted(options?.signal)
    const request =
      InjectiveInsuranceV1Beta1QueryPb.QueryConsolidatedRedemptionsRequest.create()

    request.redeemer = redeemer || ''

    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    const response = await this.executeGrpcCall<
      InjectiveInsuranceV1Beta1QueryPb.QueryConsolidatedRedemptionsRequest,
      InjectiveInsuranceV1Beta1QueryPb.QueryConsolidatedRedemptionsResponse
    >(request, this.client.consolidatedRedemptions.bind(this.client), options)

    return ChainGrpcInsuranceFundTransformer.consolidatedRedemptionsResponseToConsolidatedRedemptions(
      response,
    )
  }
}
