import {
  QueryDelegationRewardsRequest,
  QueryDelegationRewardsResponse,
  QueryDelegationTotalRewardsRequest,
  QueryDelegationTotalRewardsResponse,
  QueryParamsRequest as QueryDistributionParamsRequest,
  QueryParamsResponse as QueryDistributionParamsResponse,
} from '@injectivelabs/chain-api/cosmos/distribution/v1beta1/query_pb'
import { Query as DistributionQuery } from '@injectivelabs/chain-api/cosmos/distribution/v1beta1/query_pb_service'
import BaseConsumer from '../../BaseGrpcConsumer'

export class DistributionApi extends BaseConsumer {
  async moduleParams() {
    const request = new QueryDistributionParamsRequest()

    try {
      const response = await this.request<
        QueryDistributionParamsRequest,
        QueryDistributionParamsResponse,
        typeof DistributionQuery.Params
      >(request, DistributionQuery.Params)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async delegatorRewardsForValidator({
    delegatorAddress,
    validatorAddress,
  }: {
    delegatorAddress: string
    validatorAddress: string
  }) {
    const request = new QueryDelegationRewardsRequest()
    request.setValidatorAddress(validatorAddress)
    request.setDelegatorAddress(delegatorAddress)

    try {
      const response = await this.request<
        QueryDelegationRewardsRequest,
        QueryDelegationRewardsResponse,
        typeof DistributionQuery.DelegationRewards
      >(request, DistributionQuery.DelegationRewards)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async delegatorRewards(injectiveAddress: string) {
    const request = new QueryDelegationTotalRewardsRequest()
    request.setDelegatorAddress(injectiveAddress)

    try {
      const response = await this.request<
        QueryDelegationTotalRewardsRequest,
        QueryDelegationTotalRewardsResponse,
        typeof DistributionQuery.DelegationTotalRewards
      >(request, DistributionQuery.DelegationTotalRewards)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
