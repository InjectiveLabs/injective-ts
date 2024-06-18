import { InjectiveArchiverRPC } from '@injectivelabs/indexer-proto-ts'

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

export type GrpcHistoricalRPNL = InjectiveArchiverRPC.HistoricalRPNL
export type GrpcHistoricalBalance = InjectiveArchiverRPC.HistoricalBalance
export type GrpcHistoricalVolumes = InjectiveArchiverRPC.HistoricalVolumes
