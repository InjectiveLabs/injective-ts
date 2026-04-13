import type { Coin } from '@injectivelabs/ts-types'
import type * as InjectiveCampaignRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_campaign_rpc_pb'

export interface Campaign {
  campaignId: string
  marketId: string
  totalScore: string
  lastUpdated: number
  startDate: number
  endDate: number
  isClaimable: boolean
  rewards: Coin[]
  roundId: number
  userClaimed: boolean
  userScore: string
  rewardContract: string
  version: string
}

export interface CampaignUser {
  campaignId: string
  marketId: string
  accountAddress: string
  score: string
  contractUpdated: boolean
  blockHeight: string
  blockTime: number
  purchasedAmount: string
  galxeUpdated: boolean
}

export interface Guild {
  campaignContract: string
  guildId: string
  masterAddress: string
  createdAt: number
  tvlScore: string
  volumeScore: string
  rankByVolume: number
  rankByTvl: number
  logo: string
  totalTvl: string
  updatedAt: number
  name: string
  isActive: boolean
  description: string
  masterBalance: string
}

export interface GuildMember {
  campaignContract: string
  guildId: string
  address: string
  joinedAt: number
  tvlScore: string
  volumeScore: string
  totalTvl: string
  volumeScorePercentage: number
  tvlScorePercentage: number
  tvlReward: Coin[]
  volumeReward: Coin[]
}

export interface GuildCampaignSummary {
  campaignId: string
  campaignContract: string
  totalGuildsCount: number
  totalTvl: string
  totalAverageTvl: string
  totalVolume: string
  updatedAt: number
  totalMembersCount: number
  startTime: number
  endTime: number
}

export interface CampaignV2 {
  campaignId: string
  marketId: string
  totalScore: string
  createdAt: number
  updatedAt: number
  startDate: number
  endDate: number
  isClaimable: boolean
  roundId: number
  managerContract: string
  rewards: Coin[]
  subaccountIdSuffix: string
  rewardContract: string
  type: string
  version: string
  name: string
  description: string
}

export type GrpcGuild = InjectiveCampaignRpcPb.Guild
export type GrpcCampaign = InjectiveCampaignRpcPb.Campaign
export type GrpcGuildMember = InjectiveCampaignRpcPb.GuildMember
export type GrpcCampaignUser = InjectiveCampaignRpcPb.CampaignUser
export type GrpcCampaignV2 = InjectiveCampaignRpcPb.CampaignV2
