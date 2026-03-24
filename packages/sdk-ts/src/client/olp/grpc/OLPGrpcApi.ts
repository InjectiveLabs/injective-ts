import { IndexerErrorModule } from '@injectivelabs/exceptions'
import * as DmmPb from '@injectivelabs/olp-proto-ts-v2/generated/goagen_olp_injective_dmm_v2_pb'
import { InjectiveDmmV2Client } from '@injectivelabs/olp-proto-ts-v2/generated/goagen_olp_injective_dmm_v2_pb.client'
import { DmmGrpcTransformer } from './transformers/index.js'
import BaseIndexerGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import type { GrpcCallOptions } from '../../../types/index.js'

export class OLPGrpcApi extends BaseIndexerGrpcConsumer {
  protected module: string = IndexerErrorModule.OLP

  private get client() {
    return this.initClient(InjectiveDmmV2Client)
  }

  async fetchEpochs(status?: string, options?: GrpcCallOptions) {
    const request = DmmPb.GetEpochsRequest.create()

    if (status) {
      request.status = status
    }

    const response = await this.executeGrpcCall<
      DmmPb.GetEpochsRequest,
      DmmPb.GetEpochsResponse
    >(request, this.client.getEpochs.bind(this.client), options?.signal)

    return DmmGrpcTransformer.epochsResponseToEpochs(response)
  }

  async fetchMarketRewards(epochId: string, options?: GrpcCallOptions) {
    const request = DmmPb.GetMarketRewardsRequest.create()

    request.epochId = epochId.toString()

    const response = await this.executeGrpcCall<
      DmmPb.GetMarketRewardsRequest,
      DmmPb.GetMarketRewardsResponse
    >(request, this.client.getMarketRewards.bind(this.client), options?.signal)

    return DmmGrpcTransformer.marketRewardsResponseToMarketRewards(response)
  }

  async fetchEligibleAddresses(
    {
      epochId,
      page,
    }: {
      epochId: string
      page?: DmmPb.Pagination
    },
    options?: GrpcCallOptions,
  ) {
    const request = DmmPb.GetEligibleAddressesRequest.create()
    request.epochId = epochId

    if (page) {
      request.page = page
    }

    const response = await this.executeGrpcCall<
      DmmPb.GetEligibleAddressesRequest,
      DmmPb.GetEligibleAddressesResponse
    >(
      request,
      this.client.getEligibleAddresses.bind(this.client),
      options?.signal,
    )

    return DmmGrpcTransformer.eligibleAddressesResponseToEligibleAddresses(
      response,
    )
  }

  async fetchEpochScores(
    {
      epochId,
      page,
    }: {
      epochId: string
      page?: DmmPb.Pagination
    },
    options?: GrpcCallOptions,
  ) {
    const request = DmmPb.GetEpochScoresRequest.create()

    request.epochId = epochId

    if (page) {
      request.page = page
    }

    const response = await this.executeGrpcCall<
      DmmPb.GetEpochScoresRequest,
      DmmPb.GetEpochScoresResponse
    >(request, this.client.getEpochScores.bind(this.client), options?.signal)

    return DmmGrpcTransformer.epochScoresResponseToEpochScores(response)
  }

  async fetchEpochScoresHistory(
    {
      epochId,
      accountAddress,
      page,
    }: {
      epochId: string
      accountAddress: string
      page?: DmmPb.Pagination
    },
    options?: GrpcCallOptions,
  ) {
    const request = DmmPb.GetEpochScoresHistoryRequest.create()

    request.epochId = epochId
    request.accountAddress = accountAddress

    if (page) {
      request.page = page
    }

    const response = await this.executeGrpcCall<
      DmmPb.GetEpochScoresHistoryRequest,
      DmmPb.GetEpochScoresHistoryResponse
    >(
      request,
      this.client.getEpochScoresHistory.bind(this.client),
      options?.signal,
    )

    return DmmGrpcTransformer.epochScoresHistoryResponseToEpochScoresHistory(
      response,
    )
  }

