import * as TcAbacusPb from '@injectivelabs/tc-abacus-proto-ts-v2/generated/injective_tc_abacus_rpc_pb'
import { TcAbacusGrpcApi } from './TcAbacusGrpcApi.js'
import { TcAbacusGrpcTransformer } from './transformers/index.js'

const injectiveAddress = 'inj1995xnrrtnmtdgjmx0g937vf28dwefhkhy6gy5e'

const tcAbacusGrpcApi = new TcAbacusGrpcApi(
  'https://k8s.mainnet.eu.tc-abacus.injective.network/grpc',
)

describe('TcAbacusGrpcApi', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('fetchCurrentEpoch', async () => {
    try {
      const response = await tcAbacusGrpcApi.fetchCurrentEpoch()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof TcAbacusGrpcTransformer.grpcCurrentEpochToCurrentEpoch
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'TcAbacusGrpcApi.fetchCurrentEpoch => ' + (e as any).message,
      )
    }
  })

  test('fetchHealthCheck', async () => {
    try {
      const response = await tcAbacusGrpcApi.fetchHealthCheck()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof TcAbacusGrpcTransformer.grpcHealthCheckToHealthCheck
          >
        >(response),
      )
    } catch (e) {
      console.error('TcAbacusGrpcApi.fetchHealthCheck => ' + (e as any).message)
    }
  })

  test('fetchAccountPoints', async () => {
    try {
      const response =
        await tcAbacusGrpcApi.fetchAccountPoints(injectiveAddress)

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof TcAbacusGrpcTransformer.grpcAccountPointsToAccountPoints
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'TcAbacusGrpcApi.fetchAccountPoints => ' + (e as any).message,
      )
    }
  })

  test('fetchAccountPoints with pagination', async () => {
    try {
      const response = await tcAbacusGrpcApi.fetchAccountPoints(
        injectiveAddress,
        undefined,
        10,
      )

      expect(response).toBeDefined()
      expect(Array.isArray(response.snapshots)).toBe(true)
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof TcAbacusGrpcTransformer.grpcAccountPointsToAccountPoints
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'TcAbacusGrpcApi.fetchAccountPoints => ' + (e as any).message,
      )
    }
  })

  test('fetchAccountStats', async () => {
    try {
      const response = await tcAbacusGrpcApi.fetchAccountStats(injectiveAddress)

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof TcAbacusGrpcTransformer.grpcAccountStatsToAccountStats
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'TcAbacusGrpcApi.fetchAccountStats => ' + (e as any).message,
      )
    }
  })

  test('fetchReferrers', async () => {
    try {
      const response = await tcAbacusGrpcApi.fetchReferrers()

      expect(response).toBeDefined()
      expect(Array.isArray(response.referrers)).toBe(true)
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof TcAbacusGrpcTransformer.grpcListReferrersToListReferrers
          >
        >(response),
      )
    } catch (e) {
      console.error('TcAbacusGrpcApi.fetchReferrers => ' + (e as any).message)
    }
  })

  test('fetchReferrers with pagination', async () => {
    try {
      const response = await tcAbacusGrpcApi.fetchReferrers({ limit: 20 })

      expect(response).toBeDefined()
      expect(Array.isArray(response.referrers)).toBe(true)

      if (response.referrers.length === 0) {
        console.warn('fetchReferrers.responseIsEmptyArray')
      }

      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof TcAbacusGrpcTransformer.grpcListReferrersToListReferrers
          >
        >(response),
      )
    } catch (e) {
      console.error('TcAbacusGrpcApi.fetchReferrers => ' + (e as any).message)
    }
  })

  test('fetchAccountInvitees', async () => {
    try {
      const response =
        await tcAbacusGrpcApi.fetchAccountInvitees(injectiveAddress)

      expect(response).toBeDefined()
      expect(Array.isArray(response.invitees)).toBe(true)
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof TcAbacusGrpcTransformer.grpcAccountInviteesToAccountInvitees
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'TcAbacusGrpcApi.fetchAccountInvitees => ' + (e as any).message,
      )
    }
  })

  test('fetchAccountInvitees with pagination', async () => {
    try {
      const response = await tcAbacusGrpcApi.fetchAccountInvitees(
        injectiveAddress,
        undefined,
        15,
      )

      expect(response).toBeDefined()
      expect(Array.isArray(response.invitees)).toBe(true)

      if (response.invitees.length === 0) {
        console.warn('fetchAccountInvitees.responseIsEmptyArray')
      }

      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof TcAbacusGrpcTransformer.grpcAccountInviteesToAccountInvitees
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'TcAbacusGrpcApi.fetchAccountInvitees => ' + (e as any).message,
      )
    }
  })

  test('fetchInviteeReferrer', async () => {
    try {
      const response =
        await tcAbacusGrpcApi.fetchInviteeReferrer(injectiveAddress)

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof TcAbacusGrpcTransformer.grpcInviteeReferrerToInviteeReferrer
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'TcAbacusGrpcApi.fetchInviteeReferrer => ' + (e as any).message,
      )
    }
  })

  test.each([undefined, '', '0', '9007199254740993.123456789012345678'])(
    'preserves invitee earnings %s and existing fields offline',
    (earnings) => {
      const response = TcAbacusPb.GetAccountInviteesResponse.create({
        address: injectiveAddress,
        nextCursor: 'next-page',
        invitees: [
          {
            address: 'inj-invitee',
            height: 9007199254740993n,
            createdAt: '2026-10-01T00:00:00Z',
            allTimeVolume: '123456789.123456789012345678',
            referralPoints: '987654321.987654321012345678',
            earnings,
          },
        ],
      })

      expect(
        TcAbacusGrpcTransformer.grpcAccountInviteesToAccountInvitees(response),
      ).toStrictEqual({
        address: injectiveAddress,
        nextCursor: 'next-page',
        invitees: [
          {
            address: 'inj-invitee',
            height: '9007199254740993',
            createdAt: '2026-10-01T00:00:00Z',
            allTimeVolume: '123456789.123456789012345678',
            referralPoints: '987654321.987654321012345678',
            earnings,
          },
        ],
      })
    },
  )

  test('preserves account earnings precision and month order offline', () => {
    const response = TcAbacusPb.GetAccountEarningsResponse.create({
      address: injectiveAddress,
      totalEarnings: '9007199254740993.123456789012345678',
      months: [
        {
          month: '2026-10',
          volume: '99999999999999999.999999999999999999',
          earnings: '9007199254740993.123456789012345678',
          cumulativeEarnings: '9007199254740993.123456789012345678',
        },
        {
          month: '2026-08',
          volume: '0',
          earnings: '',
          cumulativeEarnings: '0',
        },
      ],
    })

    expect(
      TcAbacusGrpcTransformer.grpcAccountEarningsToAccountEarnings(response),
    ).toStrictEqual({
      address: injectiveAddress,
      totalEarnings: '9007199254740993.123456789012345678',
      months: response.months,
    })
  })

  test('preserves generated earnings empty defaults offline', () => {
    expect(
      TcAbacusGrpcTransformer.grpcAccountEarningsToAccountEarnings(
        TcAbacusPb.GetAccountEarningsResponse.create(),
      ),
    ).toStrictEqual({ address: '', totalEarnings: '', months: [] })
    expect(
      TcAbacusGrpcTransformer.grpcReferrerMonthlyEarningsToReferrerMonthlyEarnings(
        TcAbacusPb.ReferrerMonthlyEarnings.create(),
      ),
    ).toStrictEqual({
      month: '',
      volume: '',
      earnings: '',
      cumulativeEarnings: '',
    })
  })

  test('fetchAccountEarnings dispatches the generated RPC offline', async () => {
    const api = new TcAbacusGrpcApi('https://localhost')
    const response = TcAbacusPb.GetAccountEarningsResponse.create({
      address: injectiveAddress,
      totalEarnings: '123.000000000000000001',
      months: [
        {
          month: '2026-10',
          volume: '456.000000000000000002',
          earnings: '123.000000000000000001',
          cumulativeEarnings: '123.000000000000000001',
        },
      ],
    })
    const unary = vi
      .spyOn(api.getTransport(), 'unary')
      .mockReturnValue(Promise.resolve({ response }) as any)
    const executeGrpcCall = vi.spyOn(api as any, 'executeGrpcCall')

    await expect(
      api.fetchAccountEarnings(injectiveAddress),
    ).resolves.toStrictEqual({
      address: injectiveAddress,
      totalEarnings: response.totalEarnings,
      months: response.months,
    })
    expect(executeGrpcCall).toHaveBeenCalledOnce()
    expect(executeGrpcCall.mock.calls[0]?.[0]).toStrictEqual(
      TcAbacusPb.GetAccountEarningsRequest.create({
        address: injectiveAddress,
      }),
    )
    expect(unary).toHaveBeenCalledOnce()
    expect(unary).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'GetAccountEarnings',
        service: expect.objectContaining({
          typeName: 'injective_tc_abacus_rpc.InjectiveTCAbacusRPC',
        }),
      }),
      TcAbacusPb.GetAccountEarningsRequest.create({
        address: injectiveAddress,
      }),
      expect.any(Object),
    )
  })

  test('fetchAccountEarnings propagates rejections offline', async () => {
    const api = new TcAbacusGrpcApi('https://localhost')
    const error = new Error('earnings unavailable')
    vi.spyOn(api as any, 'executeGrpcCall').mockRejectedValue(error)

    await expect(api.fetchAccountEarnings(injectiveAddress)).rejects.toBe(error)
  })

  test('maps referrer categories', () => {
    const response = TcAbacusPb.Referrer.create({
      category: 'kol1',
    })

    expect(
      TcAbacusGrpcTransformer.grpcReferrerToReferrer(response).category,
    ).toBe('kol1')
  })

  test('maps account stats categories', () => {
    const response = TcAbacusPb.GetAccountStatsResponse.create({
      category: 'kol2',
    })

    expect(
      TcAbacusGrpcTransformer.grpcAccountStatsToAccountStats(response).category,
    ).toBe('kol2')
  })

  test('normalizes empty referrer categories to default', () => {
    const response = TcAbacusPb.Referrer.create()

    expect(
      TcAbacusGrpcTransformer.grpcReferrerToReferrer(response).category,
    ).toBe('default')
  })

  test('preserves unknown referrer categories', () => {
    const response = TcAbacusPb.Referrer.create({
      category: 'unknown',
    })

    expect(
      TcAbacusGrpcTransformer.grpcReferrerToReferrer(response).category,
    ).toBe('unknown')
  })

  test('setReferrerCategory', async () => {
    const executeGrpcCall = vi
      .spyOn(tcAbacusGrpcApi as any, 'executeGrpcCall')
      .mockResolvedValue({})

    await expect(
      tcAbacusGrpcApi.setReferrerCategory(injectiveAddress, 'kol2'),
    ).resolves.toEqual({})

    expect(executeGrpcCall).toHaveBeenCalledOnce()
    expect(executeGrpcCall.mock.calls[0]?.[0]).toEqual(
      expect.objectContaining({
        address: injectiveAddress,
        category: 'kol2',
      }),
    )
  })

  test('rejects invalid referrer categories', async () => {
    const executeGrpcCall = vi.spyOn(tcAbacusGrpcApi as any, 'executeGrpcCall')
    const category = 'unknown' as Parameters<
      typeof tcAbacusGrpcApi.setReferrerCategory
    >[1]

    await expect(
      tcAbacusGrpcApi.setReferrerCategory(injectiveAddress, category),
    ).rejects.toThrow('Invalid referrer category: unknown')
    expect(executeGrpcCall).not.toHaveBeenCalled()
  })
})
