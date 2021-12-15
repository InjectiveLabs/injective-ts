import {
  ArrayOfString as GrpcArrayOfString,
  DMMLCS as GrpcDMMLCS,
  DMMVCS as GrpcDMMVCS,
  Epoch as GrpcEpoch,
  EpochMeta as GrpcEpochMeta,
  EpochResultRecord as GrpcEpochResultRecord,
  LCSResultRecord as GrpcLCSResultRecord,
  MapOfStringDMMLCS as GrpcMapOfStringDMMLCS,
  MapOfStringDMMVCS as GrpcMapOfStringDMMVCS,
  MarketConfig as GrpcMarketConfig,
  OrderValueMultiplier as GrpcOrderValueMultiplier,
  VCSResultRecord as GrpcVCSResultRecord,
} from '@injectivelabs/exchange-api/injective_dmm_rpc_pb'

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

export interface DMMLCS {
  lcs: string
  normBuy: string
  normSell: string
}

export interface MapOfStringDMMLCS {
  fieldMap: Record<string, DMMLCS>[]
}

export interface LCSResultRecord {
  summaryMap: Record<string, DMMLCS>
  byMarketsMap: Record<string, Record<string, DMMLCS>>
}

export interface DMMVCS {
  vcs: string
  volume: string
}

export interface MapOfStringDMMVCS {
  fieldMap: Record<string, DMMVCS>[]
}

export interface VCSResultRecord {
  summaryMap: Record<string, DMMVCS>
  byMarketsMap: Record<string, MapOfStringDMMVCS>
  byDateMap: Record<number, MapOfStringDMMVCS>
}

export interface EpochMeta {
  id: string
  startTime: string
  endTime: string
  rewardInjNum: string
  lcsRewardFraction: string
  vcsRewardFraction: string
  marketsMap: Record<string, MarketConfig>
  dmmAddressesList: Record<string, string[]>
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
  GrpcArrayOfString,
  GrpcDMMLCS,
  GrpcDMMVCS,
  GrpcEpoch,
  GrpcEpochMeta,
  GrpcEpochResultRecord,
  GrpcLCSResultRecord,
  GrpcMapOfStringDMMLCS,
  GrpcMapOfStringDMMVCS,
  GrpcMarketConfig,
  GrpcOrderValueMultiplier,
  GrpcVCSResultRecord,
}
