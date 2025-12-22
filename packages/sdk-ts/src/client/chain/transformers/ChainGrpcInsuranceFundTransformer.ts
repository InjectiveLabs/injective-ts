import type * as InjectiveInsuranceV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/insurance/v1beta1/query_pb'
import type { GrpcInsuranceFund } from '../types/insurance.js'
import type {
  InsuranceFund,
  InsuranceModuleParams,
} from '../types/insurance.js'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcInsuranceFundTransformer {
  static moduleParamsResponseToModuleParams(
    response: InjectiveInsuranceV1Beta1QueryPb.QueryInsuranceParamsResponse,
  ): InsuranceModuleParams {
    const params = response.params!

    return {
      defaultRedemptionNoticePeriodDuration: Number(
        params.defaultRedemptionNoticePeriodDuration || 0n,
      ),
    }
  }

  static grpcInsuranceFundToInsuranceFund(
    grpcFund: GrpcInsuranceFund,
  ): InsuranceFund {
    return {
      depositDenom: grpcFund.depositDenom,
      insurancePoolTokenDenom: grpcFund.insurancePoolTokenDenom,
      redemptionNoticePeriodDuration: Number(
        grpcFund.redemptionNoticePeriodDuration || 0n,
      ),
      balance: grpcFund.balance,
      totalShare: grpcFund.totalShare,
      marketId: grpcFund.marketId,
      marketTicker: grpcFund.marketTicker,
      oracleBase: grpcFund.oracleBase,
      oracleQuote: grpcFund.oracleQuote,
      oracleType: grpcFund.oracleType,
      expiry: Number(grpcFund.expiry),
    }
  }

  static insuranceFundResponseToInsuranceFund(
    response: InjectiveInsuranceV1Beta1QueryPb.QueryInsuranceFundResponse,
  ) {
    return ChainGrpcInsuranceFundTransformer.grpcInsuranceFundToInsuranceFund(
      response.fund!,
    )
  }

  static insuranceFundsResponseToInsuranceFunds(
    response: InjectiveInsuranceV1Beta1QueryPb.QueryInsuranceFundsResponse,
  ) {
    return response.funds.map((fund) =>
      ChainGrpcInsuranceFundTransformer.grpcInsuranceFundToInsuranceFund(fund),
    )
  }

  static redemptionsResponseToRedemptions(
    response: InjectiveInsuranceV1Beta1QueryPb.QueryEstimatedRedemptionsResponse,
  ) {
    return response.amount.map((amount) => {
      return {
        amount: amount.amount,
        denom: amount.denom,
      }
    })
  }

  static estimatedRedemptionsResponseToEstimatedRedemptions(
    response: InjectiveInsuranceV1Beta1QueryPb.QueryPendingRedemptionsResponse,
  ) {
    return response.amount.map((amount) => {
      return {
        amount: amount.amount,
        denom: amount.denom,
      }
    })
  }
}
