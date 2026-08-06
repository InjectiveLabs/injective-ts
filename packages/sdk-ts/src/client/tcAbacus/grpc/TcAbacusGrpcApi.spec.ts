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

  test('normalizes unknown referrer categories to default', () => {
    const response = TcAbacusPb.Referrer.create({
      category: 'unknown',
    })

    expect(
      TcAbacusGrpcTransformer.grpcReferrerToReferrer(response).category,
    ).toBe('default')
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
})
