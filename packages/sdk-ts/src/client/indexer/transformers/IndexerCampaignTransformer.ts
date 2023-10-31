import { InjectiveCampaignRpc } from '@injectivelabs/indexer-proto-ts'
import { grpcPagingToPaging } from '../../..//utils/pagination'
import { Campaign, CampaignUser } from '../types/campaign'

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
}
