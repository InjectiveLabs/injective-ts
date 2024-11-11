import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { ChainGrpcDistributionApi } from './ChainGrpcDistributionApi.js'
import { ChainGrpcStakingApi } from './ChainGrpcStakingApi.js'
import { ChainGrpcDistributionTransformer } from '../transformers/index.js'
import { Delegation, Validator } from '../types/index.js'

const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const chainGrpcDistributionApi = new ChainGrpcDistributionApi(endpoints.grpc)

describe('ChainGrpcDistributionApi', () => {
  let validator: Validator
  let delegation: Delegation

  beforeAll(async () => {
    return new Promise<void>(async (resolve) => {
      const chainGrpcStakingApi = new ChainGrpcStakingApi(endpoints.grpc)

      const { validators } = await chainGrpcStakingApi.fetchValidators()

      validator = validators[0]

      const { delegations } =
        await chainGrpcStakingApi.fetchValidatorDelegations({
          validatorAddress: validator.operatorAddress,
          pagination: { limit: 1 },
        })

      delegation = delegations[0]

      return resolve()
    })
  })

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

  test('fetchDelegatorRewardsForValidator', async () => {
    try {
      const response =
        await chainGrpcDistributionApi.fetchDelegatorRewardsForValidator({
          delegatorAddress: delegation.delegation.delegatorAddress,
          validatorAddress: validator.operatorAddress,
        })

      if (response.length === 0) {
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
            delegatorAddress: delegation.delegation.delegatorAddress,
            validatorAddress: validator.operatorAddress,
          },
        )

      if (response.length === 0) {
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
        delegation.delegation.delegatorAddress,
      )

      if (response.length === 0) {
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
          delegation.delegation.delegatorAddress,
        )

      if (response.length === 0) {
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
