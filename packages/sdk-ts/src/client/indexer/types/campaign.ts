import { InjectiveCampaignRpc } from '@injectivelabs/indexer-proto-ts'

export interface Campaign {
  campaignId: string
  marketId: string
  totalScore: string
  lastUpdated: number
  startDate: number
  endDate: number
  isClaimable: boolean
}

export interface CampaignUser {
  campaignId: string
  marketId: string
  accountAddress: string
  score: string
  contractUpdated: boolean
  blockHeight: string
  blockTime: number
}

export type GrpcCampaign = InjectiveCampaignRpc.Campaign
export type GrpcCampaignUser = InjectiveCampaignRpc.CampaignUser
