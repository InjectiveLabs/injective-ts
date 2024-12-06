import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { ChainGrpcStakingApi } from './ChainGrpcStakingApi.js'
import { mockFactory } from '@injectivelabs/utils/test-utils'
import { ChainGrpcStakingTransformer } from '../transformers/index.js'
import { Delegation, Validator } from '../types/index.js'

const injectiveAddress = mockFactory.injectiveAddress
const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const chainGrpcStakingApi = new ChainGrpcStakingApi(endpoints.grpc)

describe('ChainGrpcStakingApi', () => {
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
      const response = await chainGrpcStakingApi.fetchModuleParams()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.moduleParamsResponseToModuleParams
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcStakingApi.fetchModuleParams => ' + (e as any).message,
      )
    }
  })

  test('fetchPool', async () => {
    try {
      const response = await chainGrpcStakingApi.fetchPool()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<typeof ChainGrpcStakingTransformer.poolResponseToPool>
        >(response),
      )
    } catch (e) {
      console.error('ChainGrpcStakingApi.fetchPool => ' + (e as any).message)
    }
  })

  test('fetchValidators', async () => {
    try {
      const response = await chainGrpcStakingApi.fetchValidators()

      if (response.validators.length === 0) {
        console.warn('fetchValidators.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.validatorsResponseToValidators
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcStakingApi.fetchValidators => ' + (e as any).message,
      )
    }
  })

  test('fetchValidator', async () => {
    try {
      const response = await chainGrpcStakingApi.fetchValidator(
        validator.operatorAddress,
      )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.validatorResponseToValidator
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcStakingApi.fetchValidator => ' + (e as any).message,
      )
    }
  })

  test('fetchValidatorDelegations', async () => {
    try {
      const response = await chainGrpcStakingApi.fetchValidatorDelegations({
        validatorAddress: validator.operatorAddress,
        pagination: {
          limit: 1,
        },
      })

      if (response.delegations.length === 0) {
        console.warn('fetchValidatorDelegations.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.delegationsResponseToDelegations
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcStakingApi.fetchValidatorDelegations => ' +
          (e as any).message,
      )
    }
  })

  test('fetchValidatorDelegationsNoThrow', async () => {
    try {
      const response =
        await chainGrpcStakingApi.fetchValidatorDelegationsNoThrow({
          validatorAddress: validator.operatorAddress,
          pagination: {
            limit: 1,
          },
        })

      if (response.delegations.length === 0) {
        console.warn('fetchValidatorDelegationsNoThrow.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.delegationsResponseToDelegations
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcStakingApi.fetchValidatorDelegationsNoThrow => ' +
          (e as any).message,
      )
    }
  })

  test('fetchValidatorUnbondingDelegations', async () => {
    try {
      const response =
        await chainGrpcStakingApi.fetchValidatorUnbondingDelegations({
          validatorAddress: validator.operatorAddress,
          pagination: {
            limit: 1,
          },
        })

      if (response.unbondingDelegations.length === 0) {
        console.warn('fetchValidatorUnbondingDelegations.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.unBondingDelegationsResponseToUnBondingDelegations
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcStakingApi.fetchValidatorUnbondingDelegations => ' +
          (e as any).message,
      )
    }
  })

  test('fetchValidatorUnbondingDelegationsNoThrow', async () => {
    try {
      const response =
        await chainGrpcStakingApi.fetchValidatorUnbondingDelegationsNoThrow({
          validatorAddress: validator.operatorAddress,
          pagination: {
            limit: 1,
          },
        })

      if (response.unbondingDelegations.length === 0) {
        console.warn('fetchValidatorUnbondingDelegationsNoThrow.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.unBondingDelegationsResponseToUnBondingDelegations
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcStakingApi.fetchValidatorUnbondingDelegationsNoThrow => ' +
          (e as any).message,
      )
    }
  })

  test.skip('fetchDelegation', async () => {
    try {
      const response = await chainGrpcStakingApi.fetchDelegation({
        injectiveAddress: delegation.delegation.delegatorAddress,
        validatorAddress: validator.operatorAddress,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.delegationResponseToDelegation
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcStakingApi.fetchDelegation => ' + (e as any).message,
      )
    }
  })

  test('fetchDelegations', async () => {
    try {
      const response = await chainGrpcStakingApi.fetchDelegations({
        injectiveAddress: delegation.delegation.delegatorAddress,
        pagination: {
          limit: 1,
        },
      })

      if (response.delegations.length === 0) {
        console.warn('fetchDelegations.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.delegationsResponseToDelegations
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcStakingApi.fetchDelegations => ' + (e as any).message,
      )
    }
  })

  test('fetchDelegationsNoThrow', async () => {
    try {
      const response = await chainGrpcStakingApi.fetchDelegationsNoThrow({
        injectiveAddress: delegation.delegation.delegatorAddress,
        pagination: {
          limit: 1,
        },
      })

      if (response.delegations.length === 0) {
        console.warn('fetchDelegationsNoThrow.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.delegationsResponseToDelegations
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcStakingApi.fetchDelegationsNoThrow => ' + (e as any).message,
      )
    }
  })

  test('fetchDelegators', async () => {
    try {
      const response = await chainGrpcStakingApi.fetchDelegators({
        validatorAddress: validator.operatorAddress,
        pagination: {
          limit: 1,
        },
      })

      if (response.delegations.length === 0) {
        console.warn('fetchDelegators.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.delegationsResponseToDelegations
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcStakingApi.fetchDelegators => ' + (e as any).message,
      )
    }
  })

  test('fetchDelegatorsNoThrow', async () => {
    try {
      const response = await chainGrpcStakingApi.fetchDelegatorsNoThrow({
        validatorAddress: validator.operatorAddress,
        pagination: {
          limit: 1,
        },
      })

      if (response.delegations.length === 0) {
        console.warn('fetchDelegatorsNoThrow.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.delegationsResponseToDelegations
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcStakingApi.fetchDelegatorsNoThrow => ' + (e as any).message,
      )
    }
  })

  test('fetchUnbondingDelegations', async () => {
    try {
      const response = await chainGrpcStakingApi.fetchUnbondingDelegations({
        injectiveAddress,
        pagination: {
          limit: 1,
        },
      })

      if (response.unbondingDelegations.length === 0) {
        console.warn('fetchUnbondingDelegations.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.unBondingDelegationsResponseToUnBondingDelegations
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcStakingApi.fetchUnbondingDelegations => ' +
          (e as any).message,
      )
    }
  })

  test('fetchUnbondingDelegationsNoThrow', async () => {
    try {
      const response =
        await chainGrpcStakingApi.fetchUnbondingDelegationsNoThrow({
          injectiveAddress,
          pagination: {
            limit: 1,
          },
        })

      if (response.unbondingDelegations.length === 0) {
        console.warn('fetchUnbondingDelegationsNoThrow.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.unBondingDelegationsResponseToUnBondingDelegations
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcStakingApi.fetchUnbondingDelegationsNoThrow => ' +
          (e as any).message,
      )
    }
  })

  test('fetchReDelegations', async () => {
    try {
      const response = await chainGrpcStakingApi.fetchReDelegations({
        injectiveAddress,
        pagination: {
          limit: 1,
        },
      })

      if (response.redelegations.length === 0) {
        console.warn('fetchReDelegations.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.reDelegationsResponseToReDelegations
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcStakingApi.fetchReDelegations => ' + (e as any).message,
      )
    }
  })

  test('fetchReDelegationsNoThrow', async () => {
    try {
      const response = await chainGrpcStakingApi.fetchReDelegationsNoThrow({
        injectiveAddress,
        pagination: {
          limit: 1,
        },
      })

      if (response.redelegations.length === 0) {
        console.warn('fetchReDelegationsNoThrow.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.reDelegationsResponseToReDelegations
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'ChainGrpcStakingApi.fetchReDelegationsNoThrow => ' +
          (e as any).message,
      )
    }
  })
})
