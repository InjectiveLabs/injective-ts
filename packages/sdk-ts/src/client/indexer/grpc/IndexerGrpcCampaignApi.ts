import {
  UnspecifiedErrorCode,
  grpcErrorCodeToErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { InjectiveMetaRpc } from '@injectivelabs/indexer-proto-ts'
import { InjectiveCampaignRpc } from '@injectivelabs/indexer-proto-ts'
import BaseGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import { IndexerCampaignTransformer } from '../transformers/index.js'
import { IndexerModule } from '../types/index.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcCampaignApi extends BaseGrpcConsumer {
  protected module: string = IndexerModule.Campaign

  protected client: InjectiveCampaignRpc.InjectiveCampaignRPCClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new InjectiveCampaignRpc.InjectiveCampaignRPCClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
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
    const request = InjectiveCampaignRpc.RankingRequest.create()

    request.campaignId = campaignId
    if (skip) {
      request.skip = skip
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

    try {
      const response = await this.retry<InjectiveCampaignRpc.RankingResponse>(
        () => this.client.Ranking(request),
      )

      return IndexerCampaignTransformer.CampaignResponseToCampaign(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'FetchCampaign',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'FetchCampaign',
        contextModule: this.module,
      })
    }
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
    const request = InjectiveCampaignRpc.CampaignsV2Request.create()

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

    try {
      const response =
        await this.retry<InjectiveCampaignRpc.CampaignsV2Response>(() =>
          this.client.CampaignsV2(request),
        )

      return IndexerCampaignTransformer.CampaignsV2ResponseToCampaigns(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'FetchCampaigns',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'FetchCampaigns',
        contextModule: this.module,
      })
    }
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
    const request = InjectiveCampaignRpc.CampaignsRequest.create()

    if (roundId) {
      request.roundId = roundId
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

    try {
      const response = await this.retry<InjectiveCampaignRpc.CampaignsResponse>(
        () => this.client.Campaigns(request),
      )

      return IndexerCampaignTransformer.RoundsResponseToRounds(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveCampaignRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'Campaigns',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Campaigns',
        contextModule: this.module,
      })
    }
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
    const request = InjectiveCampaignRpc.ListGuildsRequest.create()

    request.sortBy = sortBy
    request.campaignContract = campaignContract

    if (skip) {
      request.skip = skip
    }

    if (limit) {
      request.limit = limit
    }

    try {
      const response =
        await this.retry<InjectiveCampaignRpc.ListGuildsResponse>(() =>
          this.client.ListGuilds(request),
        )

      return IndexerCampaignTransformer.GuildsResponseToGuilds(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'FetchGuilds',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'FetchGuilds',
        contextModule: this.module,
      })
    }
  }

  async fetchGuildMember({
    address,
    campaignContract,
  }: {
    address: string
    campaignContract: string
  }) {
    const request = InjectiveCampaignRpc.GetGuildMemberRequest.create()

    request.address = address
    request.campaignContract = campaignContract

    try {
      const response =
        await this.retry<InjectiveCampaignRpc.GetGuildMemberResponse>(() =>
          this.client.GetGuildMember(request),
        )

      return IndexerCampaignTransformer.GuildMemberResponseToGuildMember(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'FetchGuildMember',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'FetchGuildMember',
        contextModule: this.module,
      })
    }
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
    const request = InjectiveCampaignRpc.ListGuildMembersRequest.create()

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

    try {
      const response =
        await this.retry<InjectiveCampaignRpc.ListGuildMembersResponse>(() =>
          this.client.ListGuildMembers(request),
        )

      return IndexerCampaignTransformer.GuildMembersResponseToGuildMembers(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'FetchGuildMembers',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'FetchGuildMembers',
        contextModule: this.module,
      })
    }
  }
}
