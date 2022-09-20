import {
  QueryDelegationRewardsRequest,
  QueryDelegationRewardsResponse,
  QueryDelegationTotalRewardsRequest,
  QueryDelegationTotalRewardsResponse,
  QueryParamsRequest as QueryDistributionParamsRequest,
  QueryParamsResponse as QueryDistributionParamsResponse,
} from '@injectivelabs/chain-api/cosmos/distribution/v1beta1/query_pb'
import { Query as DistributionQuery } from '@injectivelabs/chain-api/cosmos/distribution/v1beta1/query_pb_service'
import { Coin } from '@injectivelabs/ts-types'
import BaseConsumer from '../../BaseGrpcConsumer'
import { ChainGrpcDistributionTransformer } from '../transformers'
import { ValidatorRewards, ChainModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcDistributionApi extends BaseConsumer {
  protected module: string = ChainModule.Distribution

  async fetchModuleParams() {
    const request = new QueryDistributionParamsRequest()

    try {
      const response = await this.request<
        QueryDistributionParamsRequest,
        QueryDistributionParamsResponse,
        typeof DistributionQuery.Params
      >(request, DistributionQuery.Params)

      return ChainGrpcDistributionTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: any) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
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
    const request = new QueryDelegationRewardsRequest()
    request.setValidatorAddress(validatorAddress)
    request.setDelegatorAddress(delegatorAddress)

    try {
      const response = await this.request<
        QueryDelegationRewardsRequest,
        QueryDelegationRewardsResponse,
        typeof DistributionQuery.DelegationRewards
      >(request, DistributionQuery.DelegationRewards)

      return ChainGrpcDistributionTransformer.delegationRewardResponseToReward(
        response,
      )
    } catch (e: any) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error)
    }
  }

  async fetchDelegatorRewardsForValidatorNoThrow({
    delegatorAddress,
    validatorAddress,
  }: {
    delegatorAddress: string
    validatorAddress: string
  }) {
    const request = new QueryDelegationRewardsRequest()
    request.setValidatorAddress(validatorAddress)
    request.setDelegatorAddress(delegatorAddress)

    try {
      const response = await this.request<
        QueryDelegationRewardsRequest,
        QueryDelegationRewardsResponse,
        typeof DistributionQuery.DelegationRewards
      >(request, DistributionQuery.DelegationRewards)

      return ChainGrpcDistributionTransformer.delegationRewardResponseToReward(
        response,
      )
    } catch (e: any) {
      if (e.message.includes('does not exist')) {
        return [] as Coin[]
      }

      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error)
    }
  }

  async fetchDelegatorRewards(injectiveAddress: string) {
    const request = new QueryDelegationTotalRewardsRequest()
    request.setDelegatorAddress(injectiveAddress)

    try {
      const response = await this.request<
        QueryDelegationTotalRewardsRequest,
        QueryDelegationTotalRewardsResponse,
        typeof DistributionQuery.DelegationTotalRewards
      >(request, DistributionQuery.DelegationTotalRewards)

      return ChainGrpcDistributionTransformer.totalDelegationRewardResponseToTotalReward(
        response,
      )
    } catch (e: any) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error)
    }
  }

  async fetchDelegatorRewardsNoThrow(injectiveAddress: string) {
    const request = new QueryDelegationTotalRewardsRequest()
    request.setDelegatorAddress(injectiveAddress)

    try {
      const response = await this.request<
        QueryDelegationTotalRewardsRequest,
        QueryDelegationTotalRewardsResponse,
        typeof DistributionQuery.DelegationTotalRewards
      >(request, DistributionQuery.DelegationTotalRewards)

      return ChainGrpcDistributionTransformer.totalDelegationRewardResponseToTotalReward(
        response,
      )
    } catch (e: any) {
      if (e.message.includes('does not exist')) {
        return [] as ValidatorRewards[]
      }

      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error)
    }
  }
}
