import { GrpcException } from '@injectivelabs/exceptions'
import {
  QueryDelegatorDelegationsRequest,
  QueryDelegatorDelegationsResponse,
  QueryDelegatorUnbondingDelegationsRequest,
  QueryDelegatorUnbondingDelegationsResponse,
  QueryValidatorDelegationsRequest,
  QueryValidatorDelegationsResponse,
  QueryValidatorsRequest,
  QueryValidatorsResponse,
} from '@injectivelabs/chain-api/cosmos/staking/v1beta1/query_pb'
import { Query } from '@injectivelabs/chain-api/cosmos/staking/v1beta1/query_pb_service'
import { AccountAddress } from '@injectivelabs/ts-types'
import BaseConsumer from '../BaseConsumer'

export class StakingConsumer extends BaseConsumer {
  async getValidators() {
    const queryValidators = new QueryValidatorsRequest()

    try {
      const response = await this.request<
        QueryValidatorsRequest,
        QueryValidatorsResponse,
        typeof Query.Validators
      >(queryValidators, Query.Validators)

      return response.getValidatorsList()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async getDelegations(cosmosAddress: AccountAddress) {
    const queryDelegatorDelegations = new QueryDelegatorDelegationsRequest()
    queryDelegatorDelegations.setDelegatorAddr(cosmosAddress)

    try {
      const response = await this.request<
        QueryDelegatorDelegationsRequest,
        QueryDelegatorDelegationsResponse,
        typeof Query.DelegatorDelegations
      >(queryDelegatorDelegations, Query.DelegatorDelegations)

      return response.getDelegationResponsesList()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async getDelegators(validatorOperatorAddress: string) {
    const queryDelegators = new QueryValidatorDelegationsRequest()
    queryDelegators.setValidatorAddr(validatorOperatorAddress)

    try {
      const response = await this.request<
        QueryValidatorDelegationsRequest,
        QueryValidatorDelegationsResponse,
        typeof Query.ValidatorDelegations
      >(queryDelegators, Query.ValidatorDelegations)
      return response.getDelegationResponsesList()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async getUnBondingDelegations(cosmosAddress: AccountAddress) {
    const queryDelegatorUnBondingDelegations = new QueryDelegatorUnbondingDelegationsRequest()
    queryDelegatorUnBondingDelegations.setDelegatorAddr(cosmosAddress)

    try {
      const response = await this.request<
        QueryDelegatorUnbondingDelegationsRequest,
        QueryDelegatorUnbondingDelegationsResponse,
        typeof Query.DelegatorUnbondingDelegations
      >(queryDelegatorUnBondingDelegations, Query.DelegatorUnbondingDelegations)

      return response.getUnbondingResponsesList()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }
}
