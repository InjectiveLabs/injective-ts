import { InsuranceFund, InsuranceModuleParams } from '../types/insurance'
import {
  QueryInsuranceParamsResponse,
  QueryInsuranceFundResponse,
  QueryEstimatedRedemptionsResponse,
  QueryInsuranceFundsResponse,
  QueryPendingRedemptionsResponse,
} from '@injectivelabs/core-proto-ts/injective/insurance/v1beta1/query'
import { GrpcInsuranceFund } from '../types/insurance'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcInsuranceFundTransformer {
  static moduleParamsResponseToModuleParams(
    response: QueryInsuranceParamsResponse,
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
    response: QueryInsuranceFundResponse,
  ) {
    return ChainGrpcInsuranceFundTransformer.grpcInsuranceFundToInsuranceFund(
      response.fund!,
    )
  }

  static insuranceFundsResponseToInsuranceFunds(
    response: QueryInsuranceFundsResponse,
  ) {
    return response.funds.map((fund) =>
      ChainGrpcInsuranceFundTransformer.grpcInsuranceFundToInsuranceFund(fund),
    )
  }

  static redemptionsResponseToRedemptions(
    response: QueryEstimatedRedemptionsResponse,
  ) {
    return response.amount.map((amount) => {
      return {
        amount: amount.amount,
        denom: amount.denom,
      }
    })
  }

  static estimatedRedemptionsResponseToEstimatedRedemptions(
    response: QueryPendingRedemptionsResponse,
  ) {
    return response.amount.map((amount) => {
      return {
        amount: amount.amount,
        denom: amount.denom,
      }
    })
  }
}
