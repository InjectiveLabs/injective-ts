import { MarketStatusMap as GrpcMarketStatus } from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import { InsuranceFund as GrpcInsuranceFund } from '@injectivelabs/exchange-api/injective_insurance_rpc_pb'
import { Oracle as GrpcOracle } from '@injectivelabs/exchange-api/injective_oracle_rpc_pb'
import {
  Epoch as GrpcEpoch,
  EpochMeta as GrpcEpochMeta,
  AccountFinalELCS as GrpcAccountFinalELCS,
  AccELCSSOneMarket as GrpcAccELCSSOneMarket,
  ELCSSnapshot as GrpcELCSSnapshot,
  MapOfStringAccELCSSOneMarket as GrpcMapOfStringAccELCSSOneMarket,
  MapOfStringMarketConf as GrpcMapOfStringMarketConf,
  MarketConf as GrpcMarketConf,
} from '@injectivelabs/exchange-api/injective_dmm_rpc_pb'

export interface StreamStatusResponse {
  details: string
  code: number
  metadata: any
}

export interface ELCSSnapshot {
  buy: string
  buyNorm: string
  sell: string
  sellNorm: string
  score: string
}

export interface AccELCSSOneMarket {
  score: string
  latestElcsSnapshot?: ELCSSnapshot | undefined
}

export interface MapOfStringAccELCSSOneMarket {
  fieldMap: Record<string, AccELCSSOneMarket>
}

export interface AccountFinalELCS {
  score: string
  detailMap: Record<string, MapOfStringAccELCSSOneMarket>
}

export interface MarketConf {
  elcsAdjustFactor: string
  evcsAdjustFactor: string
}

export interface MapOfStringMarketConf {
  fieldMap: Record<string, MarketConf>
}

export interface EpochResult {
  elcsMap: Record<string, AccountFinalELCS>
  evcsMap: Record<string, AccountFinalELCS>
}

export interface EpochMeta {
  id: string
  startTime: string
  endTime: string
  rewardTokenNum: string
  dmmProportion: string
  elcsProportion: string
  evcsProportion: string
  rewardToken: string
  marketsMap: Record<string, MapOfStringMarketConf>
  dmmAddressesList: Array<string>
}

export interface Epoch {
  epochId: string
  meta?: EpochMeta | undefined
  result?: EpochResult | undefined
}

export {
  GrpcAccELCSSOneMarket,
  GrpcMarketStatus,
  GrpcOracle,
  GrpcInsuranceFund,
  GrpcEpoch,
  GrpcELCSSnapshot,
  GrpcEpochMeta,
  GrpcAccountFinalELCS,
  GrpcMapOfStringMarketConf,
  GrpcMarketConf,
  GrpcMapOfStringAccELCSSOneMarket,
}
