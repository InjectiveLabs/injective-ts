import type { InjectiveArchiverRpcPb } from '@injectivelabs/indexer-proto-ts-v2'

export interface HistoricalBalance {
  t: number[]
  v: number[]
}

export interface HistoricalRPNL {
  t: number[]
  v: number[]
}

export interface HistoricalVolumes {
  t: number[]
  v: number[]
}

export interface LeaderboardRow {
  account: string
  pnl: number
  volume: number
  rank: number
}

export interface PnlLeaderboard {
  firstDate: string
  lastDate: string
  leaders: LeaderboardRow[]
  accountRow: LeaderboardRow | undefined
}

export interface VolLeaderboard {
  firstDate: string
  lastDate: string
  leaders: LeaderboardRow[]
  accountRow: LeaderboardRow | undefined
}

export interface Holder {
  accountAddress: string
  balance: string
}

export interface DenomHolders {
  holders: Holder[]
  next: string[]
  total: number
}

export interface AccountStats {
  pnl: number
  volume: number
}

export interface SpotAverageEntry {
  marketId: string
  averageEntryPrice: string
  quantity: string
  usdValue: string
}

export type GrpcHistoricalRPNL = InjectiveArchiverRpcPb.HistoricalRPNL
export type GrpcLeaderboardRow = InjectiveArchiverRpcPb.LeaderboardRow
export type GrpcDenomHolders = InjectiveArchiverRpcPb.DenomHoldersResponse
export type GrpcSpotAverageEntry = InjectiveArchiverRpcPb.SpotAverageEntry
export type GrpcHistoricalBalance = InjectiveArchiverRpcPb.HistoricalBalance
export type GrpcHistoricalVolumes = InjectiveArchiverRpcPb.HistoricalVolumes
export type GrpcPnlLeaderboard =
  | InjectiveArchiverRpcPb.PnlLeaderboardResponse
  | InjectiveArchiverRpcPb.PnlLeaderboardFixedResolutionResponse
export type GrpcVolLeaderboard =
  | InjectiveArchiverRpcPb.VolLeaderboardResponse
  | InjectiveArchiverRpcPb.VolLeaderboardFixedResolutionResponse
