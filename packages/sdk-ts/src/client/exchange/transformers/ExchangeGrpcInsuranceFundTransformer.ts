import { ExchangeOracleType } from '../types'
import {
  ExchangeInsuranceFund,
  GrpcExchangeInsuranceFund,
  GrpcExchangeRedemptionSchedule,
  Redemption,
  RedemptionStatus,
} from './../types/insurance-funds'
import {
  FundsResponse,
  RedemptionsResponse,
} from '@injectivelabs/exchange-api/injective_insurance_rpc_pb'

/**
 * @category Exchange Grpc Transformer
 */
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
    grpcInsuranceFund: GrpcExchangeInsuranceFund,
  ): ExchangeInsuranceFund {
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
      oracleType: parseInt(
        grpcInsuranceFund.getOracleType(),
      ) as ExchangeOracleType,
      expiry: grpcInsuranceFund.getExpiry(),
    }
  }

  static grpcInsuranceFundsToInsuranceFunds(
    grpcInsuranceFunds: GrpcExchangeInsuranceFund[],
  ): ExchangeInsuranceFund[] {
    return grpcInsuranceFunds.map(
      ExchangeGrpcInsuranceFundTransformer.grpcInsuranceFundToInsuranceFund,
    )
  }

  static grpcRedemptionToRedemption(
    redemption: GrpcExchangeRedemptionSchedule,
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
    redemptions: GrpcExchangeRedemptionSchedule[],
  ): Redemption[] {
    return redemptions.map(
      ExchangeGrpcInsuranceFundTransformer.grpcRedemptionToRedemption,
    )
  }
}
