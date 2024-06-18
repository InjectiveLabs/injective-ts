import { InjectiveDmmRpc } from '@injectivelabs/dmm-proto-ts'

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
  number: number
  startDate?: Date
  endDate?: Date
  rewardInj: string
  markets: Market[]
  liquidityScoreExponent: string
  uptimeExponent: string
  volumeExponent: string
  permanenceVolumeThreshold: string
  qualifyingVolumeThreshold: string
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

export type GrpcEpochsV2 = InjectiveDmmRpc.GetEpochsResponse
export type GrpcEpochV2 = InjectiveDmmRpc.EpochV2

export type GrpcEpochConfigV2 = InjectiveDmmRpc.EpochConfigV2

export type GrpcMarketReward = InjectiveDmmRpc.MarketReward

export type GrpcMarketRewards = InjectiveDmmRpc.GetMarketRewardsResponse

export type GrpcDmmPagination = InjectiveDmmRpc.Pagination

export type GrpcEligibleAddresses = InjectiveDmmRpc.GetEligibleAddressesResponse

export type GrpcEligibleAddress = InjectiveDmmRpc.EligibleAddress

export type GrpcEpochScores = InjectiveDmmRpc.GetEpochScoresResponse

export type GrpcEpochScore = InjectiveDmmRpc.EpochScore

export type GrpcEpochScoresHistory =
  InjectiveDmmRpc.GetEpochScoresHistoryResponse

export type GrpcTotalScores = InjectiveDmmRpc.GetTotalScoresHistoryResponse

export type GrpcTotalScore = InjectiveDmmRpc.TotalScore

export type GrpcTotalScoresHistory =
  InjectiveDmmRpc.GetTotalScoresHistoryResponse

export type GrpcRewardsDistribution =
  InjectiveDmmRpc.GetRewardsDistributionResponse

export type GrpcRewardDistribution = InjectiveDmmRpc.RewardDistribution

export type GrpcAccountVolume = InjectiveDmmRpc.AccountVolume

export type GrpcRewardsEligibility =
  InjectiveDmmRpc.GetRewardsEligibilityResponse
