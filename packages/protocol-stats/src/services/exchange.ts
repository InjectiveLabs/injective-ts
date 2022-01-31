import { getHttpClientFromEndpoint } from '../helpers'
import {
  DerivativeMarketPositionsResponse,
  DerivativeMarketsResponse,
  SubaccountDepositsResponse,
} from '../types'

export const fetchExchangeModuleState = async (endpoint: string) => {
  const httpClient = getHttpClientFromEndpoint(endpoint)

  try {
    const response = (await httpClient.get(
      'injective/exchange/v1beta1/module_state',
    )) as {
      data: {
        state: any
      }
    }

    return response.data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const fetchSubaccountBalances = async ({
  subaccountId,
  endpoint,
}: {
  subaccountId: string
  endpoint: string
}) => {
  const httpClient = getHttpClientFromEndpoint(endpoint)

  try {
    const response = (await httpClient.get(
      `injective/exchange/v1beta1/exchange/subaccountDeposits?subaccount_id=${subaccountId}`,
    )) as {
      data: SubaccountDepositsResponse
    }

    return response.data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const fetchDerivativesMarkets = async ({
  status = 'Active',
  endpoint,
}: {
  endpoint: string
  status?: string
}) => {
  const httpClient = getHttpClientFromEndpoint(endpoint)

  try {
    const response = (await httpClient.get(
      `injective/exchange/v1beta1/derivative/markets?status=${status}`,
    )) as {
      data: DerivativeMarketsResponse
    }

    return response.data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const fetchPositions = async (endpoint: string) => {
  const httpClient = getHttpClientFromEndpoint(endpoint)

  try {
    const response = (await httpClient.get(
      `https://lcd.injective.network/injective/exchange/v1beta1/positions`,
    )) as {
      data: DerivativeMarketPositionsResponse
    }

    return response.data
  } catch (e: any) {
    throw new Error(e)
  }
}
