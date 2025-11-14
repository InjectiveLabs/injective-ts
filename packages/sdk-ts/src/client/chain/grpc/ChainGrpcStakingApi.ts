import * as CosmosStakingV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/staking/v1beta1/query_pb'
import { QueryClient as CosmosStakingV1Beta1QueryClient } from '@injectivelabs/core-proto-ts-v2/generated/cosmos/staking/v1beta1/query_pb.client'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainGrpcStakingTransformer } from '../transformers/index.js'
import { ChainGrpcCommonTransformer } from '../transformers/ChainGrpcCommonTransformer.js'
import type { PaginationOption } from '../../../types/pagination.js'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcStakingApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Staking
  private client: CosmosStakingV1Beta1QueryClient

  constructor(endpoint: string) {
    super(endpoint)
    this.client = new CosmosStakingV1Beta1QueryClient(this.transport)
  }

  async fetchModuleParams() {
    const request = CosmosStakingV1Beta1QueryPb.QueryParamsRequest.create()

    const response = await this.executeGrpcCall<
      CosmosStakingV1Beta1QueryPb.QueryParamsRequest,
      CosmosStakingV1Beta1QueryPb.QueryParamsResponse
    >(request, this.client.params.bind(this.client))

    return ChainGrpcStakingTransformer.moduleParamsResponseToModuleParams(
      response,
    )
  }

  async fetchPool() {
    const request = CosmosStakingV1Beta1QueryPb.QueryPoolRequest.create()

    const response = await this.executeGrpcCall<
      CosmosStakingV1Beta1QueryPb.QueryPoolRequest,
      CosmosStakingV1Beta1QueryPb.QueryPoolResponse
    >(request, this.client.pool.bind(this.client))

    return ChainGrpcStakingTransformer.poolResponseToPool(response)
  }

  async fetchValidators(pagination?: PaginationOption) {
    const request = CosmosStakingV1Beta1QueryPb.QueryValidatorsRequest.create()

    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    const response = await this.executeGrpcCall<
      CosmosStakingV1Beta1QueryPb.QueryValidatorsRequest,
      CosmosStakingV1Beta1QueryPb.QueryValidatorsResponse
    >(request, this.client.validators.bind(this.client))

    return ChainGrpcStakingTransformer.validatorsResponseToValidators(response)
  }

  async fetchValidator(address: string) {
    const request = CosmosStakingV1Beta1QueryPb.QueryValidatorRequest.create()

    request.validatorAddr = address

    const response = await this.executeGrpcCall<
      CosmosStakingV1Beta1QueryPb.QueryValidatorRequest,
      CosmosStakingV1Beta1QueryPb.QueryValidatorResponse
    >(request, this.client.validator.bind(this.client))

    return ChainGrpcStakingTransformer.validatorResponseToValidator(response)
  }

  async fetchValidatorDelegations({
    validatorAddress,
    pagination,
  }: {
    validatorAddress: string
    pagination?: PaginationOption
  }) {
    const request =
      CosmosStakingV1Beta1QueryPb.QueryValidatorDelegationsRequest.create()

    request.validatorAddr = validatorAddress

    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    const response = await this.executeGrpcCall<
      CosmosStakingV1Beta1QueryPb.QueryValidatorDelegationsRequest,
      CosmosStakingV1Beta1QueryPb.QueryValidatorDelegationsResponse
    >(request, this.client.validatorDelegations.bind(this.client))

    return ChainGrpcStakingTransformer.delegationsResponseToDelegations(
      response,
    )
  }

  async fetchValidatorDelegationsNoThrow({
    validatorAddress,
    pagination,
  }: {
    validatorAddress: string
    pagination?: PaginationOption
  }) {
    const request =
      CosmosStakingV1Beta1QueryPb.QueryValidatorDelegationsRequest.create()

    request.validatorAddr = validatorAddress

    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response = await this.executeGrpcCall<
        CosmosStakingV1Beta1QueryPb.QueryValidatorDelegationsRequest,
        CosmosStakingV1Beta1QueryPb.QueryValidatorDelegationsResponse
      >(request, this.client.validatorDelegations.bind(this.client))

      return ChainGrpcStakingTransformer.delegationsResponseToDelegations(
        response,
      )
    } catch (e: unknown) {
      if ((e as any).message.includes('does not exist')) {
        return { delegations: [], pagination: { total: 0, next: '' } }
      }

      throw e
    }
  }

  async fetchValidatorUnbondingDelegations({
    validatorAddress,
    pagination,
  }: {
    validatorAddress: string
    pagination?: PaginationOption
  }) {
    const request =
      CosmosStakingV1Beta1QueryPb.QueryValidatorUnbondingDelegationsRequest.create()

    request.validatorAddr = validatorAddress

    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    const response = await this.executeGrpcCall<
      CosmosStakingV1Beta1QueryPb.QueryValidatorUnbondingDelegationsRequest,
      CosmosStakingV1Beta1QueryPb.QueryValidatorUnbondingDelegationsResponse
    >(request, this.client.validatorUnbondingDelegations.bind(this.client))

    return ChainGrpcStakingTransformer.unBondingDelegationsResponseToUnBondingDelegations(
      response,
    )
  }

  async fetchValidatorUnbondingDelegationsNoThrow({
    validatorAddress,
    pagination,
  }: {
    validatorAddress: string
    pagination?: PaginationOption
  }) {
    const request =
      CosmosStakingV1Beta1QueryPb.QueryValidatorUnbondingDelegationsRequest.create()

    request.validatorAddr = validatorAddress

    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response = await this.executeGrpcCall<
        CosmosStakingV1Beta1QueryPb.QueryValidatorUnbondingDelegationsRequest,
        CosmosStakingV1Beta1QueryPb.QueryValidatorUnbondingDelegationsResponse
      >(request, this.client.validatorUnbondingDelegations.bind(this.client))

      return ChainGrpcStakingTransformer.unBondingDelegationsResponseToUnBondingDelegations(
        response,
      )
    } catch (e: unknown) {
      if ((e as any).message.includes('does not exist')) {
        return { unbondingDelegations: [], pagination: { total: 0, next: '' } }
      }

      throw e
    }
  }

  async fetchDelegation({
    injectiveAddress,
    validatorAddress,
  }: {
    injectiveAddress: string
    validatorAddress: string
  }) {
    const request = CosmosStakingV1Beta1QueryPb.QueryDelegationRequest.create()

    request.delegatorAddr = injectiveAddress
    request.validatorAddr = validatorAddress

    const response = await this.executeGrpcCall<
      CosmosStakingV1Beta1QueryPb.QueryDelegationRequest,
      CosmosStakingV1Beta1QueryPb.QueryDelegationResponse
    >(request, this.client.delegation.bind(this.client))

    return ChainGrpcStakingTransformer.delegationResponseToDelegation(response)
  }

  async fetchDelegations({
    injectiveAddress,
    pagination,
  }: {
    injectiveAddress: string
    pagination?: PaginationOption
  }) {
    const request =
      CosmosStakingV1Beta1QueryPb.QueryDelegatorDelegationsRequest.create()

    request.delegatorAddr = injectiveAddress

    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    const response = await this.executeGrpcCall<
      CosmosStakingV1Beta1QueryPb.QueryDelegatorDelegationsRequest,
      CosmosStakingV1Beta1QueryPb.QueryDelegatorDelegationsResponse
    >(request, this.client.delegatorDelegations.bind(this.client))

    return ChainGrpcStakingTransformer.delegationsResponseToDelegations(
      response,
    )
  }

  async fetchDelegationsNoThrow({
    injectiveAddress,
    pagination,
  }: {
    injectiveAddress: string
    pagination?: PaginationOption
  }) {
    const request =
      CosmosStakingV1Beta1QueryPb.QueryDelegatorDelegationsRequest.create()

    request.delegatorAddr = injectiveAddress

    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response = await this.executeGrpcCall<
        CosmosStakingV1Beta1QueryPb.QueryDelegatorDelegationsRequest,
        CosmosStakingV1Beta1QueryPb.QueryDelegatorDelegationsResponse
      >(request, this.client.delegatorDelegations.bind(this.client))

      return ChainGrpcStakingTransformer.delegationsResponseToDelegations(
        response,
      )
    } catch (e: unknown) {
      if ((e as any).message.includes('does not exist')) {
        return { delegations: [], pagination: { total: 0, next: '' } }
      }

      throw e
    }
  }

  async fetchDelegators({
    validatorAddress,
    pagination,
  }: {
    validatorAddress: string
    pagination?: PaginationOption
  }) {
    const request =
      CosmosStakingV1Beta1QueryPb.QueryValidatorDelegationsRequest.create()

    request.validatorAddr = validatorAddress

    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    const response = await this.executeGrpcCall<
      CosmosStakingV1Beta1QueryPb.QueryValidatorDelegationsRequest,
      CosmosStakingV1Beta1QueryPb.QueryValidatorDelegationsResponse
    >(request, this.client.validatorDelegations.bind(this.client))

    return ChainGrpcStakingTransformer.delegationsResponseToDelegations(
      response,
    )
  }

  async fetchDelegatorsNoThrow({
    validatorAddress,
    pagination,
  }: {
    validatorAddress: string
    pagination?: PaginationOption
  }) {
    const request =
      CosmosStakingV1Beta1QueryPb.QueryValidatorDelegationsRequest.create()

    request.validatorAddr = validatorAddress

    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response = await this.executeGrpcCall<
        CosmosStakingV1Beta1QueryPb.QueryValidatorDelegationsRequest,
        CosmosStakingV1Beta1QueryPb.QueryValidatorDelegationsResponse
      >(request, this.client.validatorDelegations.bind(this.client))

      return ChainGrpcStakingTransformer.delegationsResponseToDelegations(
        response,
      )
    } catch (e: unknown) {
      if ((e as any).message.includes('does not exist')) {
        return { delegations: [], pagination: { total: 0, next: '' } }
      }

      throw e
    }
  }

  async fetchUnbondingDelegations({
    injectiveAddress,
    pagination,
  }: {
    injectiveAddress: string
    pagination?: PaginationOption
  }) {
    const request =
      CosmosStakingV1Beta1QueryPb.QueryDelegatorUnbondingDelegationsRequest.create()

    request.delegatorAddr = injectiveAddress

    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    const response = await this.executeGrpcCall<
      CosmosStakingV1Beta1QueryPb.QueryDelegatorUnbondingDelegationsRequest,
      CosmosStakingV1Beta1QueryPb.QueryDelegatorUnbondingDelegationsResponse
    >(request, this.client.delegatorUnbondingDelegations.bind(this.client))

    return ChainGrpcStakingTransformer.unBondingDelegationsResponseToUnBondingDelegations(
      response,
    )
  }

  async fetchUnbondingDelegationsNoThrow({
    injectiveAddress,
    pagination,
  }: {
    injectiveAddress: string
    pagination?: PaginationOption
  }) {
    const request =
      CosmosStakingV1Beta1QueryPb.QueryDelegatorUnbondingDelegationsRequest.create()

    request.delegatorAddr = injectiveAddress

    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response = await this.executeGrpcCall<
        CosmosStakingV1Beta1QueryPb.QueryDelegatorUnbondingDelegationsRequest,
        CosmosStakingV1Beta1QueryPb.QueryDelegatorUnbondingDelegationsResponse
      >(request, this.client.delegatorUnbondingDelegations.bind(this.client))

      return ChainGrpcStakingTransformer.unBondingDelegationsResponseToUnBondingDelegations(
        response,
      )
    } catch (e: unknown) {
      if ((e as any).message.includes('does not exist')) {
        return { unbondingDelegations: [], pagination: { total: 0, next: '' } }
      }

      throw e
    }
  }

  async fetchReDelegations({
    injectiveAddress,
    pagination,
  }: {
    injectiveAddress: string
    pagination?: PaginationOption
  }) {
    const request =
      CosmosStakingV1Beta1QueryPb.QueryRedelegationsRequest.create()

    request.delegatorAddr = injectiveAddress

    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    const response = await this.executeGrpcCall<
      CosmosStakingV1Beta1QueryPb.QueryRedelegationsRequest,
      CosmosStakingV1Beta1QueryPb.QueryRedelegationsResponse
    >(request, this.client.redelegations.bind(this.client))

    return ChainGrpcStakingTransformer.reDelegationsResponseToReDelegations(
      response,
    )
  }

  async fetchReDelegationsNoThrow({
    injectiveAddress,
    pagination,
  }: {
    injectiveAddress: string
    pagination?: PaginationOption
  }) {
    const request =
      CosmosStakingV1Beta1QueryPb.QueryRedelegationsRequest.create()

    request.delegatorAddr = injectiveAddress

    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response = await this.executeGrpcCall<
        CosmosStakingV1Beta1QueryPb.QueryRedelegationsRequest,
        CosmosStakingV1Beta1QueryPb.QueryRedelegationsResponse
      >(request, this.client.redelegations.bind(this.client))

      return ChainGrpcStakingTransformer.reDelegationsResponseToReDelegations(
        response,
      )
    } catch (e: unknown) {
      if ((e as any).message.includes('does not exist')) {
        return { redelegations: [], pagination: { total: 0, next: '' } }
      }

      throw e
    }
  }
}
