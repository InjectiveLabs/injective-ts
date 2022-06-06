import { OracleTypeMap } from '@injectivelabs/chain-api/injective/oracle/v1beta1/oracle_pb'
import {
  InsuranceFund as GrpcInsuranceFund,
  RedemptionSchedule as GrpcRedemptionSchedule,
} from '@injectivelabs/exchange-api/injective_insurance_rpc_pb'
import { OracleType } from './exchange'

export interface InsuranceFund {
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
  oracleType: OracleTypeMap[keyof OracleTypeMap]
  expiry?: number
}

export { GrpcInsuranceFund, GrpcRedemptionSchedule }
