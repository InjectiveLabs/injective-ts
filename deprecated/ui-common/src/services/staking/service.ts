import {
  DistributionConsumer,
  GrpcValidator,
  StakingConsumer,
} from '@injectivelabs/chain-consumer'
import { UiValidator, UiDelegation } from './types'
import { StakingTransformer } from './transformer'
import { Pagination, ServiceOptions } from '../../types/index'
import { pageResponseToPagination, generatePagination } from '../../utils'
import { BaseService } from '../BaseService'
import { ChainMetrics } from '../../types/metrics'

export class StakingService extends BaseService {
  protected consumer: StakingConsumer

  protected distributionConsumer: DistributionConsumer

  constructor(options: ServiceOptions) {
    super(options)
    this.consumer = new StakingConsumer(this.endpoints.sentryGrpcApi)
    this.distributionConsumer = new DistributionConsumer(
      this.endpoints.sentryGrpcApi,
    )
  }

  async fetchValidators(): Promise<UiValidator[]> {
    const promise = this.consumer.fetchValidators()
    const { validators: grpcValidators } = await this.fetchOrFetchAndMeasure(
      promise,
      ChainMetrics.FetchValidators,
    )

    return StakingTransformer.validatorsToUiValidators(grpcValidators)
  }

  async fetchValidator(validatorAddress: string): Promise<UiValidator> {
    const promise = this.consumer.fetchValidator(validatorAddress)
    const grpcValidator = (await this.fetchOrFetchAndMeasure(
      promise,
      ChainMetrics.FetchValidator,
    )) as GrpcValidator

    const [uiValidator] = StakingTransformer.validatorsToUiValidators([
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
    validatorDelegations: UiDelegation[]
  }> {
    try {
      const promise = this.consumer.fetchDelegators({
        validatorAddress,
        ...generatePagination(pagination),
      })

      const { delegators: grpcDelegators, pagination: grpcPagination } =
        await this.fetchOrFetchAndMeasure(
          promise,
          ChainMetrics.FetchValidatorDelegations,
        )

      return {
        pagination: pageResponseToPagination({
          oldPagination: pagination,
          newPagination: grpcPagination,
        }),
        validatorDelegations:
          StakingTransformer.grpcDelegationToUiDelegation(grpcDelegators),
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
      const promise = this.consumer.fetchDelegations({ injectiveAddress })
      const { delegations: grpcDelegations } =
        await this.fetchOrFetchAndMeasure(
          promise,
          ChainMetrics.FetchDelegations,
        )

      return StakingTransformer.grpcDelegationToUiDelegation(grpcDelegations)
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
      const promise = this.consumer.fetchUnbondingDelegations({
        injectiveAddress,
      })
      const { unbondingDelegations: grpcUnbondingDelegations } =
        await this.fetchOrFetchAndMeasure(
          promise,
          ChainMetrics.FetchUnbondingDelegations,
        )

      return StakingTransformer.grpcUnBondingDelegationsToUiUnBondingDelegations(
        grpcUnbondingDelegations,
      )
    } catch (e) {
      return []
    }
  }

  async fetchReDelegations({ injectiveAddress }: { injectiveAddress: string }) {
    try {
      const promise = this.consumer.fetchReDelegations({ injectiveAddress })
      const { redelegations: grpcReDelegations } =
        await this.fetchOrFetchAndMeasure(
          promise,
          ChainMetrics.FetchReDelegations,
        )

      return StakingTransformer.grpcReDelegationsToUiReDelegations(
        grpcReDelegations,
      )
    } catch (e) {
      return []
    }
  }

  async fetchRewards({ injectiveAddress }: { injectiveAddress: string }) {
    try {
      const promise =
        this.distributionConsumer.fetchDelegatorRewards(injectiveAddress)
      const rewards = await this.fetchOrFetchAndMeasure(
        promise,
        ChainMetrics.FetchRewards,
      )

      return StakingTransformer.grpcDelegationRewardToUiReward(rewards)
    } catch (e) {
      return []
    }
  }

  async fetchRewardForValidator({
    injectiveAddress,
    validatorAddress,
  }: {
    injectiveAddress: string
    validatorAddress: string
  }) {
    try {
      const promise =
        this.distributionConsumer.fetchDelegatorRewardsForValidator({
          validatorAddress,
          delegatorAddress: injectiveAddress,
        })
      const rewards = await this.fetchOrFetchAndMeasure(
        promise,
        ChainMetrics.FetchValidatorRewards,
      )

      return StakingTransformer.grpcDelegationRewardFromValidatorToUiReward(
        rewards,
        validatorAddress,
      )
    } catch (e) {
      return undefined
    }
  }
}
