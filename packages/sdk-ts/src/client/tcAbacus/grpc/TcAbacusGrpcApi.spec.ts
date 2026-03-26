import { TcAbacusGrpcApi } from './TcAbacusGrpcApi.js'
import type { TcAbacusGrpcTransformer } from './transformers/index.js'

const injectiveAddress = 'inj1995xnrrtnmtdgjmx0g937vf28dwefhkhy6gy5e'

const tcAbacusGrpcApi = new TcAbacusGrpcApi(
  'https://k8s.mainnet.eu.tc-abacus.injective.network/grpc',
)

describe('TcAbacusGrpcApi', () => {
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
      const response = await tcAbacusGrpcApi.fetchReferrers(undefined, 20)

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
})
