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
import { ChainGrpcStakingTransformer } from '../transformers'
import { ChainModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcStakingApi extends BaseConsumer {
  protected module: string = ChainModule.Staking

  async fetchModuleParams() {
    const request = new QueryStakingParamsRequest()

    try {
      const response = await this.request<
        QueryStakingParamsRequest,
        QueryStakingParamsResponse,
        typeof StakingQuery.Params
      >(request, StakingQuery.Params)

      return ChainGrpcStakingTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchPool() {
    const request = new QueryPoolRequest()

    try {
      const response = await this.request<
        QueryPoolRequest,
        QueryPoolResponse,
        typeof StakingQuery.Pool
      >(request, StakingQuery.Pool)

      return ChainGrpcStakingTransformer.poolResponseToPool(response)
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchValidators(pagination?: PaginationOption) {
    const request = new QueryValidatorsRequest()

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.setPagination(paginationForRequest)
    }

    try {
      const response = await this.request<
        QueryValidatorsRequest,
        QueryValidatorsResponse,
        typeof StakingQuery.Validators
      >(request, StakingQuery.Validators)

      return ChainGrpcStakingTransformer.validatorsResponseToValidators(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchValidator(address: string) {
    const request = new QueryValidatorRequest()
    request.setValidatorAddr(address)

    try {
      const response = await this.request<
        QueryValidatorRequest,
        QueryValidatorResponse,
        typeof StakingQuery.Validator
      >(request, StakingQuery.Validator)

      return ChainGrpcStakingTransformer.validatorResponseToValidator(response)
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
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
        typeof StakingQuery.ValidatorDelegations
      >(request, StakingQuery.ValidatorDelegations)

      return ChainGrpcStakingTransformer.delegationsResponseToDelegations(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchValidatorDelegationsNoThrow({
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

      return ChainGrpcStakingTransformer.delegationsResponseToDelegations(
        response,
      )
    } catch (e: unknown) {
      if ((e as any).message.includes('does not exist')) {
        return { delegations: [], pagination: { total: 0, next: '' } }
      }

      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
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
        typeof StakingQuery.ValidatorUnbondingDelegations
      >(request, StakingQuery.ValidatorUnbondingDelegations)

      return ChainGrpcStakingTransformer.unBondingDelegationsResponseToUnBondingDelegations(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchValidatorUnbondingDelegationsNoThrow({
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

      return ChainGrpcStakingTransformer.unBondingDelegationsResponseToUnBondingDelegations(
        response,
      )
    } catch (e: unknown) {
      if ((e as any).message.includes('does not exist')) {
        return { unbondingDelegations: [], pagination: { total: 0, next: '' } }
      }

      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
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
        typeof StakingQuery.Delegation
      >(request, StakingQuery.Delegation)

      return ChainGrpcStakingTransformer.delegationResponseToDelegation(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
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
        typeof StakingQuery.DelegatorDelegations
      >(request, StakingQuery.DelegatorDelegations)

      return ChainGrpcStakingTransformer.delegationsResponseToDelegations(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchDelegationsNoThrow({
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

      return ChainGrpcStakingTransformer.delegationsResponseToDelegations(
        response,
      )
    } catch (e: unknown) {
      if ((e as any).message.includes('does not exist')) {
        return { delegations: [], pagination: { total: 0, next: '' } }
      }

      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
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
        typeof StakingQuery.ValidatorDelegations
      >(request, StakingQuery.ValidatorDelegations)

      return ChainGrpcStakingTransformer.delegationsResponseToDelegations(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchDelegatorsNoThrow({
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

      return ChainGrpcStakingTransformer.delegationsResponseToDelegations(
        response,
      )
    } catch (e: unknown) {
      if ((e as any).message.includes('does not exist')) {
        return { delegations: [], pagination: { total: 0, next: '' } }
      }

      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
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
        typeof StakingQuery.DelegatorUnbondingDelegations
      >(request, StakingQuery.DelegatorUnbondingDelegations)

      return ChainGrpcStakingTransformer.unBondingDelegationsResponseToUnBondingDelegations(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchUnbondingDelegationsNoThrow({
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

      return ChainGrpcStakingTransformer.unBondingDelegationsResponseToUnBondingDelegations(
        response,
      )
    } catch (e: unknown) {
      if ((e as any).message.includes('does not exist')) {
        return { unbondingDelegations: [], pagination: { total: 0, next: '' } }
      }

      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
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
        typeof StakingQuery.Redelegations
      >(request, StakingQuery.Redelegations)

      return ChainGrpcStakingTransformer.reDelegationsResponseToReDelegations(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchReDelegationsNoThrow({
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

      return ChainGrpcStakingTransformer.reDelegationsResponseToReDelegations(
        response,
      )
    } catch (e: unknown) {
      if ((e as any).message.includes('does not exist')) {
        return { redelegations: [], pagination: { total: 0, next: '' } }
      }

      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }
}
