import { QueryRoundResponse, QueryCampaignResponse } from './types.js'
import { WasmContractQueryResponse } from '../types.js'
import { toUtf8 } from '../../../utils/index.js'

export class IncentivesQueryTransformer {
  static contractRoundResponseToContractRound(
    response: WasmContractQueryResponse,
  ) {
    const data = JSON.parse(toUtf8(response.data)) as QueryRoundResponse[]

    return data.map((round: QueryRoundResponse) => ({
      id: round.id,
      name: round.name,
      endDate: round.end_date,
      campaigns: round.campaigns,
      startDate: round.start_date,
    }))
  }

  static contractCampaignResponseToContractCampaign(
    response: WasmContractQueryResponse,
  ) {
    const data = JSON.parse(toUtf8(response.data)) as QueryCampaignResponse[]

    return data.map((campaign: QueryCampaignResponse) => ({
      id: campaign.id,
      name: campaign.name,
      rewards: campaign.rewards,
      inRound: campaign.in_round,
      marketId: campaign.market_id,
      isFunded: campaign.is_funded,
      description: campaign.description,
      isFinalized: campaign.is_finalized,
      totalRewards: campaign.total_rewards,
      subaccountIdSuffix: campaign.subaccount_id_suffix,
    }))
  }
}
