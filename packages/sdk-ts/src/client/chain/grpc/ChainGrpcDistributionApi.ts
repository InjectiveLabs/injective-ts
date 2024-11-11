import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { Coin } from '@injectivelabs/ts-types'
import { CosmosDistributionV1Beta1Query } from '@injectivelabs/core-proto-ts'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ValidatorRewards, ChainModule } from '../types/index.js'
import { ChainGrpcDistributionTransformer } from '../transformers/index.js'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcDistributionApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Distribution

  protected client: CosmosDistributionV1Beta1Query.QueryClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new CosmosDistributionV1Beta1Query.QueryClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchModuleParams() {
    const request = CosmosDistributionV1Beta1Query.QueryParamsRequest.create()

    try {
      const response =
        await this.retry<CosmosDistributionV1Beta1Query.QueryParamsResponse>(
          () => this.client.Params(request, this.metadata),
        )

      return ChainGrpcDistributionTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: any) {
      if (e instanceof CosmosDistributionV1Beta1Query.GrpcWebError) {
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

  async fetchDelegatorRewardsForValidator({
    delegatorAddress,
    validatorAddress,
  }: {
    delegatorAddress: string
    validatorAddress: string
  }) {
    const request =
      CosmosDistributionV1Beta1Query.QueryDelegationRewardsRequest.create()

    request.validatorAddress = validatorAddress
    request.delegatorAddress = delegatorAddress

    try {
      const response =
        await this.retry<CosmosDistributionV1Beta1Query.QueryDelegationRewardsResponse>(
          () => this.client.DelegationRewards(request, this.metadata),
        )

      return ChainGrpcDistributionTransformer.delegationRewardResponseToReward(
        response,
      )
    } catch (e: any) {
      if (e instanceof CosmosDistributionV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'DelegationRewards',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'DelegationRewards',
        contextModule: this.module,
      })
    }
  }

  async fetchDelegatorRewardsForValidatorNoThrow({
    delegatorAddress,
    validatorAddress,
  }: {
    delegatorAddress: string
    validatorAddress: string
  }) {
    const request =
      CosmosDistributionV1Beta1Query.QueryDelegationRewardsRequest.create()

    request.validatorAddress = validatorAddress
    request.delegatorAddress = delegatorAddress

    try {
      const response =
        await this.retry<CosmosDistributionV1Beta1Query.QueryDelegationRewardsResponse>(
          () => this.client.DelegationRewards(request, this.metadata),
        )

      return ChainGrpcDistributionTransformer.delegationRewardResponseToReward(
        response,
      )
    } catch (e: any) {
      if (
        e.message.includes('does not exist') ||
        e.message.includes('no delegation for (address, validator) tuple')
      ) {
        return [] as Coin[]
      }

      if (e instanceof CosmosDistributionV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'DelegationRewards',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'DelegationRewards',
        contextModule: this.module,
      })
    }
  }

  async fetchDelegatorRewards(injectiveAddress: string) {
    const request =
      CosmosDistributionV1Beta1Query.QueryDelegationTotalRewardsRequest.create()

    request.delegatorAddress = injectiveAddress

    try {
      const response =
        await this.retry<CosmosDistributionV1Beta1Query.QueryDelegationTotalRewardsResponse>(
          () => this.client.DelegationTotalRewards(request, this.metadata),
        )

      return ChainGrpcDistributionTransformer.totalDelegationRewardResponseToTotalReward(
        response,
      )
    } catch (e: any) {
      if (e instanceof CosmosDistributionV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'DelegationTotalRewards',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'DelegationTotalRewards',
        contextModule: this.module,
      })
    }
  }

  async fetchDelegatorRewardsNoThrow(injectiveAddress: string) {
    const request =
      CosmosDistributionV1Beta1Query.QueryDelegationTotalRewardsRequest.create()

    request.delegatorAddress = injectiveAddress

    try {
      const response =
        await this.retry<CosmosDistributionV1Beta1Query.QueryDelegationTotalRewardsResponse>(
          () => this.client.DelegationTotalRewards(request, this.metadata),
        )

      return ChainGrpcDistributionTransformer.totalDelegationRewardResponseToTotalReward(
        response,
      )
    } catch (e: any) {
      if (e.message.includes('does not exist')) {
        return [] as ValidatorRewards[]
      }

      if (e instanceof CosmosDistributionV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'DelegationTotalRewards',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'DelegationTotalRewards',
        contextModule: this.module,
      })
    }
  }
}
