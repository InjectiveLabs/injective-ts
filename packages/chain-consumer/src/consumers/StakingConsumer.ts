import { GrpcException } from '@injectivelabs/exceptions'
import {
  QueryDelegatorDelegationsRequest,
  QueryDelegatorDelegationsResponse,
  QueryDelegatorUnbondingDelegationsRequest,
  QueryDelegatorUnbondingDelegationsResponse,
  QueryValidatorDelegationsRequest,
  QueryRedelegationsRequest,
  QueryRedelegationsResponse,
  QueryValidatorDelegationsResponse,
  QueryValidatorsRequest,
  QueryValidatorsResponse,
} from '@injectivelabs/chain-api/cosmos/staking/v1beta1/query_pb'
import { Query } from '@injectivelabs/chain-api/cosmos/staking/v1beta1/query_pb_service'
import { AccountAddress } from '@injectivelabs/ts-types'
import BaseConsumer from '../BaseConsumer'

export class StakingConsumer extends BaseConsumer {
  async fetchValidators() {
    const request = new QueryValidatorsRequest()

    try {
      const response = await this.request<
        QueryValidatorsRequest,
        QueryValidatorsResponse,
        typeof Query.Validators
      >(request, Query.Validators)

      return response.getValidatorsList()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async fetchDelegations(cosmosAddress: AccountAddress) {
    const request = new QueryDelegatorDelegationsRequest()
    request.setDelegatorAddr(cosmosAddress)

    try {
      const response = await this.request<
        QueryDelegatorDelegationsRequest,
        QueryDelegatorDelegationsResponse,
        typeof Query.DelegatorDelegations
      >(request, Query.DelegatorDelegations)

      return response.getDelegationResponsesList()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async fetchDelegators(validatorOperatorAddress: string) {
    const request = new QueryValidatorDelegationsRequest()
    request.setValidatorAddr(validatorOperatorAddress)

    try {
      const response = await this.request<
        QueryValidatorDelegationsRequest,
        QueryValidatorDelegationsResponse,
        typeof Query.ValidatorDelegations
      >(request, Query.ValidatorDelegations)
      return response.getDelegationResponsesList()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async fetchUnbondingDelegations(cosmosAddress: AccountAddress) {
    const request = new QueryDelegatorUnbondingDelegationsRequest()
    request.setDelegatorAddr(cosmosAddress)

    try {
      const response = await this.request<
        QueryDelegatorUnbondingDelegationsRequest,
        QueryDelegatorUnbondingDelegationsResponse,
        typeof Query.DelegatorUnbondingDelegations
      >(request, Query.DelegatorUnbondingDelegations)

      return response.getUnbondingResponsesList()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async fetchReDelegations(cosmosAddress: AccountAddress) {
    const request = new QueryRedelegationsRequest()
    request.setDelegatorAddr(cosmosAddress)

    try {
      const response = await this.request<
        QueryRedelegationsRequest,
        QueryRedelegationsResponse,
        typeof Query.Redelegations
      >(request, Query.Redelegations)

      return response.getRedelegationResponsesList()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }
}
