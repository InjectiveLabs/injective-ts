import { DmmErrorModule } from '@injectivelabs/exceptions'
import { InjectiveDmmRpc } from '@injectivelabs/dmm-proto-ts'

export const DmmModule = { ...DmmErrorModule }

export type EpochV2 = InjectiveDmmRpc.EpochV2

export type EpochConfigV2 = InjectiveDmmRpc.EpochConfigV2

export type MarketReward = InjectiveDmmRpc.MarketReward

export type DmmPagination = InjectiveDmmRpc.Pagination

export type EligibleAddresses = InjectiveDmmRpc.GetEligibleAddressesResponse

export type ElligibleAddress = InjectiveDmmRpc.EligibleAddress

export type EpochScores = InjectiveDmmRpc.GetEpochScoresResponse

export type EpochScore = InjectiveDmmRpc.EpochScore

export type EpochScoresHistory = InjectiveDmmRpc.GetEpochScoresHistoryResponse

export type TotalScores = InjectiveDmmRpc.GetTotalScoresHistoryResponse

export type TotalScore = InjectiveDmmRpc.TotalScore

export type TotalScoresHistory = InjectiveDmmRpc.GetTotalScoresHistoryResponse

export type LiquiditySnapshots = InjectiveDmmRpc.GetLiquiditySnapshotsResponse

export type LiquidityScoreSnapshot = InjectiveDmmRpc.LiquidityScoreSnapshot

export type RewardsDistribution = InjectiveDmmRpc.GetRewardsDistributionResponse

export type RewardDistribution = InjectiveDmmRpc.RewardDistribution

export type AccountVolume = InjectiveDmmRpc.AccountVolume

export type RewardsEligibility = InjectiveDmmRpc.GetRewardsEligibilityResponse
