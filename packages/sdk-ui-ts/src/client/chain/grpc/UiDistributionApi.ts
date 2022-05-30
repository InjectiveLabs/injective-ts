import {
  ChainGrpcDistributionApi,
  ChainGrpcStakingTransformer,
} from '@injectivelabs/sdk-ts/client'
import { ChainMetrics } from '../../../types/metrics'
import { BaseApi } from '../../../BaseApi'
import { ApiOptions } from '../../../types'

export class UiDistributionApi extends BaseApi {
  protected client: ChainGrpcDistributionApi

  constructor(options: ApiOptions) {
    super(options)
    this.client = new ChainGrpcDistributionApi(options.endpoints.sentryGrpcApi)
  }

  async fetchRewards({ injectiveAddress }: { injectiveAddress: string }) {
    try {
      const promise = this.client.fetchDelegatorRewards(injectiveAddress)
      const response = await this.fetchOrFetchAndMeasure(
        promise,
        ChainMetrics.FetchRewards,
      )
      const rewards = response.getRewardsList()

      return ChainGrpcStakingTransformer.grpcDelegationRewardToReward(rewards)
    } catch (e) {
      return []
    }
  }

  async fetchRewardForValidator({
    injectiveAddress,
    validatorAddress,
  }: {
    injectiveAddress: string
    validatorAddress: string
  }) {
    try {
      const promise = this.client.fetchDelegatorRewardsForValidator({
        validatorAddress,
        delegatorAddress: injectiveAddress,
      })
      const response = await this.fetchOrFetchAndMeasure(
        promise,
        ChainMetrics.FetchValidatorRewards,
      )
      const rewards = response.getRewardsList()

      return ChainGrpcStakingTransformer.grpcDelegationRewardFromValidatorToReward(
        rewards,
        validatorAddress,
      )
    } catch (e) {
      return undefined
    }
  }
}
