import { getHttpClientFromEndpoint } from '../helpers'
import { SupplyResponse } from '../types'

export const fetchSupply = async (endpoint: string) => {
  const httpClient = getHttpClientFromEndpoint(endpoint)

  try {
    const response = (await httpClient.get('cosmos/bank/v1beta1/supply')) as {
      data: SupplyResponse
    }

    return response.data
  } catch (e: any) {
    throw new Error(e)
  }
}
