import { IndexerErrorModule } from '@injectivelabs/exceptions'
import * as DmmPb from '@injectivelabs/olp-proto-ts-v2/generated/dmm_pb'
import { InjectiveDmmV2RPCClient } from '@injectivelabs/olp-proto-ts-v2/generated/dmm_pb.client'
import { DmmGrpcTransformer } from './transformers/index.js'
import BaseIndexerGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import type { GrpcWebTransportAdditionalOptions } from '../../../utils/grpc.js'

export class OLPGrpcApi extends BaseIndexerGrpcConsumer {
  protected module: string = IndexerErrorModule.OLP

  private client: InjectiveDmmV2RPCClient

  constructor(endpoint: string, options?: GrpcWebTransportAdditionalOptions) {
    super(endpoint, options)

    this.client = new InjectiveDmmV2RPCClient(this.transport)
  }

  async fetchEpochs(status?: string) {
    const request = DmmPb.GetEpochsRequest.create()

    if (status) {
      request.status = status
    }

    const response = await this.executeGrpcCall<
      DmmPb.GetEpochsRequest,
      DmmPb.GetEpochsResponse
    >(request, this.client.getEpochs.bind(this.client))

    return DmmGrpcTransformer.epochsResponseToEpochs(response)
  }

  async fetchMarketRewards(epochId: string) {
    const request = DmmPb.GetMarketRewardsRequest.create()

    request.epochId = epochId.toString()

    const response = await this.executeGrpcCall<
      DmmPb.GetMarketRewardsRequest,
      DmmPb.GetMarketRewardsResponse
    >(request, this.client.getMarketRewards.bind(this.client))

    return DmmGrpcTransformer.marketRewardsResponseToMarketRewards(response)
  }

  async fetchEligibleAddresses({
    epochId,
    page,
  }: {
    epochId: string
    page?: DmmPb.Pagination
  }) {
    const request = DmmPb.GetEligibleAddressesRequest.create()
    request.epochId = epochId

    if (page) {
      request.page = page
    }

    const response = await this.executeGrpcCall<
      DmmPb.GetEligibleAddressesRequest,
      DmmPb.GetEligibleAddressesResponse
    >(request, this.client.getEligibleAddresses.bind(this.client))

    return DmmGrpcTransformer.eligibleAddressesResponseToEligibleAddresses(
      response,
    )
  }

  async fetchEpochScores({
    epochId,
    page,
  }: {
    epochId: string
    page?: DmmPb.Pagination
  }) {
    const request = DmmPb.GetEpochScoresRequest.create()

    request.epochId = epochId

    if (page) {
      request.page = page
    }

    const response = await this.executeGrpcCall<
      DmmPb.GetEpochScoresRequest,
      DmmPb.GetEpochScoresResponse
    >(request, this.client.getEpochScores.bind(this.client))

    return DmmGrpcTransformer.epochScoresResponseToEpochScores(response)
  }

  async fetchEpochScoresHistory({
    epochId,
    accountAddress,
    page,
  }: {
    epochId: string
    accountAddress: string
    page?: DmmPb.Pagination
  }) {
    const request = DmmPb.GetEpochScoresHistoryRequest.create()

    request.epochId = epochId
    request.accountAddress = accountAddress

    if (page) {
      request.page = page
    }

    const response = await this.executeGrpcCall<
      DmmPb.GetEpochScoresHistoryRequest,
      DmmPb.GetEpochScoresHistoryResponse
    >(request, this.client.getEpochScoresHistory.bind(this.client))

    return DmmGrpcTransformer.epochScoresHistoryResponseToEpochScoresHistory(
      response,
    )
  }

  async fetchTotalScores({
    epochId,
    marketId,
    page,
  }: {
    epochId: string
    marketId: string
    page?: DmmPb.Pagination
  }) {
    const request = DmmPb.GetTotalScoresRequest.create()

    request.epochId = epochId
    request.marketId = marketId

    if (page) {
      request.page = page
    }

    const response = await this.executeGrpcCall<
      DmmPb.GetTotalScoresRequest,
      DmmPb.GetTotalScoresResponse
    >(request, this.client.getTotalScores.bind(this.client))

    return DmmGrpcTransformer.totalScoresResponseToTotalScores(response)
  }

  async fetchTotalScoresHistory({
    epochId,
    marketId,
    accountAddress,
    page,
  }: {
    epochId: string
    marketId: string
    accountAddress: string
    page?: DmmPb.Pagination
  }) {
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
    >(request, this.client.getTotalScoresHistory.bind(this.client))

    return DmmGrpcTransformer.totalScoresHistoryResponseToTotalScoresHistory(
      response,
    )
  }

  async fetchRewardsDistribution({
    epochId,
    height,
    page,
  }: {
    epochId: string
    height?: string
    page?: DmmPb.Pagination
  }) {
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
    >(request, this.client.getRewardsDistribution.bind(this.client))

    return DmmGrpcTransformer.rewardsDistributionResponseToRewardsDistribution(
      response,
    )
  }

  async fetchAccountVolumes({
    epochId,
    accountAddress,
  }: {
    epochId: string
    accountAddress: string
  }) {
    const request = DmmPb.GetAccountVolumesRequest.create()

    request.epochId = epochId
    request.accountAddress = accountAddress

    const response = await this.executeGrpcCall<
      DmmPb.GetAccountVolumesRequest,
      DmmPb.GetAccountVolumesResponse
    >(request, this.client.getAccountVolumes.bind(this.client))

    return DmmGrpcTransformer.accountVolumesResponseToAccountVolumes(response)
  }

  async fetchRewardsEligibility({
    epochId,
    accountAddress,
  }: {
    epochId?: string
    accountAddress?: string
  }) {
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
    >(request, this.client.getRewardsEligibility.bind(this.client))

    return DmmGrpcTransformer.rewardsEligibilityResponseToRewardsEligibility(
      response,
    )
  }

  async fetchMarketRewardsRange({
    epochId,
    marketId,
  }: {
    epochId: string
    marketId?: string
  }) {
    const request = DmmPb.GetMarketRewardsRangeRequest.create()

    request.epochId = epochId
    request.marketId = marketId

    const response = await this.executeGrpcCall<
      DmmPb.GetMarketRewardsRangeRequest,
      DmmPb.GetMarketRewardsRangeResponse
    >(request, this.client.getMarketRewardRanges.bind(this.client))

    return DmmGrpcTransformer.marketRewardsRangeResponseToMarketRewardsRange(
      response,
    )
  }
}
