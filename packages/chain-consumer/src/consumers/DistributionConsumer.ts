import { GrpcException } from '@injectivelabs/exceptions'
import {
  QueryDelegationRewardsRequest,
  QueryDelegationRewardsResponse,
  QueryDelegationTotalRewardsRequest,
  QueryDelegationTotalRewardsResponse,
} from '@injectivelabs/chain-api/cosmos/distribution/v1beta1/query_pb'
import { Query } from '@injectivelabs/chain-api/cosmos/distribution/v1beta1/query_pb_service'
import { AccountAddress } from '@injectivelabs/ts-types'
import BaseConsumer from '../BaseConsumer'

export class DistributionConsumer extends BaseConsumer {
  async fetchDelegatorRewardsForValidator({
    delegatorAddress,
    validatorAddress,
  }: {
    delegatorAddress: AccountAddress
    validatorAddress: AccountAddress
  }) {
    const request = new QueryDelegationRewardsRequest()
    request.setValidatorAddress(validatorAddress)
    request.setDelegatorAddress(delegatorAddress)

    try {
      const response = await this.request<
        QueryDelegationRewardsRequest,
        QueryDelegationRewardsResponse,
        typeof Query.DelegationRewards
      >(request, Query.DelegationRewards)

      return response.getRewardsList()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async fetchDelegatorRewards(injectiveAddress: AccountAddress) {
    const request = new QueryDelegationTotalRewardsRequest()
    request.setDelegatorAddress(injectiveAddress)

    try {
      const response = await this.request<
        QueryDelegationTotalRewardsRequest,
        QueryDelegationTotalRewardsResponse,
        typeof Query.DelegationTotalRewards
      >(request, Query.DelegationTotalRewards)

      return response.getRewardsList()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }
}
