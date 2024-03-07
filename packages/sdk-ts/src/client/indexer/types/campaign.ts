import { Coin } from '@injectivelabs/ts-types'
import { InjectiveCampaignRpc } from '@injectivelabs/indexer-proto-ts'

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

export type GrpcGuild = InjectiveCampaignRpc.Guild
export type GrpcCampaign = InjectiveCampaignRpc.Campaign
export type GrpcGuildMember = InjectiveCampaignRpc.GuildMember
export type GrpcCampaignUser = InjectiveCampaignRpc.CampaignUser
