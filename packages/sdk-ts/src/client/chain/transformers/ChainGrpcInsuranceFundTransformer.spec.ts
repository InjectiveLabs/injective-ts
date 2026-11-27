import * as InjectiveInsuranceV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/insurance/v1beta1/query_pb'
import * as InjectiveInsuranceV1Beta1InsurancePb from '@injectivelabs/core-proto-ts-v2/generated/injective/insurance/v1beta1/insurance_pb'
import { ChainGrpcInsuranceFundTransformer } from './ChainGrpcInsuranceFundTransformer.js'

const pool =
  InjectiveInsuranceV1Beta1InsurancePb.ConsolidatedInsurancePool.create({
    depositDenom: 'usdt',
    shareDenom: 'share1',
    quoteDecimals: 6,
    redemptionNoticePeriodDuration: { seconds: 86400n, nanos: 0 },
    balance: '1000',
    totalShare: '900',
    maxDrawPerMarket: '500',
    paused: true,
    reservedBalance: '10',
    pendingReservationRedemptions: 3n,
  })
const policy =
  InjectiveInsuranceV1Beta1InsurancePb.ConsolidatedInsurancePolicy.create({
    marketId: '0xmarket',
    poolDenom: 'usdt',
    maxDraw: '500',
    outstandingDraw: '40',
    netPrefunding: '-5',
    reservedAmount: '7',
  })
const schedule =
  InjectiveInsuranceV1Beta1InsurancePb.ConsolidatedRedemptionSchedule.create({
    id: 12n,
    poolDenom: 'usdt',
    redeemer: 'inj1abc',
    claimableRedemptionTime: { seconds: 1_700_000_000n, nanos: 5 },
    shares: { denom: 'share1', amount: '100' },
    waitingForReservedCash: true,
  })

describe('ChainGrpcInsuranceFundTransformer (consolidated insurance, chain v1.21)', () => {
  it('maps pools: duration to seconds, bigint counters to numbers, paused flag', () => {
    expect(
      ChainGrpcInsuranceFundTransformer.consolidatedPoolsResponseToConsolidatedPools(
        InjectiveInsuranceV1Beta1QueryPb.QueryConsolidatedInsurancePoolsResponse.create(
          { pools: [pool] },
        ),
      ),
    ).toStrictEqual([
      {
        depositDenom: 'usdt',
        shareDenom: 'share1',
        quoteDecimals: 6,
        redemptionNoticePeriodDuration: 86400,
        balance: '1000',
        totalShare: '900',
        maxDrawPerMarket: '500',
        paused: true,
        reservedBalance: '10',
        pendingReservationRedemptions: 3,
      },
    ])
  })

  it('maps a policy (and returns undefined when the chain returns none)', () => {
    expect(
      ChainGrpcInsuranceFundTransformer.consolidatedPolicyResponseToConsolidatedPolicy(
        InjectiveInsuranceV1Beta1QueryPb.QueryConsolidatedInsurancePolicyResponse.create(
          { policy },
        ),
      ),
    ).toStrictEqual({
      marketId: '0xmarket',
      poolDenom: 'usdt',
      maxDraw: '500',
      outstandingDraw: '40',
      netPrefunding: '-5',
      reservedAmount: '7',
    })
    expect(
      ChainGrpcInsuranceFundTransformer.consolidatedPolicyResponseToConsolidatedPolicy(
        InjectiveInsuranceV1Beta1QueryPb.QueryConsolidatedInsurancePolicyResponse.create(),
      ),
    ).toBeUndefined()
  })

  it('maps policies with pagination', () => {
    const result =
      ChainGrpcInsuranceFundTransformer.consolidatedPoliciesResponseToConsolidatedPolicies(
        InjectiveInsuranceV1Beta1QueryPb.QueryConsolidatedInsurancePoliciesResponse.create(
          {
            policies: [policy],
            pagination: { nextKey: new Uint8Array([1, 2]), total: 0n },
          },
        ),
      )

    expect(result.policies).toHaveLength(1)
    expect(result.policies[0].marketId).toBe('0xmarket')
    expect(result.pagination.next).not.toBe('')
  })

  it('maps redemption schedules: timestamp to unix seconds, id to number', () => {
    const result =
      ChainGrpcInsuranceFundTransformer.consolidatedRedemptionsResponseToConsolidatedRedemptions(
        InjectiveInsuranceV1Beta1QueryPb.QueryConsolidatedRedemptionsResponse.create(
          { schedules: [schedule] },
        ),
      )

    expect(result.schedules).toStrictEqual([
      {
        id: 12,
        poolDenom: 'usdt',
        redeemer: 'inj1abc',
        claimableRedemptionTime: 1_700_000_000,
        shares: { denom: 'share1', amount: '100' },
        waitingForReservedCash: true,
      },
    ])
    expect(result.pagination).toStrictEqual({ total: 0, next: '' })
  })
})
