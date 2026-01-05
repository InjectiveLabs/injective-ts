import * as InjectiveCampaignRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_campaign_rpc_pb'
import { InjectiveCampaignRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_campaign_rpc_pb.client'
import { IndexerModule } from '../types/index.js'
import { IndexerCampaignTransformer } from '../transformers/index.js'
import BaseIndexerGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import type { GrpcWebTransportAdditionalOptions } from '../../../utils/grpc.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcCampaignApi extends BaseIndexerGrpcConsumer {
  protected module: string = IndexerModule.Campaign

  private client: InjectiveCampaignRPCClient

  constructor(endpoint: string, options?: GrpcWebTransportAdditionalOptions) {
    super(endpoint, options)

    this.client = new InjectiveCampaignRPCClient(this.transport)
  }

  async fetchCampaign({
    skip,
    limit,
    marketId,
    campaignId,
    accountAddress,
    contractAddress,
  }: {
    skip?: string
    limit?: number
    marketId?: string
    campaignId: string
    accountAddress?: string
    contractAddress?: string
  }) {
    const request = InjectiveCampaignRpcPb.RankingRequest.create()

    request.campaignId = campaignId
    if (skip) {
      request.skip = BigInt(skip)
    }

    if (limit) {
      request.limit = limit
    }

    if (marketId) {
      request.marketId = marketId
    }

    if (accountAddress) {
      request.accountAddress = accountAddress
    }

    if (contractAddress) {
      request.contractAddress = contractAddress
    }

    const response = await this.executeGrpcCall<
      InjectiveCampaignRpcPb.RankingRequest,
      InjectiveCampaignRpcPb.RankingResponse
    >(request, this.client.ranking.bind(this.client))

    return IndexerCampaignTransformer.CampaignResponseToCampaign(response)
  }

  async fetchCampaigns({
    type,
    active,
    limit,
    cursor,
    status,
  }: {
    type?: string
    active?: boolean
    limit?: number
    cursor?: string
    status?: string
  }) {
    const request = InjectiveCampaignRpcPb.CampaignsV2Request.create()

    if (type) {
      request.type = type
    }

    if (active) {
      request.active = active
    }

    if (limit) {
      request.limit = limit
    }

    if (cursor) {
      request.cursor = cursor
    }

    if (status) {
      request.status = status
    }

    const response = await this.executeGrpcCall<
      InjectiveCampaignRpcPb.CampaignsV2Request,
      InjectiveCampaignRpcPb.CampaignsV2Response
    >(request, this.client.campaignsV2.bind(this.client))

    return IndexerCampaignTransformer.CampaignsV2ResponseToCampaigns(response)
  }

  async fetchRound({
    roundId,
    toRoundId,
    accountAddress,
    contractAddress,
  }: {
    roundId?: string
    toRoundId?: number
    accountAddress?: string
    contractAddress?: string
  }) {
    const request = InjectiveCampaignRpcPb.CampaignsRequest.create()

    if (roundId) {
      request.roundId = BigInt(roundId)
    }

    if (accountAddress) {
      request.accountAddress = accountAddress
    }

    if (toRoundId) {
      request.toRoundId = toRoundId
    }

    if (contractAddress) {
      request.contractAddress = contractAddress
    }

    const response = await this.executeGrpcCall<
      InjectiveCampaignRpcPb.CampaignsRequest,
      InjectiveCampaignRpcPb.CampaignsResponse
    >(request, this.client.campaigns.bind(this.client))

    return IndexerCampaignTransformer.RoundsResponseToRounds(response)
  }

  async fetchGuilds({
    skip,
    limit,
    sortBy,
    campaignContract,
  }: {
    skip?: number
    limit?: number
    sortBy: string
    campaignContract: string
  }) {
    const request = InjectiveCampaignRpcPb.ListGuildsRequest.create()

    request.sortBy = sortBy
    request.campaignContract = campaignContract

    if (skip) {
      request.skip = skip
    }

    if (limit) {
      request.limit = limit
    }

    const response = await this.executeGrpcCall<
      InjectiveCampaignRpcPb.ListGuildsRequest,
      InjectiveCampaignRpcPb.ListGuildsResponse
    >(request, this.client.listGuilds.bind(this.client))

    return IndexerCampaignTransformer.GuildsResponseToGuilds(response)
  }

  async fetchGuildMember({
    address,
    campaignContract,
  }: {
    address: string
    campaignContract: string
  }) {
    const request = InjectiveCampaignRpcPb.GetGuildMemberRequest.create()

    request.address = address
    request.campaignContract = campaignContract

    const response = await this.executeGrpcCall<
      InjectiveCampaignRpcPb.GetGuildMemberRequest,
      InjectiveCampaignRpcPb.GetGuildMemberResponse
    >(request, this.client.getGuildMember.bind(this.client))

    return IndexerCampaignTransformer.GuildMemberResponseToGuildMember(response)
  }

  async fetchGuildMembers({
    skip,
    limit,
    sortBy,
    guildId,
    campaignContract,
    includeGuildInfo,
  }: {
    skip?: number
    limit?: number
    sortBy?: string
    guildId: string
    campaignContract: string
    includeGuildInfo: boolean
  }) {
    const request = InjectiveCampaignRpcPb.ListGuildMembersRequest.create()

    request.guildId = guildId
    request.campaignContract = campaignContract
    request.includeGuildInfo = includeGuildInfo

    if (sortBy) {
      request.sortBy = sortBy
    }

    if (skip) {
      request.skip = skip
    }

    if (limit) {
      request.limit = limit
    }

    const response = await this.executeGrpcCall<
      InjectiveCampaignRpcPb.ListGuildMembersRequest,
      InjectiveCampaignRpcPb.ListGuildMembersResponse
    >(request, this.client.listGuildMembers.bind(this.client))

    return IndexerCampaignTransformer.GuildMembersResponseToGuildMembers(
      response,
    )
  }
}
