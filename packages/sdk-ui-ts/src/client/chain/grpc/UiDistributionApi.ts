import { StakingGrpcTransformer } from '@injectivelabs/sdk-ts/dist/client/chain'
import { ChainMetrics } from '../../../types/metrics'
import { Base } from './Base'

export class UiDistributionApi extends Base {
  async fetchRewards({ injectiveAddress }: { injectiveAddress: string }) {
    try {
      const promise =
        this.chainClient.distribution.fetchDelegatorRewards(injectiveAddress)
      const response = await this.fetchOrFetchAndMeasure(
        promise,
        ChainMetrics.FetchRewards,
      )
      const rewards = response.getRewardsList()

      return StakingGrpcTransformer.grpcDelegationRewardToReward(rewards)
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
      const promise =
        this.chainClient.distribution.fetchDelegatorRewardsForValidator({
          validatorAddress,
          delegatorAddress: injectiveAddress,
        })
      const response = await this.fetchOrFetchAndMeasure(
        promise,
        ChainMetrics.FetchValidatorRewards,
      )
      const rewards = response.getRewardsList()

      return StakingGrpcTransformer.grpcDelegationRewardFromValidatorToReward(
        rewards,
        validatorAddress,
      )
    } catch (e) {
      return undefined
    }
  }
}
