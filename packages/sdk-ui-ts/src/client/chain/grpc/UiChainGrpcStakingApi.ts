import { UiValidator } from '../../types/staking'
import { ChainGrpcStakingApi, Pagination } from '@injectivelabs/sdk-ts'
import {
  pageResponseToPagination,
  generatePagination,
} from '@injectivelabs/sdk-ts/dist/utils/pagination'
import { ChainMetrics } from '../../types/metrics'
import {
  Delegation,
  ChainGrpcStakingTransformer,
} from '@injectivelabs/sdk-ts/dist/client/chain'
import { UiStakingTransformer } from '../../transformers/UiStakingTransformer'
import { BaseApi } from '../../../BaseApi'
import { ApiOptions } from '../../types'

export class UiChainGrpcStakingApi extends BaseApi {
  protected client: ChainGrpcStakingApi

  constructor(options: ApiOptions) {
    super(options)
    this.client = new ChainGrpcStakingApi(options.endpoints.sentryGrpcApi)
  }

  async fetchValidators(): Promise<UiValidator[]> {
    const promise = this.client.fetchValidators()
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      ChainMetrics.FetchValidators,
    )
    const grpcValidators = response.getValidatorsList()

    return UiStakingTransformer.validatorsToUiValidators(grpcValidators)
  }

  async fetchValidator(validatorAddress: string): Promise<UiValidator> {
    const promise = this.client.fetchValidator(validatorAddress)
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      ChainMetrics.FetchValidator,
    )
    const grpcValidator = response.getValidator()

    if (!grpcValidator) {
      throw new Error(`Validator ${validatorAddress} not found`)
    }

    const [uiValidator] = UiStakingTransformer.validatorsToUiValidators([
      grpcValidator,
    ])

    return uiValidator
  }

  async fetchValidatorDelegations({
    validatorAddress,
    pagination,
  }: {
    validatorAddress: string
    pagination: Pagination
  }): Promise<{
    pagination: Pagination
    validatorDelegations: Delegation[]
  }> {
    try {
      const promise = this.client.fetchDelegators({
        validatorAddress,
        ...generatePagination(pagination),
      })

      const response = await this.fetchOrFetchAndMeasure(
        promise,
        ChainMetrics.FetchValidatorDelegations,
      )
      const grpcDelegators = response.getDelegationResponsesList()
      const grpcPagination = response.getPagination()

      return {
        pagination: pageResponseToPagination({
          oldPagination: pagination,
          newPagination: grpcPagination,
        }),
        validatorDelegations:
          ChainGrpcStakingTransformer.grpcDelegationToDelegation(
            grpcDelegators,
          ),
      }
    } catch (e) {
      return {
        pagination: {
          next: null,
          prev: null,
          current: null,
        },
        validatorDelegations: [],
      }
    }
  }

  async fetchDelegations({ injectiveAddress }: { injectiveAddress: string }) {
    try {
      const promise = this.client.fetchDelegations({
        injectiveAddress,
      })
      const response = await this.fetchOrFetchAndMeasure(
        promise,
        ChainMetrics.FetchDelegations,
      )
      const grpcDelegations = response.getDelegationResponsesList()

      return ChainGrpcStakingTransformer.grpcDelegationToDelegation(
        grpcDelegations,
      )
    } catch (e) {
      return []
    }
  }

  async fetchUnbondingDelegations({
    injectiveAddress,
  }: {
    injectiveAddress: string
  }) {
    try {
      const promise = this.client.fetchUnbondingDelegations({
        injectiveAddress,
      })
      const response = await this.fetchOrFetchAndMeasure(
        promise,
        ChainMetrics.FetchUnbondingDelegations,
      )
      const grpcUnbondingDelegations = response.getUnbondingResponsesList()

      return ChainGrpcStakingTransformer.grpcUnBondingDelegationsToUnBondingDelegations(
        grpcUnbondingDelegations,
      )
    } catch (e) {
      return []
    }
  }

  async fetchReDelegations({ injectiveAddress }: { injectiveAddress: string }) {
    try {
      const promise = this.client.fetchReDelegations({
        injectiveAddress,
      })
      const response = await this.fetchOrFetchAndMeasure(
        promise,
        ChainMetrics.FetchReDelegations,
      )
      const grpcReDelegations = response.getRedelegationResponsesList()

      return ChainGrpcStakingTransformer.grpcReDelegationsToReDelegations(
        grpcReDelegations,
      )
    } catch (e) {
      return []
    }
  }
}
