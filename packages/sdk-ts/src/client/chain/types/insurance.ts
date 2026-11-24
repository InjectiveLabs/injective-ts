import { OracleType } from '@injectivelabs/core-proto-ts-v2/generated/injective/oracle/v1beta1/oracle_pb'
import type * as InjectiveInsuranceV1Beta1InsurancePb from '@injectivelabs/core-proto-ts-v2/generated/injective/insurance/v1beta1/insurance_pb'

export interface InsuranceModuleParams {
  defaultRedemptionNoticePeriodDuration: number
}

export interface InsuranceFund {
  depositDenom: string
  insurancePoolTokenDenom: string
  redemptionNoticePeriodDuration?: number
  balance: string
  totalShare: string
  marketId: string
  marketTicker: string
  oracleBase: string
  oracleQuote: string
  oracleType: OracleType
  expiry: number
}

/** chain v1.21+: a pool shared by many markets, quote-denominated */
export interface ConsolidatedInsurancePool {
  depositDenom: string
  shareDenom: string
  quoteDecimals: number
  /** seconds */
  redemptionNoticePeriodDuration: number
  balance: string
  totalShare: string
  maxDrawPerMarket: string
  /** insurance-payout pause (not a trading halt) */
  paused: boolean
  reservedBalance: string
  pendingReservationRedemptions: number
}

/** chain v1.21+: binds one perpetual market to a consolidated pool */
export interface ConsolidatedInsurancePolicy {
  marketId: string
  poolDenom: string
  maxDraw: string
  outstandingDraw: string
  netPrefunding: string
  reservedAmount: string
}

/** chain v1.21+: shares escrowed until the notice period expires */
export interface ConsolidatedRedemptionSchedule {
  id: number
  poolDenom: string
  redeemer: string
  /** unix seconds */
  claimableRedemptionTime: number
  shares: { denom: string; amount: string }
  waitingForReservedCash: boolean
}

export type GrpcInsuranceParams = InjectiveInsuranceV1Beta1InsurancePb.Params
export type GrpcInsuranceFund =
  InjectiveInsuranceV1Beta1InsurancePb.InsuranceFund
export type GrpcRedemptionSchedule =
  InjectiveInsuranceV1Beta1InsurancePb.RedemptionSchedule

export { OracleType }
export const OracleTypeMap = OracleType
