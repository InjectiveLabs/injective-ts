import { OracleType } from '@injectivelabs/core-proto-ts-v2/generated/injective/oracle/v1beta1/oracle_pb.mjs'
import type * as InjectiveInsuranceV1Beta1InsurancePb from '@injectivelabs/core-proto-ts-v2/generated/injective/insurance/v1beta1/insurance_pb.mjs'

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

export type GrpcInsuranceParams = InjectiveInsuranceV1Beta1InsurancePb.Params
export type GrpcInsuranceFund =
  InjectiveInsuranceV1Beta1InsurancePb.InsuranceFund
export type GrpcRedemptionSchedule =
  InjectiveInsuranceV1Beta1InsurancePb.RedemptionSchedule

export { OracleType }
export const OracleTypeMap = OracleType
