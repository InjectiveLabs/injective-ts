import { InjectiveOracleV1Beta1Oracle } from '@injectivelabs/core-proto-ts'
import { InjectiveInsuranceRpc } from '@injectivelabs/indexer-proto-ts'

export interface IndexerInsuranceFund {
  depositDenom: string
  insurancePoolTokenDenom: string
  redemptionNoticePeriodDuration?: number
  depositTokenMeta?: any
  balance: string
  totalShare: string
  marketId: string
  marketTicker: string
  oracleBase: string
  oracleQuote: string
  oracleType: InjectiveOracleV1Beta1Oracle.OracleType
  expiry: number
}

export enum RedemptionStatus {
  Pending = 'pending',
  Disbursed = 'disbursed',
}

export interface Redemption {
  redemptionId: number
  status: RedemptionStatus
  redeemer: string
  claimableRedemptionTime: number
  redemptionAmount: string
  redemptionDenom: string
  requestedAt: number
  disbursedAmount: string
  disbursedDenom: string
  disbursedAt: number
}

export interface InsuranceFundCreateParams {
  ticker: string
  quoteDenom: string
  oracleBase: string
  oracleQuote: string
  oracleType: InjectiveOracleV1Beta1Oracle.OracleType
  expiry?: number
}

export type GrpcIndexerInsuranceFund = InjectiveInsuranceRpc.InsuranceFund
export type GrpcIndexerRedemptionSchedule =
  InjectiveInsuranceRpc.RedemptionSchedule
