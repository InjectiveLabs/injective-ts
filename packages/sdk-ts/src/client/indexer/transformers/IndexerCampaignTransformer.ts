import { grpcPagingToPagingV2 } from '../../..//utils/pagination.js'
import { IndexerCommonTransformer } from './IndexerCommonTransformer.js'
import type * as InjectiveCampaignRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_campaign_rpc_pb'
import type {
  Guild,
  Campaign,
  CampaignV2,
  GuildMember,
  CampaignUser,
  GuildCampaignSummary,
} from '../types/campaign.js'

export class IndexerCampaignTransformer {
  static GrpcCampaignUserToCampaignUser(
    campaignUser: InjectiveCampaignRpcPb.CampaignUser,
  ): CampaignUser {
    return {
      campaignId: campaignUser.campaignId,
      marketId: campaignUser.marketId,
      accountAddress: campaignUser.accountAddress,
      score: campaignUser.score,
      contractUpdated: campaignUser.contractUpdated,
      blockHeight: campaignUser.blockHeight.toString(),
      blockTime: Number(campaignUser.blockTime),
      purchasedAmount: campaignUser.purchasedAmount,
      galxeUpdated: campaignUser.galxeUpdated,
    }
  }

  static GrpcCampaignToCampaign(
    campaign: InjectiveCampaignRpcPb.Campaign,
  ): Campaign {
    return {
      campaignId: campaign.campaignId,
      marketId: campaign.marketId,
      totalScore: campaign.totalScore,
      lastUpdated: Number(campaign.lastUpdated),
      startDate: Number(campaign.startDate),
      endDate: Number(campaign.endDate),
      isClaimable: campaign.isClaimable,
      rewards: campaign.rewards,
      roundId: campaign.roundId,
      userClaimed: campaign.userClaimed,
      userScore: campaign.userScore,
      rewardContract: campaign.rewardContract,
      version: campaign.version,
    }
  }

  static GrpcGuildToGuild(guild: InjectiveCampaignRpcPb.Guild): Guild {
    return {
      campaignContract: guild.campaignContract,
      guildId: guild.guildId,
      masterAddress: guild.masterAddress,
      createdAt: Number(guild.createdAt),
      tvlScore: guild.tvlScore,
      volumeScore: guild.volumeScore,
      rankByVolume: guild.rankByVolume,
      rankByTvl: guild.rankByTvl,
      logo: guild.logo,
      totalTvl: guild.totalTvl,
      updatedAt: Number(guild.updatedAt),
      name: guild.name,
      isActive: guild.isActive,
      masterBalance: guild.masterBalance,
      description: guild.description,
    }
  }

  static GrpcGuildMemberToGuildMember(
    member: InjectiveCampaignRpcPb.GuildMember,
  ): GuildMember {
    return {
      campaignContract: member.campaignContract,
      guildId: member.guildId,
      address: member.address,
      joinedAt: Number(member.joinedAt),
      tvlScore: member.tvlScore,
      volumeScore: member.volumeScore,
      totalTvl: member.totalTvl,
      volumeScorePercentage: member.volumeScorePercentage,
      tvlScorePercentage: member.tvlScorePercentage,
      tvlReward: member.tvlReward.map(IndexerCommonTransformer.grpcCoinToCoin),
      volumeReward: member.volumeReward.map(
        IndexerCommonTransformer.grpcCoinToCoin,
      ),
    }
  }

  static GrpcGuildCampaignSummaryToGuildCampaignSummary(
    campaignSummary: InjectiveCampaignRpcPb.CampaignSummary,
  ): GuildCampaignSummary {
    return {
      campaignId: campaignSummary.campaignId,
      campaignContract: campaignSummary.campaignContract,
      totalGuildsCount: campaignSummary.totalGuildsCount,
      totalTvl: campaignSummary.totalTvl,
      totalAverageTvl: campaignSummary.totalAverageTvl,
      totalVolume: campaignSummary.totalVolume,
      updatedAt: Number(campaignSummary.updatedAt),
      totalMembersCount: campaignSummary.totalMembersCount,
      startTime: Number(campaignSummary.startTime),
      endTime: Number(campaignSummary.endTime),
    }
  }

  static CampaignResponseToCampaign(
    response: InjectiveCampaignRpcPb.RankingResponse,
  ) {
    return {
      campaign: response.campaign
        ? IndexerCampaignTransformer.GrpcCampaignToCampaign(response.campaign)
        : undefined,
      users: response.users.map(
        IndexerCampaignTransformer.GrpcCampaignUserToCampaignUser,
      ),
      paging: grpcPagingToPagingV2(response.paging),
    }
  }

  static RoundsResponseToRounds(
    response: InjectiveCampaignRpcPb.CampaignsResponse,
  ) {
    return {
      campaigns: response.campaigns.map((campaign) =>
        IndexerCampaignTransformer.GrpcCampaignToCampaign(campaign),
      ),
      accumulatedRewards: response.accumulatedRewards,
      rewardCount: response.rewardCount,
    }
  }

  static GuildsResponseToGuilds(
    response: InjectiveCampaignRpcPb.ListGuildsResponse,
  ) {
    return {
      guilds: response.guilds.map(IndexerCampaignTransformer.GrpcGuildToGuild),
      paging: grpcPagingToPagingV2(response.paging),
      updatedAt: Number(response.updatedAt),
      summary: response.campaignSummary
        ? IndexerCampaignTransformer.GrpcGuildCampaignSummaryToGuildCampaignSummary(
            response.campaignSummary,
          )
        : undefined,
    }
  }

  static GuildMemberResponseToGuildMember(
    response: InjectiveCampaignRpcPb.GetGuildMemberResponse,
  ) {
    return {
      info: response.info
        ? IndexerCampaignTransformer.GrpcGuildMemberToGuildMember(response.info)
        : undefined,
    }
  }

  static GuildMembersResponseToGuildMembers(
    response: InjectiveCampaignRpcPb.ListGuildMembersResponse,
  ) {
    return {
      members: response.members.map(
        IndexerCampaignTransformer.GrpcGuildMemberToGuildMember,
      ),
      paging: grpcPagingToPagingV2(response.paging),
      guildInfo: response.guildInfo
        ? IndexerCampaignTransformer.GrpcGuildToGuild(response.guildInfo)
        : undefined,
    }
  }

  static GrpcCampaignV2ToCampaignV2(
    campaign: InjectiveCampaignRpcPb.CampaignV2,
  ): CampaignV2 {
    return {
      campaignId: campaign.campaignId,
      marketId: campaign.marketId,
      totalScore: campaign.totalScore,
      createdAt: Number(campaign.createdAt),
      updatedAt: Number(campaign.updatedAt),
      startDate: Number(campaign.startDate),
      endDate: Number(campaign.endDate),
      isClaimable: campaign.isClaimable,
      roundId: campaign.roundId,
      managerContract: campaign.managerContract,
      rewards: campaign.rewards.map(IndexerCommonTransformer.grpcCoinToCoin),
      subaccountIdSuffix: campaign.subaccountIdSuffix,
      rewardContract: campaign.rewardContract,
      type: campaign.type,
      version: campaign.version,
      name: campaign.name,
      description: campaign.description,
    }
  }

  static CampaignsV2ResponseToCampaigns(
    response: InjectiveCampaignRpcPb.CampaignsV2Response,
  ) {
    return {
      campaigns: response.campaigns.map(
        IndexerCampaignTransformer.GrpcCampaignV2ToCampaignV2,
      ),
      cursor: response.cursor,
    }
  }
}
