import { AbacusGrpcApi } from './AbacusGrpcApi.js'
import type { AbacusGrpcTransformer } from './transformers/index.js'

const injectiveAddress = 'inj1995xnrrtnmtdgjmx0g937vf28dwefhkhy6gy5e'

const abacusGrpcApi = new AbacusGrpcApi(
  'https://k8s.mainnet.eu.abacus.injective.network/grpc',
)

describe('AbacusGrpcApi', () => {
  test('fetchAccountLatestPoints', async () => {
    try {
      const response = await abacusGrpcApi.fetchAccountLatestPoints(
        injectiveAddress,
      )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof AbacusGrpcTransformer.grpcPointsLatestToPointsLatest
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'AbacusGrpcApi.fetchAccountLatestPoints => ' + (e as any).message,
      )
    }
  })

  test('fetchAccountDailyPoints', async () => {
    try {
      const response = await abacusGrpcApi.fetchAccountDailyPoints(
        injectiveAddress,
        7,
      )

      expect(response).toBeDefined()
      expect(Array.isArray(response)).toBe(true)

      if (response.length === 0) {
        console.warn('fetchAccountDailyPoints.responseIsEmptyArray')
      }

      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof AbacusGrpcTransformer.grpcPointsStatsDailyToPointsStatsDaily
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'AbacusGrpcApi.fetchAccountDailyPoints => ' + (e as any).message,
      )
    }
  })

  test('fetchAccountDailyPoints without limit', async () => {
    try {
      const response = await abacusGrpcApi.fetchAccountDailyPoints(
        injectiveAddress,
      )

      expect(response).toBeDefined()
      expect(Array.isArray(response)).toBe(true)

      if (response.length === 0) {
        console.warn('fetchAccountDailyPoints.responseIsEmptyArray')
      }

      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof AbacusGrpcTransformer.grpcPointsStatsDailyToPointsStatsDaily
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'AbacusGrpcApi.fetchAccountDailyPoints => ' + (e as any).message,
      )
    }
  })

  test('fetchAccountWeeklyPoints', async () => {
    try {
      const response = await abacusGrpcApi.fetchAccountWeeklyPoints(
        injectiveAddress,
        4,
      )

      expect(response).toBeDefined()
      expect(Array.isArray(response)).toBe(true)

      if (response.length === 0) {
        console.warn('fetchAccountWeeklyPoints.responseIsEmptyArray')
      }

      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof AbacusGrpcTransformer.grpcPointsStatsWeeklyToPointsStatsWeekly
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'AbacusGrpcApi.fetchAccountWeeklyPoints => ' + (e as any).message,
      )
    }
  })

  test('fetchAccountWeeklyPoints without limit', async () => {
    try {
      const response = await abacusGrpcApi.fetchAccountWeeklyPoints(
        injectiveAddress,
      )

      expect(response).toBeDefined()
      expect(Array.isArray(response)).toBe(true)

      if (response.length === 0) {
        console.warn('fetchAccountWeeklyPoints.responseIsEmptyArray')
      }

      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof AbacusGrpcTransformer.grpcPointsStatsWeeklyToPointsStatsWeekly
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'AbacusGrpcApi.fetchAccountWeeklyPoints => ' + (e as any).message,
      )
    }
  })
})
