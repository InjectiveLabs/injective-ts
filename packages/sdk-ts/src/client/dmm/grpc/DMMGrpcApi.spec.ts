import { mockFactory } from '@injectivelabs/test-utils'
import { DmmGrpcApi } from './DmmGrpcApi'
import { DmmGrpcTransformer } from './transformers'

const epochId = 'epoch_230418_230515'
const accountAddress = mockFactory.injectiveAddress
const marketId = mockFactory.injUsdtSpotMarket.marketId
const dmmGrpcApi = new DmmGrpcApi('https://dmm.staging.injective.network')

describe('DmmGrpcApi', () => {
  test('fetchEpochs', async () => {
    try {
      const response = await dmmGrpcApi.fetchEpochs()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<typeof DmmGrpcTransformer.epochsResponseToEpochs>
        >(response),
      )
    } catch (e) {
      console.error('DmmGrpcApi.fetchEpochs => ' + (e as any).message)
    }
  })

  test('fetchMarketRewards', async () => {
    try {
      const response = await dmmGrpcApi.fetchMarketRewards(epochId)

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof DmmGrpcTransformer.marketRewardsResponseToMarketRewards
          >
        >(response),
      )
    } catch (e) {
      console.error('DmmGrpcApi.fetchMarketRewards => ' + (e as any).message)
    }
  })

  test('fetchEligibleAddresses', async () => {
    try {
      const response = await dmmGrpcApi.fetchEligibleAddresses({ epochId })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof DmmGrpcTransformer.eligibleAddressesResponseToEligibleAddresses
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'DmmGrpcApi.fetchEligibleAddresses => ' + (e as any).message,
      )
    }
  })

  test('fetchEpochScores', async () => {
    try {
      const response = await dmmGrpcApi.fetchEpochScores({ epochId })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<typeof DmmGrpcTransformer.epochScoresResponseToEpochScores>
        >(response),
      )
    } catch (e) {
      console.error('DmmGrpcApi.fetchEpochScores => ' + (e as any).message)
    }
  })

  test('fetchEpochScoresHistory', async () => {
    try {
      const response = await dmmGrpcApi.fetchEpochScoresHistory({
        epochId,
        accountAddress,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof DmmGrpcTransformer.epochScoresHistoryResponseToEpochScoresHistory
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'DmmGrpcApi.fetchEpochScoresHistory => ' + (e as any).message,
      )
    }
  })

  test('fetchTotalScores', async () => {
    try {
      const response = await dmmGrpcApi.fetchTotalScores({
        epochId,
        marketId,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<typeof DmmGrpcTransformer.totalScoresResponseToTotalScores>
        >(response),
      )
    } catch (e) {
      console.error('DmmGrpcApi.fetchTotalScores => ' + (e as any).message)
    }
  })

  test('fetchTotalScoresHistory', async () => {
    try {
      const response = await dmmGrpcApi.fetchTotalScoresHistory({
        epochId,
        marketId,
        accountAddress,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof DmmGrpcTransformer.totalScoresHistoryResponseToTotalScoresHistory
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'DmmGrpcApi.fetchTotalScoresHistory => ' + (e as any).message,
      )
    }
  })

  test('fetchLiquiditySnapshots', async () => {
    try {
      const response = await dmmGrpcApi.fetchLiquiditySnapshots({
        epochId,
        marketId,
        accountAddress,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof DmmGrpcTransformer.liquiditySnapshotsResponseToLiquiditySnapshots
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'DmmGrpcApi.fetchLiquiditySnapshots => ' + (e as any).message,
      )
    }
  })

  test('fetchRewardsDistribution', async () => {
    try {
      const response = await dmmGrpcApi.fetchRewardsDistribution({
        epochId,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof DmmGrpcTransformer.rewardsDistributionResponseToRewardsDistribution
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'DmmGrpcApi.fetchRewardsDistribution => ' + (e as any).message,
      )
    }
  })

  test('fetchAccountVolumes', async () => {
    try {
      const response = await dmmGrpcApi.fetchAccountVolumes({
        epochId,
        accountAddress,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof DmmGrpcTransformer.accountVolumesResponseToAccountVolumes
          >
        >(response),
      )
    } catch (e) {
      console.error('DmmGrpcApi.fetchAccountVolumes => ' + (e as any).message)
    }
  })

  test('fetchRewardsEligibility', async () => {
    try {
      const response = await dmmGrpcApi.fetchAccountVolumes({
        epochId,
        accountAddress,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof DmmGrpcTransformer.accountVolumesResponseToAccountVolumes
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'DmmGrpcApi.fetchRewardsEligibility => ' + (e as any).message,
      )
    }
  })
})
