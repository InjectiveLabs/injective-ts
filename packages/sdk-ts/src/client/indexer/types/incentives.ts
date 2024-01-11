import { Coin } from '@injectivelabs/ts-types'

export interface IncentivesRound {
  id: number
  name: string
  endDate: number
  startDate: number
  campaigns: string[]
}

export interface IncentivesCampaign {
  id: number
  name: string
  rewards: Coin[]
  inRound: number
  marketId: string
  isFunded: boolean
  description: string
  totalRewards: string
  isFinalized: boolean
  subaccountIdSuffix: string
}
