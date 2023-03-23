import {
  InjectiveInsuranceV1Beta1Insurance,
  InjectiveOracleV1Beta1Oracle,
} from '@injectivelabs/core-proto-ts'

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
  oracleType: InjectiveOracleV1Beta1Oracle.OracleType
  expiry: number
}

export type GrpcInsuranceParams = InjectiveInsuranceV1Beta1Insurance.Params
export type GrpcInsuranceFund = InjectiveInsuranceV1Beta1Insurance.InsuranceFund
export type GrpcRedemptionSchedule =
  InjectiveInsuranceV1Beta1Insurance.RedemptionSchedule

export type OracleType = InjectiveOracleV1Beta1Oracle.OracleType
export const OracleTypeMap = InjectiveOracleV1Beta1Oracle.OracleType
