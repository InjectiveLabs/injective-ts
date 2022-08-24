import { IndexerOracleType } from '../types'
import {
  IndexerInsuranceFund,
  GrpcIndexerInsuranceFund,
  GrpcIndexerRedemptionSchedule,
  Redemption,
  RedemptionStatus,
} from '../types/insurance-funds'
import {
  FundsResponse,
  RedemptionsResponse,
} from '@injectivelabs/indexer-api/injective_insurance_rpc_pb'

/**
 * @category Indexer Grpc Transformer
 */
export class IndexerGrpcInsuranceFundTransformer {
  static insuranceFundsResponseToInsuranceFunds(response: FundsResponse) {
    const insuranceFunds = response.getFundsList()

    return IndexerGrpcInsuranceFundTransformer.grpcInsuranceFundsToInsuranceFunds(
      insuranceFunds,
    )
  }

  static redemptionsResponseToRedemptions(response: RedemptionsResponse) {
    const redemptions = response.getRedemptionSchedulesList()

    return IndexerGrpcInsuranceFundTransformer.grpcRedemptionsToRedemptions(
      redemptions,
    )
  }

  static grpcInsuranceFundToInsuranceFund(
    grpcInsuranceFund: GrpcIndexerInsuranceFund,
  ): IndexerInsuranceFund {
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
      ) as IndexerOracleType,
      expiry: grpcInsuranceFund.getExpiry(),
    }
  }

  static grpcInsuranceFundsToInsuranceFunds(
    grpcInsuranceFunds: GrpcIndexerInsuranceFund[],
  ): IndexerInsuranceFund[] {
    return grpcInsuranceFunds.map(
      IndexerGrpcInsuranceFundTransformer.grpcInsuranceFundToInsuranceFund,
    )
  }

  static grpcRedemptionToRedemption(
    redemption: GrpcIndexerRedemptionSchedule,
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
    redemptions: GrpcIndexerRedemptionSchedule[],
  ): Redemption[] {
    return redemptions.map(
      IndexerGrpcInsuranceFundTransformer.grpcRedemptionToRedemption,
    )
  }
}
