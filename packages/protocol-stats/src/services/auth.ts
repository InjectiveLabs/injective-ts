import { getHttpClientFromEndpoint } from '../helpers'
import { AccountsResponse } from '../types'

export const fetchAccounts = async (endpoint: string) => {
  const httpClient = getHttpClientFromEndpoint(endpoint)

  try {
    const response = (await httpClient.get('cosmos/auth/v1beta1/accounts')) as {
      data: AccountsResponse
    }

    return response.data
  } catch (e: any) {
    throw new Error(e)
  }
}
