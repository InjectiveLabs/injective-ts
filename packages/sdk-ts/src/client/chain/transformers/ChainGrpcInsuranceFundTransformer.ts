import { InsuranceFund, InsuranceModuleParams } from '../types/insurance'
import {
  QueryInsuranceParamsResponse,
  QueryInsuranceFundResponse,
  QueryEstimatedRedemptionsResponse,
  QueryInsuranceFundsResponse,
  QueryPendingRedemptionsResponse,
} from '@injectivelabs/chain-api/injective/insurance/v1beta1/query_pb'
import { GrpcInsuranceFund } from '../types/insurance'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcInsuranceFundTransformer {
  static moduleParamsResponseToModuleParams(
    response: QueryInsuranceParamsResponse,
  ): InsuranceModuleParams {
    const params = response.getParams()!

    return {
      defaultRedemptionNoticePeriodDuration:
        params.getDefaultRedemptionNoticePeriodDuration()?.getSeconds() || 0,
    }
  }

  static grpcInsuranceFundToInsuranceFund(
    grpcFund: GrpcInsuranceFund,
  ): InsuranceFund {
    return {
      depositDenom: grpcFund.getDepositDenom(),
      insurancePoolTokenDenom: grpcFund.getInsurancePoolTokenDenom(),
      redemptionNoticePeriodDuration: grpcFund
        .getRedemptionNoticePeriodDuration()
        ?.getSeconds(),
      balance: grpcFund.getBalance(),
      totalShare: grpcFund.getTotalShare(),
      marketId: grpcFund.getMarketId(),
      marketTicker: grpcFund.getMarketTicker(),
      oracleBase: grpcFund.getOracleBase(),
      oracleQuote: grpcFund.getOracleQuote(),
      oracleType: grpcFund.getOracleType(),
      expiry: grpcFund.getExpiry(),
    }
  }

  static insuranceFundResponseToInsuranceFund(
    response: QueryInsuranceFundResponse,
  ) {
    return ChainGrpcInsuranceFundTransformer.grpcInsuranceFundToInsuranceFund(
      response.getFund()!,
    )
  }

  static insuranceFundsResponseToInsuranceFunds(
    response: QueryInsuranceFundsResponse,
  ) {
    return response
      .getFundsList()
      .map((fund) =>
        ChainGrpcInsuranceFundTransformer.grpcInsuranceFundToInsuranceFund(
          fund,
        ),
      )
  }

  static redemptionsResponseToRedemptions(
    response: QueryEstimatedRedemptionsResponse,
  ) {
    return response.getAmountList().map((amount) => {
      return {
        amount: amount.getAmount(),
        denom: amount.getDenom(),
      }
    })
  }

  static estimatedRedemptionsResponseToEstimatedRedemptions(
    response: QueryPendingRedemptionsResponse,
  ) {
    return response.getAmountList().map((amount) => {
      return {
        amount: amount.getAmount(),
        denom: amount.getDenom(),
      }
    })
  }
}
