import { toHumanReadable } from '@injectivelabs/utils'
import type { Coin } from '@injectivelabs/ts-types'
import type { ValidatorRewards } from '../types/distribution.js'
import type { DistributionModuleParams } from '../types/distribution.js'
import type { CosmosDistributionV1Beta1Query } from '@injectivelabs/core-proto-ts'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcDistributionTransformer {
  static moduleParamsResponseToModuleParams(
    response: CosmosDistributionV1Beta1Query.QueryParamsResponse,
  ): DistributionModuleParams {
    const params = response.params!

    return {
      communityTax: toHumanReadable(params.communityTax).toFixed(),
      baseProposerReward: params.baseProposerReward,
      bonusProposerReward: params.bonusProposerReward,
      withdrawAddrEnabled: params.withdrawAddrEnabled,
    }
  }

  static delegationRewardResponseToReward(
    response: CosmosDistributionV1Beta1Query.QueryDelegationRewardsResponse,
  ): Coin[] {
    const grpcRewards = response.rewards

    return grpcRewards.map((grpcReward) => {
      return {
        amount: toHumanReadable(grpcReward.amount).toFixed(),
        denom: grpcReward.denom,
      }
    })
  }

  static totalDelegationRewardResponseToTotalReward(
    response: CosmosDistributionV1Beta1Query.QueryDelegationTotalRewardsResponse,
  ): ValidatorRewards[] {
    const grpcRewards = response.rewards

    return grpcRewards.map((grpcReward) => {
      const rewards = grpcReward.reward.map((reward) => ({
        amount: toHumanReadable(reward.amount).toFixed(),
        denom: reward.denom,
      }))

      return {
        rewards,
        validatorAddress: grpcReward.validatorAddress,
      }
    })
  }
}
