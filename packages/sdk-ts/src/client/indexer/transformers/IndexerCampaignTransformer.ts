import { InjectiveCampaignRpc } from '@injectivelabs/indexer-proto-ts'
import { grpcPagingToPaging } from '../../..//utils/pagination.js'
import { IndexerCommonTransformer } from './IndexerCommonTransformer.js'
import {
  Guild,
  Campaign,
  CampaignV2,
  GuildMember,
  CampaignUser,
  GuildCampaignSummary,
} from '../types/campaign.js'

export class IndexerCampaignTransformer {
  static GrpcCampaignUserToCampaignUser(
    campaignUser: InjectiveCampaignRpc.CampaignUser,
  ): CampaignUser {
    return {
      campaignId: campaignUser.campaignId,
      marketId: campaignUser.marketId,
      accountAddress: campaignUser.accountAddress,
      score: campaignUser.score,
      contractUpdated: campaignUser.contractUpdated,
      blockHeight: campaignUser.blockHeight,
      blockTime: parseInt(campaignUser.blockTime, 10),
      purchasedAmount: campaignUser.purchasedAmount,
      galxeUpdated: campaignUser.galxeUpdated,
    }
  }

  static GrpcCampaignToCampaign(
    campaign: InjectiveCampaignRpc.Campaign,
  ): Campaign {
    return {
      campaignId: campaign.campaignId,
      marketId: campaign.marketId,
      totalScore: campaign.totalScore,
      lastUpdated: parseInt(campaign.lastUpdated, 10),
      startDate: parseInt(campaign.startDate, 10),
      endDate: parseInt(campaign.endDate, 10),
      isClaimable: campaign.isClaimable,
      rewards: campaign.rewards,
      roundId: campaign.roundId,
      userClaimed: campaign.userClaimed,
      userScore: campaign.userScore,
      rewardContract: campaign.rewardContract,
      version: campaign.version,
    }
  }

  static GrpcGuildToGuild(guild: InjectiveCampaignRpc.Guild): Guild {
    return {
      campaignContract: guild.campaignContract,
      guildId: guild.guildId,
      masterAddress: guild.masterAddress,
      createdAt: parseInt(guild.createdAt, 10),
      tvlScore: guild.tvlScore,
      volumeScore: guild.volumeScore,
      rankByVolume: guild.rankByVolume,
      rankByTvl: guild.rankByTvl,
      logo: guild.logo,
      totalTvl: guild.totalTvl,
      updatedAt: parseInt(guild.updatedAt, 10),
      name: guild.name,
      isActive: guild.isActive,
      masterBalance: guild.masterBalance,
      description: guild.description,
    }
  }

  static GrpcGuildMemberToGuildMember(
    member: InjectiveCampaignRpc.GuildMember,
  ): GuildMember {
    return {
      campaignContract: member.campaignContract,
      guildId: member.guildId,
      address: member.address,
      joinedAt: parseInt(member.joinedAt, 10),
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
    campaignSummary: InjectiveCampaignRpc.CampaignSummary,
  ): GuildCampaignSummary {
    return {
      campaignId: campaignSummary.campaignId,
      campaignContract: campaignSummary.campaignContract,
      totalGuildsCount: campaignSummary.totalGuildsCount,
      totalTvl: campaignSummary.totalTvl,
      totalAverageTvl: campaignSummary.totalAverageTvl,
      totalVolume: campaignSummary.totalVolume,
      updatedAt: parseInt(campaignSummary.updatedAt, 10),
      totalMembersCount: campaignSummary.totalMembersCount,
      startTime: parseInt(campaignSummary.startTime, 10),
      endTime: parseInt(campaignSummary.endTime, 10),
    }
  }

  static CampaignResponseToCampaign(
    response: InjectiveCampaignRpc.RankingResponse,
  ) {
    return {
      campaign: response.campaign
        ? IndexerCampaignTransformer.GrpcCampaignToCampaign(response.campaign)
        : undefined,
      users: response.users.map(
        IndexerCampaignTransformer.GrpcCampaignUserToCampaignUser,
      ),
      paging: grpcPagingToPaging(response.paging),
    }
  }

  static RoundsResponseToRounds(
    response: InjectiveCampaignRpc.CampaignsResponse,
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
    response: InjectiveCampaignRpc.ListGuildsResponse,
  ) {
    return {
      guilds: response.guilds.map(IndexerCampaignTransformer.GrpcGuildToGuild),
      paging: grpcPagingToPaging(response.paging),
      updatedAt: parseInt(response.updatedAt, 10),
      summary: response.campaignSummary
        ? IndexerCampaignTransformer.GrpcGuildCampaignSummaryToGuildCampaignSummary(
            response.campaignSummary,
          )
        : undefined,
    }
  }

  static GuildMemberResponseToGuildMember(
    response: InjectiveCampaignRpc.GetGuildMemberResponse,
  ) {
    return {
      info: response.info
        ? IndexerCampaignTransformer.GrpcGuildMemberToGuildMember(response.info)
        : undefined,
    }
  }

  static GuildMembersResponseToGuildMembers(
    response: InjectiveCampaignRpc.ListGuildMembersResponse,
  ) {
    return {
      members: response.members.map(
        IndexerCampaignTransformer.GrpcGuildMemberToGuildMember,
      ),
      paging: grpcPagingToPaging(response.paging),
      guildInfo: response.guildInfo
        ? IndexerCampaignTransformer.GrpcGuildToGuild(response.guildInfo)
        : undefined,
    }
  }

  static GrpcCampaignV2ToCampaignV2(
    campaign: InjectiveCampaignRpc.CampaignV2,
  ): CampaignV2 {
    return {
      campaignId: campaign.campaignId,
      marketId: campaign.marketId,
      totalScore: campaign.totalScore,
      createdAt: campaign.createdAt,
      updatedAt: campaign.updatedAt,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
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
    response: InjectiveCampaignRpc.CampaignsV2Response,
  ) {
    return {
      campaigns: response.campaigns.map(
        IndexerCampaignTransformer.GrpcCampaignV2ToCampaignV2,
      ),
      cursor: response.cursor,
    }
  }
}
