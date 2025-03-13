import { mockFactory } from '@injectivelabs/utils/test-utils'
import { OLPGrpcApi } from './OLPGrpcApi.js'
import { DmmGrpcTransformer } from './transformers/index.js'

const epochId = 'epoch_230418_230515'
const accountAddress = mockFactory.injectiveAddress
const marketId = mockFactory.injUsdtSpotMarket.marketId
const dmmGrpcApi = new OLPGrpcApi('https://glp.injective.network')

describe('OLPGrpcApi', () => {
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
      console.error('OLPGrpcApi.fetchEpochs => ' + (e as any).message)
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
      console.error('OLPGrpcApi.fetchMarketRewards => ' + (e as any).message)
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
        'OLPGrpcApi.fetchEligibleAddresses => ' + (e as any).message,
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
      console.error('OLPGrpcApi.fetchEpochScores => ' + (e as any).message)
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
        'OLPGrpcApi.fetchEpochScoresHistory => ' + (e as any).message,
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
      console.error('OLPGrpcApi.fetchTotalScores => ' + (e as any).message)
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
        'OLPGrpcApi.fetchTotalScoresHistory => ' + (e as any).message,
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
        'OLPGrpcApi.fetchRewardsDistribution => ' + (e as any).message,
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
      console.error('OLPGrpcApi.fetchAccountVolumes => ' + (e as any).message)
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
        'OLPGrpcApi.fetchRewardsEligibility => ' + (e as any).message,
      )
    }
  })

  test('fetchMarketRewardsRange', async () => {
    try {
      const response = await dmmGrpcApi.fetchMarketRewardsRange({ epochId })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof DmmGrpcTransformer.marketRewardsRangeResponseToMarketRewardsRange
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'OLPGrpcApi.fetchMarketRewardsRange => ' + (e as any).message,
      )
    }
  })
})
