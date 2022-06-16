import {
  Params as GrpcInsuranceParams,
  InsuranceFund as GrpcInsuranceFund,
  RedemptionSchedule as GrpcRedemptionSchedule,
} from '@injectivelabs/chain-api/injective/insurance/v1beta1/insurance_pb'

export interface InsuranceModuleParams {
  defaultRedemptionNoticePeriodDuration: number
}

export enum OracleType {
  UNSPECIFIED = 0,
  BAND = 1,
  PRICEFEED = 2,
  COINBASE = 3,
  CHAINLINK = 4,
  RAZOR = 5,
  DIA = 6,
  API3 = 7,
  UMA = 8,
  PYTH = 9,
  BANDIBC = 10,
  PROVIDER = 11,
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

export { GrpcInsuranceParams, GrpcRedemptionSchedule, GrpcInsuranceFund }
