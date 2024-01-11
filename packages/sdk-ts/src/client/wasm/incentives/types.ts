import { Coin } from '@injectivelabs/ts-types'

export interface QueryRoundResponse {
  id: number
  name: string
  end_date: number
  start_date: number
  campaigns: string[]
}

export interface QueryCampaignResponse {
  id: number
  name: string
  rewards: Coin[]
  in_round: number
  market_id: string
  is_funded: boolean
  description: string
  total_rewards: string
  is_finalized: boolean
  subaccount_id_suffix: string
}
