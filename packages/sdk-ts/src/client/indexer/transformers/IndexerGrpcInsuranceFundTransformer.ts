import {
  IndexerInsuranceFund,
  GrpcIndexerInsuranceFund,
  GrpcIndexerRedemptionSchedule,
  Redemption,
  RedemptionStatus,
} from '../types/insurance-funds.js'
import { InjectiveInsuranceRpc } from '@injectivelabs/indexer-proto-ts'
import { InjectiveOracleV1Beta1Oracle } from '@injectivelabs/core-proto-ts'

/**
 * @category Indexer Grpc Transformer
 */
export class IndexerGrpcInsuranceFundTransformer {
  static insuranceFundsResponseToInsuranceFunds(
    response: InjectiveInsuranceRpc.FundsResponse,
  ) {
    const insuranceFunds = response.funds

    return IndexerGrpcInsuranceFundTransformer.grpcInsuranceFundsToInsuranceFunds(
      insuranceFunds,
    )
  }

  static redemptionsResponseToRedemptions(
    response: InjectiveInsuranceRpc.RedemptionsResponse,
  ) {
    const redemptions = response.redemptionSchedules

    return IndexerGrpcInsuranceFundTransformer.grpcRedemptionsToRedemptions(
      redemptions,
    )
  }

  static grpcInsuranceFundToInsuranceFund(
    grpcInsuranceFund: GrpcIndexerInsuranceFund,
  ): IndexerInsuranceFund {
    const redemptionNoticePeriodDuration =
      grpcInsuranceFund.redemptionNoticePeriodDuration
    const tokenMeta = grpcInsuranceFund.depositTokenMeta
    const depositDenom = grpcInsuranceFund.depositDenom

    return {
      depositDenom,
      insurancePoolTokenDenom: grpcInsuranceFund.poolTokenDenom,
      redemptionNoticePeriodDuration: parseInt(
        redemptionNoticePeriodDuration || '0',
        10,
      ),
      balance: grpcInsuranceFund.balance,
      totalShare: grpcInsuranceFund.totalShare,
      depositTokenMeta: tokenMeta,
      marketId: grpcInsuranceFund.marketId,
      marketTicker: grpcInsuranceFund.marketTicker,
      oracleBase: grpcInsuranceFund.oracleBase,
      oracleQuote: grpcInsuranceFund.oracleQuote,
      oracleType: parseInt(
        grpcInsuranceFund.oracleType,
      ) as InjectiveOracleV1Beta1Oracle.OracleType,
      expiry: parseInt(grpcInsuranceFund.expiry, 10),
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
      redemptionId: parseInt(redemption.redemptionId, 10),
      status: redemption.status as RedemptionStatus,
      redeemer: redemption.redeemer,
      claimableRedemptionTime: parseInt(redemption.claimableRedemptionTime, 10),
      redemptionAmount: redemption.redemptionAmount,
      redemptionDenom: redemption.redemptionDenom,
      requestedAt: parseInt(redemption.requestedAt, 10),
      disbursedAmount: redemption.disbursedAmount,
      disbursedDenom: redemption.disbursedDenom,
      disbursedAt: parseInt(redemption.disbursedAt, 10),
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
