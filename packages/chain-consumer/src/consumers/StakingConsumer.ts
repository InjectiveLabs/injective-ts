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
  QueryParamsRequest,
  QueryParamsResponse,
} from '@injectivelabs/chain-api/cosmos/staking/v1beta1/query_pb'
import { Query } from '@injectivelabs/chain-api/cosmos/staking/v1beta1/query_pb_service'
import { PageRequest } from '@injectivelabs/chain-api/cosmos/base/query/v1beta1/pagination_pb'
import BaseConsumer from '../BaseConsumer'
import { PaginationOption, GrpcStakingParams } from '../types'

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
    } catch (e) {
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
    } catch (e) {
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

    if (pagination) {
      const paginationForRequest = new PageRequest()
      paginationForRequest.setKey(pagination.key)

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
    } catch (e) {
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

    if (pagination) {
      const paginationForRequest = new PageRequest()
      paginationForRequest.setKey(pagination.key)

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
    } catch (e) {
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

    if (pagination) {
      const paginationForRequest = new PageRequest()
      paginationForRequest.setKey(pagination.key)

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
    } catch (e) {
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

    if (pagination) {
      const paginationForRequest = new PageRequest()
      paginationForRequest.setKey(pagination.key)

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
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }
}
