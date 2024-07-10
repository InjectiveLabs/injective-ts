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

export type GrpcHistoricalRPNL = InjectiveArchiverRpc.HistoricalRPNL
export type GrpcHistoricalBalance = InjectiveArchiverRpc.HistoricalBalance
export type GrpcHistoricalVolumes = InjectiveArchiverRpc.HistoricalVolumes
