import { toHumanReadable } from '@injectivelabs/utils'
import type { Coin } from '@injectivelabs/ts-types'
import type * as CosmosDistributionV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/distribution/v1beta1/query_pb.mjs'
import type {
  GrpcDecCoin,
  ValidatorRewards,
  DistributionModuleParams,
} from '../types/distribution.js'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcDistributionTransformer {
  static moduleParamsResponseToModuleParams(
    response: CosmosDistributionV1Beta1QueryPb.QueryParamsResponse,
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
    response: CosmosDistributionV1Beta1QueryPb.QueryDelegationRewardsResponse,
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
    response: CosmosDistributionV1Beta1QueryPb.QueryDelegationTotalRewardsResponse,
  ): ValidatorRewards[] {
    const grpcRewards = response.rewards

    return grpcRewards.map((grpcReward) => {
      const rewards = grpcReward.reward.map((reward: GrpcDecCoin) => ({
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
