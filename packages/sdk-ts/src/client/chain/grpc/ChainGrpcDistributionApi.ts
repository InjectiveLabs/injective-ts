import * as CosmosDistributionV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/distribution/v1beta1/query_pb.mjs'
import { QueryClient as CosmosDistributionV1Beta1QueryClient } from '@injectivelabs/core-proto-ts-v2/generated/cosmos/distribution/v1beta1/query_pb.client.mjs'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumerV2 from '../../base/BaseGrpcConsumerV2.js'
import { ChainGrpcDistributionTransformer } from '../transformers/index.js'
import type { Coin } from '@injectivelabs/ts-types'
import type { ValidatorRewards } from '../types/index.js'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcDistributionApi extends BaseGrpcConsumerV2 {
  protected module: string = ChainModule.Distribution
  private client: CosmosDistributionV1Beta1QueryClient

  constructor(endpoint: string) {
    super(endpoint)
    this.client = new CosmosDistributionV1Beta1QueryClient(this.transport)
  }

  async fetchModuleParams() {
    const request = CosmosDistributionV1Beta1QueryPb.QueryParamsRequest.create()

    const response = await this.executeGrpcCall<
      CosmosDistributionV1Beta1QueryPb.QueryParamsRequest,
      CosmosDistributionV1Beta1QueryPb.QueryParamsResponse
    >(request, this.client.params.bind(this.client))

    return ChainGrpcDistributionTransformer.moduleParamsResponseToModuleParams(
      response,
    )
  }

  async fetchDelegatorRewardsForValidator({
    delegatorAddress,
    validatorAddress,
  }: {
    delegatorAddress: string
    validatorAddress: string
  }) {
    const request =
      CosmosDistributionV1Beta1QueryPb.QueryDelegationRewardsRequest.create()

    request.validatorAddress = validatorAddress
    request.delegatorAddress = delegatorAddress

    const response = await this.executeGrpcCall<
      CosmosDistributionV1Beta1QueryPb.QueryDelegationRewardsRequest,
      CosmosDistributionV1Beta1QueryPb.QueryDelegationRewardsResponse
    >(request, this.client.delegationRewards.bind(this.client))

    return ChainGrpcDistributionTransformer.delegationRewardResponseToReward(
      response,
    )
  }

  async fetchDelegatorRewardsForValidatorNoThrow({
    delegatorAddress,
    validatorAddress,
  }: {
    delegatorAddress: string
    validatorAddress: string
  }) {
    const request =
      CosmosDistributionV1Beta1QueryPb.QueryDelegationRewardsRequest.create()

    request.validatorAddress = validatorAddress
    request.delegatorAddress = delegatorAddress

    try {
      const response = await this.executeGrpcCall<
        CosmosDistributionV1Beta1QueryPb.QueryDelegationRewardsRequest,
        CosmosDistributionV1Beta1QueryPb.QueryDelegationRewardsResponse
      >(request, this.client.delegationRewards.bind(this.client))

      return ChainGrpcDistributionTransformer.delegationRewardResponseToReward(
        response,
      )
    } catch (e: any) {
      if (
        e.message.includes('does not exist') ||
        e.message.includes('no delegation for (address, validator) tuple')
      ) {
        return [] as Coin[]
      }

      throw e
    }
  }

  async fetchDelegatorRewards(injectiveAddress: string) {
    const request =
      CosmosDistributionV1Beta1QueryPb.QueryDelegationTotalRewardsRequest.create()

    request.delegatorAddress = injectiveAddress

    const response = await this.executeGrpcCall<
      CosmosDistributionV1Beta1QueryPb.QueryDelegationTotalRewardsRequest,
      CosmosDistributionV1Beta1QueryPb.QueryDelegationTotalRewardsResponse
    >(request, this.client.delegationTotalRewards.bind(this.client))

    return ChainGrpcDistributionTransformer.totalDelegationRewardResponseToTotalReward(
      response,
    )
  }

  async fetchDelegatorRewardsNoThrow(injectiveAddress: string) {
    const request =
      CosmosDistributionV1Beta1QueryPb.QueryDelegationTotalRewardsRequest.create()

    request.delegatorAddress = injectiveAddress

    try {
      const response = await this.executeGrpcCall<
        CosmosDistributionV1Beta1QueryPb.QueryDelegationTotalRewardsRequest,
        CosmosDistributionV1Beta1QueryPb.QueryDelegationTotalRewardsResponse
      >(request, this.client.delegationTotalRewards.bind(this.client))

      return ChainGrpcDistributionTransformer.totalDelegationRewardResponseToTotalReward(
        response,
      )
    } catch (e: any) {
      if (e.message.includes('does not exist')) {
        return [] as ValidatorRewards[]
      }

      throw e
    }
  }
}
