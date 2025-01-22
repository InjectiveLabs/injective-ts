import { InjectiveArchiverRpc } from '@injectivelabs/indexer-proto-ts'

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

export type GrpcHistoricalRPNL = InjectiveArchiverRpc.HistoricalRPNL
export type GrpcHistoricalBalance = InjectiveArchiverRpc.HistoricalBalance
export type GrpcHistoricalVolumes = InjectiveArchiverRpc.HistoricalVolumes
export type GrpcPnlLeaderboard =
  | InjectiveArchiverRpc.PnlLeaderboardResponse
  | InjectiveArchiverRpc.PnlLeaderboardFixedResolutionResponse
export type GrpcVolLeaderboard =
  | InjectiveArchiverRpc.VolLeaderboardResponse
  | InjectiveArchiverRpc.VolLeaderboardFixedResolutionResponse
export type GrpcLeaderboardRow = InjectiveArchiverRpc.LeaderboardRow
export type GrpcDenomHolders = InjectiveArchiverRpc.DenomHoldersResponse
