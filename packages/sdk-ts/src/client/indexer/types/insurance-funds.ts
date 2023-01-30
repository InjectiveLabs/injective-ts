import { OracleType } from '@injectivelabs/core-proto-ts/injective/oracle/v1beta1/oracle'
import {
  InsuranceFund as GrpcIndexerInsuranceFund,
  RedemptionSchedule as GrpcIndexerRedemptionSchedule,
} from '@injectivelabs/indexer-proto-ts/injective_insurance_rpc'

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
  oracleType: OracleType
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
  oracleType: OracleType
  expiry?: number
}

export { GrpcIndexerInsuranceFund, GrpcIndexerRedemptionSchedule }