  async fetchTotalScores(
    {
      epochId,
      marketId,
      page,
    }: {
      epochId: string
      marketId: string
      page?: DmmPb.Pagination
    },
    options?: GrpcCallOptions,
  ) {
    const request = DmmPb.GetTotalScoresRequest.create()

    request.epochId = epochId
    request.marketId = marketId

    if (page) {
      request.page = page
    }

    const response = await this.executeGrpcCall<
      DmmPb.GetTotalScoresRequest,
      DmmPb.GetTotalScoresResponse
    >(request, this.client.getTotalScores.bind(this.client), options?.signal)

    return DmmGrpcTransformer.totalScoresResponseToTotalScores(response)
  }

  async fetchTotalScoresHistory(
    {
      epochId,
      marketId,
      accountAddress,
      page,
    }: {
      epochId: string
      marketId: string
      accountAddress: string
      page?: DmmPb.Pagination
    },
    options?: GrpcCallOptions,
  ) {
    const request = DmmPb.GetTotalScoresHistoryRequest.create()

    request.epochId = epochId
    request.marketId = marketId
    request.accountAddress = accountAddress

    if (page) {
      request.page = page
    }

    const response = await this.executeGrpcCall<
      DmmPb.GetTotalScoresHistoryRequest,
      DmmPb.GetTotalScoresHistoryResponse
    >(
      request,
      this.client.getTotalScoresHistory.bind(this.client),
      options?.signal,
    )

    return DmmGrpcTransformer.totalScoresHistoryResponseToTotalScoresHistory(
      response,
    )
  }

  async fetchRewardsDistribution(
    {
      epochId,
      height,
      page,
    }: {
      epochId: string
      height?: string
      page?: DmmPb.Pagination
    },
    options?: GrpcCallOptions,
  ) {
    const request = DmmPb.GetRewardsDistributionRequest.create()

    request.epochId = epochId

    if (height) {
      request.height = BigInt(height)
    }

    if (page) {
      request.page = page
    }

    const response = await this.executeGrpcCall<
      DmmPb.GetRewardsDistributionRequest,
      DmmPb.GetRewardsDistributionResponse
    >(
      request,
      this.client.getRewardsDistribution.bind(this.client),
      options?.signal,
    )

    return DmmGrpcTransformer.rewardsDistributionResponseToRewardsDistribution(
      response,
    )
  }

  async fetchAccountVolumes(
    {
      epochId,
      accountAddress,
    }: {
      epochId: string
      accountAddress: string
    },
    options?: GrpcCallOptions,
  ) {
    const request = DmmPb.GetAccountVolumesRequest.create()

    request.epochId = epochId
    request.accountAddress = accountAddress

    const response = await this.executeGrpcCall<
      DmmPb.GetAccountVolumesRequest,
      DmmPb.GetAccountVolumesResponse
    >(request, this.client.getAccountVolumes.bind(this.client), options?.signal)

    return DmmGrpcTransformer.accountVolumesResponseToAccountVolumes(response)
  }

  async fetchRewardsEligibility(
    {
      epochId,
      accountAddress,
    }: {
      epochId?: string
      accountAddress?: string
    },
    options?: GrpcCallOptions,
  ) {
    const request = DmmPb.GetRewardsEligibilityRequest.create()

    if (epochId) {
      request.epochId = epochId
    }

    if (accountAddress) {
      request.accountAddress = accountAddress
    }

    const response = await this.executeGrpcCall<
      DmmPb.GetRewardsEligibilityRequest,
      DmmPb.GetRewardsEligibilityResponse
    >(
      request,
      this.client.getRewardsEligibility.bind(this.client),
      options?.signal,
    )

    return DmmGrpcTransformer.rewardsEligibilityResponseToRewardsEligibility(
      response,
    )
  }

  async fetchMarketRewardsRange(
    {
      epochId,
      marketId,
    }: {
      epochId: string
      marketId?: string
    },
    options?: GrpcCallOptions,
  ) {
    const request = DmmPb.GetMarketRewardsRangeRequest.create()

    request.epochId = epochId
    request.marketId = marketId

    const response = await this.executeGrpcCall<
      DmmPb.GetMarketRewardsRangeRequest,
      DmmPb.GetMarketRewardsRangeResponse
    >(
      request,
      this.client.getMarketRewardsRange.bind(this.client),
      options?.signal,
    )

    return DmmGrpcTransformer.marketRewardsRangeResponseToMarketRewardsRange(
      response,
    )
  }
}
