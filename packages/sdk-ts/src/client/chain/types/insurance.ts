import {
  Params as GrpcInsuranceParams,
  InsuranceFund as GrpcInsuranceFund,
  RedemptionSchedule as GrpcRedemptionSchedule,
} from '@injectivelabs/core-proto-ts/injective/insurance/v1beta1/insurance'
import { OracleType } from '@injectivelabs/core-proto-ts/injective/oracle/v1beta1/oracle'

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

export {
  GrpcInsuranceParams,
  OracleType,
  GrpcRedemptionSchedule,
  GrpcInsuranceFund,
}
