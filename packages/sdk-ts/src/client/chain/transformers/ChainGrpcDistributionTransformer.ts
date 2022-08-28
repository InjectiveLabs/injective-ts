import {
  QueryParamsResponse,
  QueryDelegationRewardsResponse,
  QueryDelegationTotalRewardsResponse,
} from '@injectivelabs/chain-api/cosmos/distribution/v1beta1/query_pb'
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
    const params = response.getParams()!

    return {
      communityTax: cosmosSdkDecToBigNumber(params.getCommunityTax()).toFixed(),
      baseProposerReward: params.getBaseProposerReward(),
      bonusProposerReward: params.getBonusProposerReward(),
      withdrawAddrEnabled: params.getWithdrawAddrEnabled(),
    }
  }

  static delegationRewardResponseToReward(
    response: QueryDelegationRewardsResponse,
  ): Coin[] {
    const grpcRewards = response.getRewardsList()

    return grpcRewards.map((grpcReward) => {
      return {
        amount: cosmosSdkDecToBigNumber(grpcReward.getAmount()).toFixed(),
        denom: grpcReward.getDenom(),
      }
    })
  }

  static totalDelegationRewardResponseToTotalReward(
    response: QueryDelegationTotalRewardsResponse,
  ): ValidatorRewards[] {
    const grpcRewards = response.getRewardsList()

    return grpcRewards.map((grpcReward) => {
      const rewards = grpcReward.getRewardList().map((reward) => ({
        amount: cosmosSdkDecToBigNumber(reward.getAmount()).toFixed(),
        denom: reward.getDenom(),
      }))

      return {
        rewards,
        validatorAddress: grpcReward.getValidatorAddress(),
      }
    })
  }
}
