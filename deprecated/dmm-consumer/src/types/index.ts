import {
  LCS as GrpcLCS,
  VCS as GrpcVCS,
  Epoch as GrpcEpoch,
  EpochMeta as GrpcEpochMeta,
  EpochResultRecord as GrpcEpochResultRecord,
  LCSResultRecord as GrpcLCSResultRecord,
  MarketConfig as GrpcMarketConfig,
  OrderValueMultiplier as GrpcOrderValueMultiplier,
  VCSResultRecord as GrpcVCSResultRecord,
} from '@injectivelabs/dmm-api/injective_dmm_rpc_pb'

export interface OrderValueMultiplier {
  orderPriceBiasThreshold: string
  multiplier: string
}

export interface MarketConfig {
  lcsAdjustFactor: string
  vcsAdjustFactor: string
  orderValueMultipliersList: OrderValueMultiplier[]
}

export interface ArrayOfString {
  fieldList: Array<string>
}

export interface LCS {
  lcs: string
  normBuy: string
  normSell: string
}

export interface MapOfStrLCS {
  lcsDictMap: Array<[string, LCS]>
}

export interface LCSResultRecord {
  summaryMap: Array<[string, LCS]>
  byMarketsMap: Array<[string, MapOfStrLCS]>
}

export interface VCS {
  vcs: string
  volume: string
}

export interface MapOfStrVCS {
  fieldMap: Record<string, VCS>[]
}

export interface VCSResultRecord {
  summaryMap: Array<[string, VCS]>
  byMarketsMap: Array<[string, MapOfStrVCS]>
  byDateMap: Array<[number, MapOfStrVCS]>
}

export interface EpochMeta {
  id: string
  startTime: string
  endTime: string
  rewardInjNum: string
  lcsRewardFraction: string
  vcsRewardFraction: string
  marketsMap: Array<[string, MarketConfig]>
}

export interface EpochResultRecord {
  lcs?: LCSResultRecord | undefined
  vcs?: VCSResultRecord | undefined
  createdAt: string
}

export interface Epoch {
  meta?: EpochMeta | undefined
  result?: EpochResultRecord | undefined
}

export {
  GrpcLCS,
  GrpcVCS,
  GrpcEpoch,
  GrpcEpochMeta,
  GrpcEpochResultRecord,
  GrpcLCSResultRecord,
  GrpcMarketConfig,
  GrpcOrderValueMultiplier,
  GrpcVCSResultRecord,
}
