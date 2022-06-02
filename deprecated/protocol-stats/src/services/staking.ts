import { getHttpClientFromEndpoint } from '../helpers'
import {
  PoolResponse,
  ValidatorDelegationsResponse,
  ValidatorsResponse,
} from '../types'

export const fetchPool = async (endpoint: string) => {
  const httpClient = getHttpClientFromEndpoint(endpoint)

  try {
    const response = (await httpClient.get('cosmos/staking/v1beta1/pool')) as {
      data: PoolResponse
    }

    return response.data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const fetchValidators = async ({
  status = 'BOND_STATUS_BONDED',
  endpoint,
}: {
  endpoint: string
  status?: string
}) => {
  const httpClient = getHttpClientFromEndpoint(endpoint)

  try {
    const response = (await httpClient.get(
      `cosmos/staking/v1beta1/validators?status=${status}`,
    )) as {
      data: ValidatorsResponse
    }

    return response.data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const fetchValidatorDelegations = async ({
  validatorAddress,
  endpoint,
}: {
  endpoint: string
  validatorAddress: string
}) => {
  const httpClient = getHttpClientFromEndpoint(endpoint)

  try {
    const response = (await httpClient.get(
      `cosmos/staking/v1beta1/validators/${validatorAddress}/delegations`,
    )) as {
      data: ValidatorDelegationsResponse
    }

    return response.data
  } catch (e: any) {
    throw new Error(e)
  }
}
