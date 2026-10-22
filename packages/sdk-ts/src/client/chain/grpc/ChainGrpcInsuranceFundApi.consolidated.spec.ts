import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import * as InjectiveInsuranceV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/insurance/v1beta1/query_pb'
import { ChainGrpcInsuranceFundApi } from './ChainGrpcInsuranceFundApi.js'

const api = new ChainGrpcInsuranceFundApi(
  getNetworkEndpoints(Network.TestnetSentry).grpc,
)

/** stubs the gRPC call and returns the request the method built */
const stubCall = (response: unknown) => {
  const spy = vi
    .spyOn(api as any, 'executeGrpcCall')
    .mockResolvedValue(response as never)

  return () => spy.mock.calls[0][0] as any
}

describe('ChainGrpcInsuranceFundApi (consolidated insurance, chain v1.21)', () => {
  afterEach(() => vi.restoreAllMocks())

  it('fetchConsolidatedInsurancePools sends the optional deposit denom filter', async () => {
    const request = stubCall(
      InjectiveInsuranceV1Beta1QueryPb.QueryConsolidatedInsurancePoolsResponse.create(),
    )

    await api.fetchConsolidatedInsurancePools({ depositDenom: 'usdt' })
    expect(request().depositDenom).toBe('usdt')
  })

  it('fetchConsolidatedInsurancePools defaults to every pool', async () => {
    const request = stubCall(
      InjectiveInsuranceV1Beta1QueryPb.QueryConsolidatedInsurancePoolsResponse.create(),
    )

    expect(await api.fetchConsolidatedInsurancePools()).toStrictEqual([])
    expect(request().depositDenom).toBe('')
  })

  it('fetchConsolidatedInsurancePolicy sends the market id', async () => {
    const request = stubCall(
      InjectiveInsuranceV1Beta1QueryPb.QueryConsolidatedInsurancePolicyResponse.create(),
    )

    expect(await api.fetchConsolidatedInsurancePolicy('0xmarket')).toBe(
      undefined,
    )
    expect(request().marketId).toBe('0xmarket')
  })

  it('fetchConsolidatedInsurancePolicies sends the pool filter and key pagination', async () => {
    const request = stubCall(
      InjectiveInsuranceV1Beta1QueryPb.QueryConsolidatedInsurancePoliciesResponse.create(),
    )

    await api.fetchConsolidatedInsurancePolicies({
      poolDenom: 'usdt',
      pagination: { key: 'AQI=', limit: 5 },
    })

    expect(request().poolDenom).toBe('usdt')
    expect(request().pagination).toBeDefined()
    expect(Number(request().pagination.limit)).toBe(5)
  })

  it('fetchConsolidatedRedemptions sends the redeemer filter', async () => {
    const request = stubCall(
      InjectiveInsuranceV1Beta1QueryPb.QueryConsolidatedRedemptionsResponse.create(),
    )

    expect(
      await api.fetchConsolidatedRedemptions({ redeemer: 'inj1abc' }),
    ).toStrictEqual({ schedules: [], pagination: { total: 0, next: '' } })
    expect(request().redeemer).toBe('inj1abc')
  })
})
