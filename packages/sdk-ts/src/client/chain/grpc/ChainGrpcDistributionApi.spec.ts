import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { ChainGrpcDistributionApi } from './ChainGrpcDistributionApi'
import { mockFactory } from '@injectivelabs/test-utils'
import { ChainGrpcDistributionTransformer } from '../transformers'

const injectiveAddress = mockFactory.injectiveAddress
const validatorAddress = mockFactory.validatorAddress
const endpoints = getNetworkEndpoints(Network.MainnetK8s)
const chainGrpcDistributionApi = new ChainGrpcDistributionApi(endpoints.grpc)

describe('ChainGrpcDistributionApi', () => {
  test('fetchModuleParams', async () => {
    try {
      const response = await chainGrpcDistributionApi.fetchModuleParams()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcDistributionTransformer.moduleParamsResponseToModuleParams
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcDistributionApi.fetchModuleParams => ' + (e as any).message,
      )
    }
  })
  // TODO: Find an address which has Delegation
  test.skip('fetchDelegatorRewardsForValidator', async () => {
    try {
      const response =
        await chainGrpcDistributionApi.fetchDelegatorRewardsForValidator({
          delegatorAddress: injectiveAddress,
          validatorAddress,
        })
      if (response.length == 0) {
        console.warn('fetchDelegatorRewardsForValidator.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcDistributionTransformer.delegationRewardResponseToReward
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcDistributionApi.fetchDelegatorRewardsForValidator => ' +
          (e as any).message,
      )
    }
  })

  test('fetchDelegatorRewardsForValidatorNoThrow', async () => {
    try {
      const response =
        await chainGrpcDistributionApi.fetchDelegatorRewardsForValidatorNoThrow(
          {
            delegatorAddress: injectiveAddress,
            validatorAddress,
          },
        )
      if (response.length == 0) {
        console.warn('fetchDelegatorRewardsForValidatorNoThrow.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcDistributionTransformer.delegationRewardResponseToReward
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcDistributionApi.fetchDelegatorRewardsForValidatorNoThrow => ' +
          (e as any).message,
      )
    }
  })

  test('fetchDelegatorRewards', async () => {
    try {
      const response = await chainGrpcDistributionApi.fetchDelegatorRewards(
        injectiveAddress,
      )
      if (response.length == 0) {
        console.warn('fetchDelegatorRewards.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcDistributionTransformer.totalDelegationRewardResponseToTotalReward
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcDistributionApi.fetchDelegatorRewards => ' +
          (e as any).message,
      )
    }
  })

  test('fetchDelegatorRewardsNoThrow', async () => {
    try {
      const response =
        await chainGrpcDistributionApi.fetchDelegatorRewardsNoThrow(
          injectiveAddress,
        )
      if (response.length == 0) {
        console.warn('fetchDelegatorRewardsNoThrow.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcDistributionTransformer.totalDelegationRewardResponseToTotalReward
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcDistributionApi.fetchDelegatorRewardsNoThrow => ' +
          (e as any).message,
      )
    }
  })
})
