import { ChainGrpcCommonTransformer } from './ChainGrpcCommonTransformer.js'
import type * as InjectiveInsuranceV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/insurance/v1beta1/query_pb'
import type * as InjectiveInsuranceV1Beta1InsurancePb from '@injectivelabs/core-proto-ts-v2/generated/injective/insurance/v1beta1/insurance_pb'
import type { GrpcInsuranceFund } from '../types/insurance.js'
import type {
  InsuranceFund,
  InsuranceModuleParams,
  ConsolidatedInsurancePool,
  ConsolidatedInsurancePolicy,
  ConsolidatedRedemptionSchedule,
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
        params.defaultRedemptionNoticePeriodDuration?.seconds || 0n,
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
        grpcFund.redemptionNoticePeriodDuration?.seconds || 0n,
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

  static grpcConsolidatedPoolToConsolidatedPool(
    pool: InjectiveInsuranceV1Beta1InsurancePb.ConsolidatedInsurancePool,
  ): ConsolidatedInsurancePool {
    return {
      depositDenom: pool.depositDenom,
      shareDenom: pool.shareDenom,
      quoteDecimals: pool.quoteDecimals,
      redemptionNoticePeriodDuration: Number(
        pool.redemptionNoticePeriodDuration?.seconds || 0n,
      ),
      balance: pool.balance,
      totalShare: pool.totalShare,
      maxDrawPerMarket: pool.maxDrawPerMarket,
      paused: pool.paused,
      reservedBalance: pool.reservedBalance,
      pendingReservationRedemptions: Number(pool.pendingReservationRedemptions),
    }
  }

  static grpcConsolidatedPolicyToConsolidatedPolicy(
    policy: InjectiveInsuranceV1Beta1InsurancePb.ConsolidatedInsurancePolicy,
  ): ConsolidatedInsurancePolicy {
    return {
      marketId: policy.marketId,
      poolDenom: policy.poolDenom,
      maxDraw: policy.maxDraw,
      outstandingDraw: policy.outstandingDraw,
      netPrefunding: policy.netPrefunding,
      reservedAmount: policy.reservedAmount,
    }
  }

  static grpcConsolidatedRedemptionToConsolidatedRedemption(
    schedule: InjectiveInsuranceV1Beta1InsurancePb.ConsolidatedRedemptionSchedule,
  ): ConsolidatedRedemptionSchedule {
    return {
      id: Number(schedule.id),
      poolDenom: schedule.poolDenom,
      redeemer: schedule.redeemer,
      claimableRedemptionTime: Number(
        schedule.claimableRedemptionTime?.seconds || 0n,
      ),
      shares: {
        denom: schedule.shares?.denom || '',
        amount: schedule.shares?.amount || '0',
      },
      waitingForReservedCash: schedule.waitingForReservedCash,
    }
  }

  static consolidatedPoolsResponseToConsolidatedPools(
    response: InjectiveInsuranceV1Beta1QueryPb.QueryConsolidatedInsurancePoolsResponse,
  ) {
    return response.pools.map(
      ChainGrpcInsuranceFundTransformer.grpcConsolidatedPoolToConsolidatedPool,
    )
  }

  static consolidatedPolicyResponseToConsolidatedPolicy(
    response: InjectiveInsuranceV1Beta1QueryPb.QueryConsolidatedInsurancePolicyResponse,
  ) {
    return response.policy
      ? ChainGrpcInsuranceFundTransformer.grpcConsolidatedPolicyToConsolidatedPolicy(
          response.policy,
        )
      : undefined
  }

  static consolidatedPoliciesResponseToConsolidatedPolicies(
    response: InjectiveInsuranceV1Beta1QueryPb.QueryConsolidatedInsurancePoliciesResponse,
  ) {
    return {
      policies: response.policies.map(
        ChainGrpcInsuranceFundTransformer.grpcConsolidatedPolicyToConsolidatedPolicy,
      ),
      pagination: ChainGrpcCommonTransformer.grpcPaginationToPaginationV2(
        response.pagination,
      ),
    }
  }

  static consolidatedRedemptionsResponseToConsolidatedRedemptions(
    response: InjectiveInsuranceV1Beta1QueryPb.QueryConsolidatedRedemptionsResponse,
  ) {
    return {
      schedules: response.schedules.map(
        ChainGrpcInsuranceFundTransformer.grpcConsolidatedRedemptionToConsolidatedRedemption,
      ),
      pagination: ChainGrpcCommonTransformer.grpcPaginationToPaginationV2(
        response.pagination,
      ),
    }
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
