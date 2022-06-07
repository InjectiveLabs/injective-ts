import { RedemptionSchedule } from '@injectivelabs/exchange-api/injective_insurance_rpc_pb'
import { OracleType } from '../types'
import {
  InsuranceFund,
  GrpcInsuranceFund,
  Redemption,
  RedemptionStatus,
} from './../types/insurance-funds'
import {
  FundsResponse,
  RedemptionsResponse,
} from '@injectivelabs/exchange-api/injective_insurance_rpc_pb'

export class ExchangeGrpcInsuranceFundTransformer {
  static insuranceFundsResponseToInsuranceFunds(response: FundsResponse) {
    const insuranceFunds = response.getFundsList()

    return ExchangeGrpcInsuranceFundTransformer.grpcInsuranceFundsToInsuranceFunds(
      insuranceFunds,
    )
  }

  static redemptionsResponseToRedemptions(response: RedemptionsResponse) {
    const redemptions = response.getRedemptionSchedulesList()

    return ExchangeGrpcInsuranceFundTransformer.grpcRedemptionsToRedemptions(
      redemptions,
    )
  }

  static grpcInsuranceFundToInsuranceFund(
    grpcInsuranceFund: GrpcInsuranceFund,
  ): InsuranceFund {
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

  static grpcInsuranceFundsToInsuranceFunds(
    grpcInsuranceFunds: GrpcInsuranceFund[],
  ): InsuranceFund[] {
    return grpcInsuranceFunds.map(
      ExchangeGrpcInsuranceFundTransformer.grpcInsuranceFundToInsuranceFund,
    )
  }

  static grpcRedemptionToRedemption(
    redemption: RedemptionSchedule,
  ): Redemption {
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

  static grpcRedemptionsToRedemptions(
    redemptions: RedemptionSchedule[],
  ): Redemption[] {
    return redemptions.map(
      ExchangeGrpcInsuranceFundTransformer.grpcRedemptionToRedemption,
    )
  }
}
