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

export type TotalScoresResponse = InjectiveDmmRpc.GetTotalScoresHistoryResponse

export type TotalScoresHistory = InjectiveDmmRpc.GetTotalScoresHistoryResponse

export type LiquiditySnapshots = InjectiveDmmRpc.GetLiquiditySnapshotsResponse

export type LiquidityScoreSnapshot = InjectiveDmmRpc.LiquidityScoreSnapshot

export type EpochScoresWithPagination =
  | EpochScores
  | EpochScoresHistory
  | TotalScoresResponse
  | TotalScoresHistory
