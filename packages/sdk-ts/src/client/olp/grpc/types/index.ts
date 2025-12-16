import type * as DmmPb from '@injectivelabs/olp-proto-ts-v2/generated/dmm_pb'

export interface DmmPagination {
  from?: number
  height?: number
  perPage?: number
  total?: number
}

export interface EpochsV2 {
  epochs: EpochV2[]
}

export interface TotalScores {
  scores: TotalScore[]
  next?: DmmPagination
}

export interface TotalScoresHistory {
  scores: TotalScore[]
  next?: DmmPagination
}

export interface EpochScores {
  scores: EpochScore[]
  next?: DmmPagination
}

export interface EpochScoresHistory {
  scores: EpochScore[]
  next?: DmmPagination
}

export interface MarketRewards {
  rewards: MarketReward[]
}

export interface EligibleAddresses {
  addresses: EligibleAddress[]
  next?: DmmPagination
}

export interface RewardsDistribution {
  rewards: RewardDistribution[]
  next?: DmmPagination
}

export interface AccountVolumes {
  volumes: AccountVolume[]
}

export interface RewardsEligibility {
  volumes: AccountVolume[]
  currentMakerVolumePercentage: string
  averageDailyMakerVolumePercentage: string
  eligibleForNextEpoch: boolean
  eligibleForCurrentEpoch: boolean
  estimatedReward: string
  updatedAt?: Date
}

export interface EpochV2 {
  epochId: string
  status: string
  startHeight: string
  endHeight: string
  snapshotCount: number
  resultCount: number
  config?: EpochConfigV2
  createdAt?: Date
  updatedAt?: Date
}

export interface Market {
  marketId: string
  ticker: string
  startDate?: Date
  preAllocatedReward?: string
}

export interface EpochConfigV2 {
  startDate?: Date
  endDate?: Date
  rewardInj: string
  markets: Market[]
  liquidityScoreExponent: string
  uptimeExponent: string
  volumeExponent: string
  permanenceVolumeThreshold: string
  qualifyingVolumeThreshold: string
  number: number
  isMiniEpoch: boolean
}

export interface TotalScore {
  epochId: string
  marketId: string
  accountAddress: string
  height: string
  startHeight: string
  blockTime?: Date
  bid: string
  ask: string
  depth: string
  snapshotCount: number
  liquidityScore: string
  liquidityScorePonderated: string
  uptimeScore: string
  uptimeScorePonderated: string
  uptimePercentage: string
  startVolume: string
  currentVolume: string
  volume: string
  volumeScore: string
  volumeScorePonderated: string
  takerStartVolume: string
  takerCurrentVolume: string
  takerVolume: string
  makerStartVolume: string
  makerCurrentVolume: string
  makerVolume: string
  totalScore: string
  reward: string
  rewardPercentage: string
  createdAt?: Date
  updatedAt?: Date
}
export interface EpochScore {
  epochId: string
  accountAddress: string
  height: string
  blockTime?: Date
  startHeight: string
  liquidityScore: string
  liquidityScorePonderated: string
  uptimeScore: string
  uptimeScorePonderated: string
  uptimePercentage: string
  volumeScore: string
  volumeScorePonderated: string
  totalScore: string
  volume: string
  makerVolume: string
  takerVolume: string
  reward: string
  rewardPercentage: string
  qualifies: boolean
  volumePercentage: string
  createdAt?: Date
  updatedAt?: Date
}
export interface MarketReward {
  epochId: string
  marketId: string
  height: string
  reward: string
  rewardPercentage: string
  liquidity: string
  startDate?: Date
  endDate?: Date
  totalScore: string
  createdAt?: Date
  updatedAt?: Date
  miniEpochsReward: string
}
export interface EligibleAddress {
  epochId: string
  accountAddress: string
  height: string
  source: string
  createdAt?: Date
  updatedAt?: Date
}
export interface RewardDistribution {
  epochId: string
  accountAddress: string
  height: string
  startHeight: string
  blockTime?: Date | undefined
  depth: string
  reward: string
  createdAt?: Date
  updatedAt?: Date
}
export interface AccountVolume {
  epochId: string
  accountAddress: string
  height: string
  blockTime?: Date
  date: string
  dateTimestamp?: Date
  volume: string
  takerVolume: string
  makerVolume: string
  volumePercentage: string
  makerVolumePercentage: string
  takerVolumePercentage: string
  dailyVolume: string
  dailyMakerVolume: string
  dailyTakerVolume: string
  dailyVolumePercentage: string
  dailyMakerVolumePercentage: string
  dailyTakerVolumePercentage: string
  dailyQualified: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface MinMaxRewards {
  minRewards: Record<string, string>
  maxRewards: Record<string, string>
}

export type GrpcEpochsV2 = DmmPb.GetEpochsResponse
export type GrpcEpochV2 = DmmPb.EpochV2

export type GrpcEpochConfigV2 = DmmPb.EpochConfigV2

export type GrpcMarketReward = DmmPb.MarketReward

export type GrpcMarketRewards = DmmPb.GetMarketRewardsResponse

export type GrpcDmmPagination = DmmPb.Pagination

export type GrpcEligibleAddresses = DmmPb.GetEligibleAddressesResponse

export type GrpcEligibleAddress = DmmPb.EligibleAddress

export type GrpcEpochScores = DmmPb.GetEpochScoresResponse

export type GrpcEpochScore = DmmPb.EpochScore

export type GrpcEpochScoresHistory = DmmPb.GetEpochScoresHistoryResponse

export type GrpcTotalScores = DmmPb.GetTotalScoresHistoryResponse

export type GrpcTotalScore = DmmPb.TotalScore

export type GrpcTotalScoresHistory = DmmPb.GetTotalScoresHistoryResponse

export type GrpcRewardsDistribution = DmmPb.GetRewardsDistributionResponse

export type GrpcRewardDistribution = DmmPb.RewardDistribution

export type GrpcAccountVolume = DmmPb.AccountVolume

export type GrpcRewardsEligibility = DmmPb.GetRewardsEligibilityResponse
