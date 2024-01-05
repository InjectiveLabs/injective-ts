import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { CosmosStakingV1Beta1Query } from '@injectivelabs/core-proto-ts'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer'
import { ChainModule } from '../types'
import { PaginationOption } from '../../../types/pagination'
import { ChainGrpcStakingTransformer } from '../transformers'
import { paginationRequestFromPagination } from '../../../utils/pagination'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcStakingApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Staking

  protected client: CosmosStakingV1Beta1Query.QueryClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new CosmosStakingV1Beta1Query.QueryClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchModuleParams() {
    const request = CosmosStakingV1Beta1Query.QueryParamsRequest.create()

    try {
      const response =
        await this.retry<CosmosStakingV1Beta1Query.QueryParamsResponse>(() =>
          this.client.Params(request),
        )

      return ChainGrpcStakingTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmosStakingV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Params',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Params',
        contextModule: this.module,
      })
    }
  }

  async fetchPool() {
    const request = CosmosStakingV1Beta1Query.QueryPoolRequest.create()

    try {
      const response =
        await this.retry<CosmosStakingV1Beta1Query.QueryPoolResponse>(() =>
          this.client.Pool(request),
        )

      return ChainGrpcStakingTransformer.poolResponseToPool(response)
    } catch (e: unknown) {
      if (e instanceof CosmosStakingV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Pool',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Pool',
        contextModule: this.module,
      })
    }
  }

  async fetchValidators(pagination?: PaginationOption) {
    const request = CosmosStakingV1Beta1Query.QueryValidatorsRequest.create()

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response =
        await this.retry<CosmosStakingV1Beta1Query.QueryValidatorsResponse>(
          () => this.client.Validators(request),
        )

      return ChainGrpcStakingTransformer.validatorsResponseToValidators(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmosStakingV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Validators',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Validators',
        contextModule: this.module,
      })
    }
  }

  async fetchValidator(address: string) {
    const request = CosmosStakingV1Beta1Query.QueryValidatorRequest.create()

    request.validatorAddr = address

    try {
      const response =
        await this.retry<CosmosStakingV1Beta1Query.QueryValidatorResponse>(() =>
          this.client.Validator(request),
        )

      return ChainGrpcStakingTransformer.validatorResponseToValidator(response)
    } catch (e: unknown) {
      if (e instanceof CosmosStakingV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Validator',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Validator',
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
    const request =
      CosmosStakingV1Beta1Query.QueryValidatorDelegationsRequest.create()

    request.validatorAddr = validatorAddress

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response =
        await this.retry<CosmosStakingV1Beta1Query.QueryValidatorDelegationsResponse>(
          () => this.client.ValidatorDelegations(request),
        )

      return ChainGrpcStakingTransformer.delegationsResponseToDelegations(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmosStakingV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'ValidatorDelegations',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'ValidatorDelegations',
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
    const request =
      CosmosStakingV1Beta1Query.QueryValidatorDelegationsRequest.create()

    request.validatorAddr = validatorAddress

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response =
        await this.retry<CosmosStakingV1Beta1Query.QueryValidatorDelegationsResponse>(
          () => this.client.ValidatorDelegations(request),
        )

      return ChainGrpcStakingTransformer.delegationsResponseToDelegations(
        response,
      )
    } catch (e: unknown) {
      if ((e as any).message.includes('does not exist')) {
        return { delegations: [], pagination: { total: 0, next: '' } }
      }

      if (e instanceof CosmosStakingV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'ValidatorDelegations',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'ValidatorDelegations',
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
    const request =
      CosmosStakingV1Beta1Query.QueryValidatorUnbondingDelegationsRequest.create()

    request.validatorAddr = validatorAddress

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response =
        await this.retry<CosmosStakingV1Beta1Query.QueryValidatorUnbondingDelegationsResponse>(
          () => this.client.ValidatorUnbondingDelegations(request),
        )

      return ChainGrpcStakingTransformer.unBondingDelegationsResponseToUnBondingDelegations(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmosStakingV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'ValidatorUnbondingDelegations',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'ValidatorUnbondingDelegations',
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
    const request =
      CosmosStakingV1Beta1Query.QueryValidatorUnbondingDelegationsRequest.create()

    request.validatorAddr = validatorAddress

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response =
        await this.retry<CosmosStakingV1Beta1Query.QueryValidatorUnbondingDelegationsResponse>(
          () => this.client.ValidatorUnbondingDelegations(request),
        )

      return ChainGrpcStakingTransformer.unBondingDelegationsResponseToUnBondingDelegations(
        response,
      )
    } catch (e: unknown) {
      if ((e as any).message.includes('does not exist')) {
        return { unbondingDelegations: [], pagination: { total: 0, next: '' } }
      }

      if (e instanceof CosmosStakingV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'ValidatorUnbondingDelegations',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'ValidatorUnbondingDelegations',
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
    const request = CosmosStakingV1Beta1Query.QueryDelegationRequest.create()

    request.delegatorAddr = injectiveAddress
    request.validatorAddr = validatorAddress

    try {
      const response =
        await this.retry<CosmosStakingV1Beta1Query.QueryDelegationResponse>(
          () => this.client.Delegation(request),
        )

      return ChainGrpcStakingTransformer.delegationResponseToDelegation(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmosStakingV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Delegation',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Delegation',
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
    const request =
      CosmosStakingV1Beta1Query.QueryDelegatorDelegationsRequest.create()

    request.delegatorAddr = injectiveAddress

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response =
        await this.retry<CosmosStakingV1Beta1Query.QueryDelegatorDelegationsResponse>(
          () => this.client.DelegatorDelegations(request),
        )

      return ChainGrpcStakingTransformer.delegationsResponseToDelegations(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmosStakingV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Delegations',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Delegations',
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
    const request =
      CosmosStakingV1Beta1Query.QueryDelegatorDelegationsRequest.create()

    request.delegatorAddr = injectiveAddress

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response =
        await this.retry<CosmosStakingV1Beta1Query.QueryDelegatorDelegationsResponse>(
          () => this.client.DelegatorDelegations(request),
        )

      return ChainGrpcStakingTransformer.delegationsResponseToDelegations(
        response,
      )
    } catch (e: unknown) {
      if ((e as any).message.includes('does not exist')) {
        return { delegations: [], pagination: { total: 0, next: '' } }
      }

      if (e instanceof CosmosStakingV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Delegation',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Delegation',
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
    const request =
      CosmosStakingV1Beta1Query.QueryValidatorDelegationsRequest.create()

    request.validatorAddr = validatorAddress

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response =
        await this.retry<CosmosStakingV1Beta1Query.QueryValidatorDelegationsResponse>(
          () => this.client.ValidatorDelegations(request),
        )

      return ChainGrpcStakingTransformer.delegationsResponseToDelegations(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmosStakingV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'ValidatorDelegations',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'ValidatorDelegations',
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
    const request =
      CosmosStakingV1Beta1Query.QueryValidatorDelegationsRequest.create()

    request.validatorAddr = validatorAddress

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response =
        await this.retry<CosmosStakingV1Beta1Query.QueryValidatorDelegationsResponse>(
          () => this.client.ValidatorDelegations(request),
        )

      return ChainGrpcStakingTransformer.delegationsResponseToDelegations(
        response,
      )
    } catch (e: unknown) {
      if ((e as any).message.includes('does not exist')) {
        return { delegations: [], pagination: { total: 0, next: '' } }
      }

      if (e instanceof CosmosStakingV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'ValidatorDelegations',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'ValidatorDelegations',
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
    const request =
      CosmosStakingV1Beta1Query.QueryDelegatorUnbondingDelegationsRequest.create()

    request.delegatorAddr = injectiveAddress

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response =
        await this.retry<CosmosStakingV1Beta1Query.QueryDelegatorUnbondingDelegationsResponse>(
          () => this.client.DelegatorUnbondingDelegations(request),
        )

      return ChainGrpcStakingTransformer.unBondingDelegationsResponseToUnBondingDelegations(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmosStakingV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'DelegatorUnbondingDelegations',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'DelegatorUnbondingDelegations',
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
    const request =
      CosmosStakingV1Beta1Query.QueryDelegatorUnbondingDelegationsRequest.create()

    request.delegatorAddr = injectiveAddress

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response =
        await this.retry<CosmosStakingV1Beta1Query.QueryDelegatorUnbondingDelegationsResponse>(
          () => this.client.DelegatorUnbondingDelegations(request),
        )

      return ChainGrpcStakingTransformer.unBondingDelegationsResponseToUnBondingDelegations(
        response,
      )
    } catch (e: unknown) {
      if ((e as any).message.includes('does not exist')) {
        return { unbondingDelegations: [], pagination: { total: 0, next: '' } }
      }

      if (e instanceof CosmosStakingV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'DelegatorUnbondingDelegations',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'DelegatorUnbondingDelegations',
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
    const request = CosmosStakingV1Beta1Query.QueryRedelegationsRequest.create()

    request.delegatorAddr = injectiveAddress

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response =
        await this.retry<CosmosStakingV1Beta1Query.QueryRedelegationsResponse>(
          () => this.client.Redelegations(request),
        )

      return ChainGrpcStakingTransformer.reDelegationsResponseToReDelegations(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmosStakingV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Redelegations',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Redelegations',
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
    const request = CosmosStakingV1Beta1Query.QueryRedelegationsRequest.create()

    request.delegatorAddr = injectiveAddress

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response =
        await this.retry<CosmosStakingV1Beta1Query.QueryRedelegationsResponse>(
          () => this.client.Redelegations(request),
        )

      return ChainGrpcStakingTransformer.reDelegationsResponseToReDelegations(
        response,
      )
    } catch (e: unknown) {
      if ((e as any).message.includes('does not exist')) {
        return { redelegations: [], pagination: { total: 0, next: '' } }
      }

      if (e instanceof CosmosStakingV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Redelegations',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Redelegations',
        contextModule: this.module,
      })
    }
  }
}
