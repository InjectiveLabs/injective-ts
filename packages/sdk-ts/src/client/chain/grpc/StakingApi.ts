import {
  QueryDelegatorDelegationsRequest,
  QueryDelegatorDelegationsResponse,
  QueryDelegatorUnbondingDelegationsRequest,
  QueryDelegatorUnbondingDelegationsResponse,
  QueryValidatorDelegationsRequest,
  QueryRedelegationsRequest,
  QueryPoolRequest,
  QueryPoolResponse,
  QueryRedelegationsResponse,
  QueryValidatorDelegationsResponse,
  QueryValidatorsRequest,
  QueryValidatorsResponse,
  QueryDelegationResponse,
  QueryDelegationRequest,
  QueryUnbondingDelegationResponse,
  QueryUnbondingDelegationRequest,
  QueryValidatorRequest,
  QueryValidatorResponse,
  QueryParamsRequest as QueryStakingParamsRequest,
  QueryParamsResponse as QueryStakingParamsResponse,
  QueryValidatorUnbondingDelegationsRequest,
  QueryValidatorUnbondingDelegationsResponse,
} from '@injectivelabs/chain-api/cosmos/staking/v1beta1/query_pb'
import { Query as StakingQuery } from '@injectivelabs/chain-api/cosmos/staking/v1beta1/query_pb_service'
import BaseConsumer from '../../BaseGrpcConsumer'
import { PaginationOption } from '../../../types/pagination'
import { paginationRequestFromPagination } from '../../../utils/pagination'

export class StakingApi extends BaseConsumer {
  async moduleParams() {
    const request = new QueryStakingParamsRequest()

    try {
      const response = await this.request<
        QueryStakingParamsRequest,
        QueryStakingParamsResponse,
        typeof StakingQuery.Params
      >(request, StakingQuery.Params)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async pool() {
    const request = new QueryPoolRequest()

    try {
      const response = await this.request<
        QueryPoolRequest,
        QueryPoolResponse,
        typeof StakingQuery.Pool
      >(request, StakingQuery.Pool)

      return response.getPool()
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async validators() {
    const request = new QueryValidatorsRequest()

    try {
      const response = await this.request<
        QueryValidatorsRequest,
        QueryValidatorsResponse,
        typeof StakingQuery.Validators
      >(request, StakingQuery.Validators)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async validator(address: string) {
    const request = new QueryValidatorRequest()
    request.setValidatorAddr(address)

    try {
      const response = await this.request<
        QueryValidatorRequest,
        QueryValidatorResponse,
        typeof StakingQuery.Validator
      >(request, StakingQuery.Validator)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async validatorDelegations({
    validatorAddress,
    pagination,
  }: {
    validatorAddress: string
    pagination?: PaginationOption
  }) {
    const request = new QueryValidatorDelegationsRequest()
    request.setValidatorAddr(validatorAddress)

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.setPagination(paginationForRequest)
    }

    try {
      const response = await this.request<
        QueryValidatorDelegationsRequest,
        QueryValidatorDelegationsResponse,
        typeof StakingQuery.ValidatorDelegations
      >(request, StakingQuery.ValidatorDelegations)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async validatorUnbondingDelegations({
    validatorAddress,
    pagination,
  }: {
    validatorAddress: string
    pagination?: PaginationOption
  }) {
    const request = new QueryValidatorUnbondingDelegationsRequest()
    request.setValidatorAddr(validatorAddress)

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.setPagination(paginationForRequest)
    }

    try {
      const response = await this.request<
        QueryValidatorUnbondingDelegationsRequest,
        QueryValidatorUnbondingDelegationsResponse,
        typeof StakingQuery.ValidatorUnbondingDelegations
      >(request, StakingQuery.ValidatorUnbondingDelegations)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async delegation({
    injectiveAddress,
    validatorAddress,
  }: {
    injectiveAddress: string
    validatorAddress: string
  }) {
    const request = new QueryDelegationRequest()
    request.setDelegatorAddr(injectiveAddress)
    request.setValidatorAddr(validatorAddress)

    try {
      const response = await this.request<
        QueryDelegationRequest,
        QueryDelegationResponse,
        typeof StakingQuery.Delegation
      >(request, StakingQuery.Delegation)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async delegations({
    injectiveAddress,
    pagination,
  }: {
    injectiveAddress: string
    pagination?: PaginationOption
  }) {
    const request = new QueryDelegatorDelegationsRequest()
    request.setDelegatorAddr(injectiveAddress)

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.setPagination(paginationForRequest)
    }

    try {
      const response = await this.request<
        QueryDelegatorDelegationsRequest,
        QueryDelegatorDelegationsResponse,
        typeof StakingQuery.DelegatorDelegations
      >(request, StakingQuery.DelegatorDelegations)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async delegators({
    validatorAddress,
    pagination,
  }: {
    validatorAddress: string
    pagination?: PaginationOption
  }) {
    const request = new QueryValidatorDelegationsRequest()
    request.setValidatorAddr(validatorAddress)

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.setPagination(paginationForRequest)
    }

    try {
      const response = await this.request<
        QueryValidatorDelegationsRequest,
        QueryValidatorDelegationsResponse,
        typeof StakingQuery.ValidatorDelegations
      >(request, StakingQuery.ValidatorDelegations)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async unbondingDelegation({
    injectiveAddress,
    validatorAddress,
  }: {
    injectiveAddress: string
    validatorAddress: string
  }) {
    const request = new QueryUnbondingDelegationRequest()
    request.setDelegatorAddr(injectiveAddress)
    request.setValidatorAddr(validatorAddress)

    try {
      const response = await this.request<
        QueryUnbondingDelegationRequest,
        QueryUnbondingDelegationResponse,
        typeof StakingQuery.UnbondingDelegation
      >(request, StakingQuery.UnbondingDelegation)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async unbondingDelegations({
    injectiveAddress,
    pagination,
  }: {
    injectiveAddress: string
    pagination?: PaginationOption
  }) {
    const request = new QueryDelegatorUnbondingDelegationsRequest()
    request.setDelegatorAddr(injectiveAddress)

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.setPagination(paginationForRequest)
    }

    try {
      const response = await this.request<
        QueryDelegatorUnbondingDelegationsRequest,
        QueryDelegatorUnbondingDelegationsResponse,
        typeof StakingQuery.DelegatorUnbondingDelegations
      >(request, StakingQuery.DelegatorUnbondingDelegations)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async reDelegations({
    injectiveAddress,
    pagination,
  }: {
    injectiveAddress: string
    pagination?: PaginationOption
  }) {
    const request = new QueryRedelegationsRequest()
    request.setDelegatorAddr(injectiveAddress)

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.setPagination(paginationForRequest)
    }

    try {
      const response = await this.request<
        QueryRedelegationsRequest,
        QueryRedelegationsResponse,
        typeof StakingQuery.Redelegations
      >(request, StakingQuery.Redelegations)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
