import { RedemptionSchedule } from '@injectivelabs/exchange-api/injective_insurance_rpc_pb'
import { OracleType } from '../types'
import {
  InsuranceFund,
  GrpcInsuranceFund,
  Redemption,
  RedemptionStatus,
} from './../types/insurance-funds'

export const grpcInsuranceFundToInsuranceFund = (
  grpcInsuranceFund: GrpcInsuranceFund,
): InsuranceFund => {
  const redemptionNoticePeriodDuration =
    grpcInsuranceFund.getRedemptionNoticePeriodDuration()
  const tokenMeta = grpcInsuranceFund.getDepositTokenMeta()
  const depositDenom = grpcInsuranceFund.getDepositDenom()

  return {
    depositDenom,
    insurancePoolTokenDenom: grpcInsuranceFund.getPoolTokenDenom(),
    redemptionNoticePeriodDuration: redemptionNoticePeriodDuration || 0,
    balance: grpcInsuranceFund.getBalance(),
    totalShare: grpcInsuranceFund.getTotalShare(),
    depositTokenMeta: tokenMeta,
    marketId: grpcInsuranceFund.getMarketId(),
    marketTicker: grpcInsuranceFund.getMarketTicker(),
    oracleBase: grpcInsuranceFund.getOracleBase(),
    oracleQuote: grpcInsuranceFund.getOracleQuote(),
    oracleType: parseInt(grpcInsuranceFund.getOracleType()) as OracleType,
    expiry: grpcInsuranceFund.getExpiry(),
  }
}

export const grpcInsuranceFundsToInsuranceFunds = (
  grpcInsuranceFunds: GrpcInsuranceFund[],
): InsuranceFund[] => {
  return grpcInsuranceFunds.map(grpcInsuranceFundToInsuranceFund)
}

export const grpcRedemptionToRedemption = (
  redemption: RedemptionSchedule,
): Redemption => {
  return {
    redemptionId: redemption.getRedemptionId(),
    status: redemption.getStatus() as RedemptionStatus,
    redeemer: redemption.getRedeemer(),
    claimableRedemptionTime: redemption.getClaimableRedemptionTime(),
    redemptionAmount: redemption.getRedemptionAmount(),
    redemptionDenom: redemption.getRedemptionDenom(),
    requestedAt: redemption.getRequestedAt(),
    disbursedAmount: redemption.getDisbursedAmount(),
    disbursedDenom: redemption.getDisbursedDenom(),
    disbursedAt: redemption.getDisbursedAt(),
  }
}

export const grpcRedemptionsToRedemptions = (
  redemptions: RedemptionSchedule[],
): Redemption[] => {
  return redemptions.map(grpcRedemptionToRedemption)
}

export class ExchangeGrpcInsuranceFundTransformer {
  static grpcRedemptionsToRedemptions = grpcRedemptionsToRedemptions

  static grpcRedemptionToRedemption = grpcRedemptionToRedemption

  static grpcInsuranceFundToInsuranceFund = grpcInsuranceFundToInsuranceFund

  static grpcInsuranceFundsToInsuranceFunds = grpcInsuranceFundsToInsuranceFunds
}
