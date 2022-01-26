import { GrpcException } from '@injectivelabs/exceptions'
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
  QueryParamsRequest,
  QueryParamsResponse,
  QueryValidatorUnbondingDelegationsRequest,
  QueryValidatorUnbondingDelegationsResponse,
} from '@injectivelabs/chain-api/cosmos/staking/v1beta1/query_pb'
import { Query } from '@injectivelabs/chain-api/cosmos/staking/v1beta1/query_pb_service'
import BaseConsumer from '../BaseConsumer'
import { PaginationOption, GrpcStakingParams } from '../types'
import { paginationRequestFromPagination } from '../utils'

export class StakingConsumer extends BaseConsumer {
  async fetchParams() {
    const request = new QueryParamsRequest()

    try {
      const response = await this.request<
        QueryParamsRequest,
        QueryParamsResponse,
        typeof Query.Params
      >(request, Query.Params)

      return response.getParams() as GrpcStakingParams
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchPool() {
    const request = new QueryPoolRequest()

    try {
      const response = await this.request<
        QueryPoolRequest,
        QueryPoolResponse,
        typeof Query.Pool
      >(request, Query.Pool)

      return response.getPool()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchValidators() {
    const request = new QueryValidatorsRequest()

    try {
      const response = await this.request<
        QueryValidatorsRequest,
        QueryValidatorsResponse,
        typeof Query.Validators
      >(request, Query.Validators)

      return {
        validators: response.getValidatorsList(),
        pagination: response.getPagination(),
      }
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchValidator(address: string) {
    const request = new QueryValidatorRequest()
    request.setValidatorAddr(address)

    try {
      const response = await this.request<
        QueryValidatorRequest,
        QueryValidatorResponse,
        typeof Query.Validator
      >(request, Query.Validator)

      return response.getValidator()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchValidatorDelegations({
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
        typeof Query.ValidatorDelegations
      >(request, Query.ValidatorDelegations)

      return {
        delegations: response.getDelegationResponsesList(),
        pagination: response.getPagination(),
      }
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchValidatorUnbondingDelegations({
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
        typeof Query.ValidatorUnbondingDelegations
      >(request, Query.ValidatorUnbondingDelegations)

      return {
        delegations: response.getUnbondingResponsesList(),
        pagination: response.getPagination(),
      }
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchDelegation({
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
        typeof Query.Delegation
      >(request, Query.Delegation)

      return response.getDelegationResponse()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchDelegations({
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
        typeof Query.DelegatorDelegations
      >(request, Query.DelegatorDelegations)

      return {
        delegations: response.getDelegationResponsesList(),
        pagination: response.getPagination(),
      }
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchDelegators({
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
        typeof Query.ValidatorDelegations
      >(request, Query.ValidatorDelegations)

      return {
        delegators: response.getDelegationResponsesList(),
        pagination: response.getPagination(),
      }
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchUnbondingDelegation({
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
        typeof Query.UnbondingDelegation
      >(request, Query.UnbondingDelegation)

      return response.getUnbond()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchUnbondingDelegations({
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
        typeof Query.DelegatorUnbondingDelegations
      >(request, Query.DelegatorUnbondingDelegations)

      return {
        unbondingDelegations: response.getUnbondingResponsesList(),
        pagination: response.getPagination(),
      }
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchReDelegations({
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
        typeof Query.Redelegations
      >(request, Query.Redelegations)

      return {
        redelegations: response.getRedelegationResponsesList(),
        pagination: response.getPagination(),
      }
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }
}
