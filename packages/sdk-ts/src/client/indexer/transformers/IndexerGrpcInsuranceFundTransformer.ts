import type { InjectiveOracleV1Beta1Oracle } from '@injectivelabs/core-proto-ts'
import type * as InjectiveInsuranceRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_insurance_rpc_pb'
import type {
  Redemption,
  RedemptionStatus,
  IndexerInsuranceFund,
  GrpcIndexerInsuranceFund,
  GrpcIndexerRedemptionSchedule,
} from '../types/insurance-funds.js'

/**
 * @category Indexer Grpc Transformer
 */
export class IndexerGrpcInsuranceFundTransformer {
  static insuranceFundsResponseToInsuranceFunds(
    response: InjectiveInsuranceRpcPb.FundsResponse,
  ) {
    const insuranceFunds = response.funds

    return IndexerGrpcInsuranceFundTransformer.grpcInsuranceFundsToInsuranceFunds(
      insuranceFunds,
    )
  }

  static redemptionsResponseToRedemptions(
    response: InjectiveInsuranceRpcPb.RedemptionsResponse,
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
      redemptionNoticePeriodDuration: Number(
        redemptionNoticePeriodDuration || 0n,
      ),
      balance: grpcInsuranceFund.balance,
      totalShare: grpcInsuranceFund.totalShare,
      depositTokenMeta: tokenMeta,
      marketId: grpcInsuranceFund.marketId,
      marketTicker: grpcInsuranceFund.marketTicker,
      oracleBase: grpcInsuranceFund.oracleBase,
      oracleQuote: grpcInsuranceFund.oracleQuote,
      oracleType: Number(
        grpcInsuranceFund.oracleType,
      ) as InjectiveOracleV1Beta1Oracle.OracleType,
      expiry: Number(grpcInsuranceFund.expiry),
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
      redemptionId: Number(redemption.redemptionId),
      status: redemption.status as RedemptionStatus,
      redeemer: redemption.redeemer,
      claimableRedemptionTime: Number(redemption.claimableRedemptionTime),
      redemptionAmount: redemption.redemptionAmount,
      redemptionDenom: redemption.redemptionDenom,
      requestedAt: Number(redemption.requestedAt),
      disbursedAmount: redemption.disbursedAmount,
      disbursedDenom: redemption.disbursedDenom,
      disbursedAt: Number(redemption.disbursedAt),
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
