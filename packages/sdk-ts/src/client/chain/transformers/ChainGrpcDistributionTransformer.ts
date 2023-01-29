import {
  QueryParamsResponse,
  QueryDelegationRewardsResponse,
  QueryDelegationTotalRewardsResponse,
} from '@injectivelabs/core-proto-ts/cosmos/distribution/v1beta1/query'
import { cosmosSdkDecToBigNumber } from '../../../utils'
import { Coin } from '@injectivelabs/ts-types'
import { DistributionModuleParams } from '../types/distribution'
import { ValidatorRewards } from '../types/distribution'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcDistributionTransformer {
  static moduleParamsResponseToModuleParams(
    response: QueryParamsResponse,
  ): DistributionModuleParams {
    const params = response.params!

    return {
      communityTax: cosmosSdkDecToBigNumber(params.communityTax).toFixed(),
      baseProposerReward: params.baseProposerReward,
      bonusProposerReward: params.bonusProposerReward,
      withdrawAddrEnabled: params.withdrawAddrEnabled,
    }
  }

  static delegationRewardResponseToReward(
    response: QueryDelegationRewardsResponse,
  ): Coin[] {
    const grpcRewards = response.rewards

    return grpcRewards.map((grpcReward) => {
      return {
        amount: cosmosSdkDecToBigNumber(grpcReward.amount).toFixed(),
        denom: grpcReward.denom,
      }
    })
  }

  static totalDelegationRewardResponseToTotalReward(
    response: QueryDelegationTotalRewardsResponse,
  ): ValidatorRewards[] {
    const grpcRewards = response.rewards

    return grpcRewards.map((grpcReward) => {
      const rewards = grpcReward.reward.map((reward) => ({
        amount: cosmosSdkDecToBigNumber(reward.amount).toFixed(),
        denom: reward.denom,
      }))

      return {
        rewards,
        validatorAddress: grpcReward.validatorAddress,
      }
    })
  }
}
