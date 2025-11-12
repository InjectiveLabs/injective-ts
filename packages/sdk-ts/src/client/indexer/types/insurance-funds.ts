import type * as InjectiveInsuranceRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_insurance_rpc_pb'
import type * as InjectiveOracleV1Beta1OraclePb from '@injectivelabs/core-proto-ts-v2/generated/injective/oracle/v1beta1/oracle_pb.mjs'

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
  oracleType: InjectiveOracleV1Beta1OraclePb.OracleType
  expiry: number
}

export type RedemptionStatus = 'pending' | 'disbursed'

export const RedemptionStatus = {
  Pending: 'pending',
  Disbursed: 'disbursed',
} as const

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
  oracleType: InjectiveOracleV1Beta1OraclePb.OracleType
  expiry?: number
}

export type GrpcIndexerInsuranceFund = InjectiveInsuranceRpcPb.InsuranceFund
export type GrpcIndexerRedemptionSchedule =
  InjectiveInsuranceRpcPb.RedemptionSchedule
