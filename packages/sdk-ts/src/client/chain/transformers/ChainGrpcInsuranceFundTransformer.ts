import { InsuranceFund, InsuranceModuleParams } from '../types/insurance.js'
import { GrpcInsuranceFund } from '../types/insurance.js'
import { InjectiveInsuranceV1Beta1Query } from '@injectivelabs/core-proto-ts'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcInsuranceFundTransformer {
  static moduleParamsResponseToModuleParams(
    response: InjectiveInsuranceV1Beta1Query.QueryInsuranceParamsResponse,
  ): InsuranceModuleParams {
    const params = response.params!

    return {
      defaultRedemptionNoticePeriodDuration: parseInt(
        params.defaultRedemptionNoticePeriodDuration?.seconds || '0',
        10,
      ),
    }
  }

  static grpcInsuranceFundToInsuranceFund(
    grpcFund: GrpcInsuranceFund,
  ): InsuranceFund {
    return {
      depositDenom: grpcFund.depositDenom,
      insurancePoolTokenDenom: grpcFund.insurancePoolTokenDenom,
      redemptionNoticePeriodDuration: parseInt(
        grpcFund.redemptionNoticePeriodDuration?.seconds || '0',
        10,
      ),
      balance: grpcFund.balance,
      totalShare: grpcFund.totalShare,
      marketId: grpcFund.marketId,
      marketTicker: grpcFund.marketTicker,
      oracleBase: grpcFund.oracleBase,
      oracleQuote: grpcFund.oracleQuote,
      oracleType: grpcFund.oracleType,
      expiry: parseInt(grpcFund.expiry, 10),
    }
  }

  static insuranceFundResponseToInsuranceFund(
    response: InjectiveInsuranceV1Beta1Query.QueryInsuranceFundResponse,
  ) {
    return ChainGrpcInsuranceFundTransformer.grpcInsuranceFundToInsuranceFund(
      response.fund!,
    )
  }

  static insuranceFundsResponseToInsuranceFunds(
    response: InjectiveInsuranceV1Beta1Query.QueryInsuranceFundsResponse,
  ) {
    return response.funds.map((fund) =>
      ChainGrpcInsuranceFundTransformer.grpcInsuranceFundToInsuranceFund(fund),
    )
  }

  static redemptionsResponseToRedemptions(
    response: InjectiveInsuranceV1Beta1Query.QueryEstimatedRedemptionsResponse,
  ) {
    return response.amount.map((amount) => {
      return {
        amount: amount.amount,
        denom: amount.denom,
      }
    })
  }

  static estimatedRedemptionsResponseToEstimatedRedemptions(
    response: InjectiveInsuranceV1Beta1Query.QueryPendingRedemptionsResponse,
  ) {
    return response.amount.map((amount) => {
      return {
        amount: amount.amount,
        denom: amount.denom,
      }
    })
  }
}
