import { HttpRestClient } from '@injectivelabs/utils'
import { HttpRequestException } from '@injectivelabs/exceptions'
import {
  CoinGeckoCoin,
  CoinGeckoReturnObject,
  CoinGeckoMarketChartResponse,
  CoinGeckoCoinResponse,
} from './types'

export default class CoinGeckoApi {
  private httpClient: HttpRestClient

  private apiKey: string

  constructor({ apiKey, baseUrl }: { apiKey: string; baseUrl: string }) {
    const headers = {
      'Content-Type': 'application/json',
    } as any

    if (apiKey) {
      headers['X-Cg-Pro-Api-Key'] = apiKey
    }

    this.apiKey = apiKey
    this.httpClient = new HttpRestClient(baseUrl, { timeout: 1500 }).setConfig({
      headers,
    })
  }

  async fetchCoin(
    coinId: string,
    options: Record<string, any> | undefined = {},
  ) {
    try {
      const actualParams = {
        localization: false,
        community_data: false,
        tickers: false,
        sparkline: false,
        developer_data: false,
        x_cg_pro_api_key: this.apiKey,
        ...options,
      }

      const { data } = (await this.httpClient.get(
        `/coins/${coinId}`,
        actualParams,
      )) as CoinGeckoReturnObject<CoinGeckoCoinResponse>

      return data
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message))
    }
  }

  async fetchErc20TokenCoinId(
    tokenAddress: string,
    options: Record<string, any> | undefined = {},
  ) {
    try {
      const actualParams = {
        x_cg_pro_api_key: this.apiKey,
        ...options,
      }

      const { data } = (await this.httpClient.get(
        `/coins/ethereum/contract/${tokenAddress}`,
        actualParams,
      )) as CoinGeckoReturnObject<CoinGeckoCoinResponse>

      return data?.id
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message))
    }
  }

  async fetchPrice(
    coinId: string,
    options: Record<string, any> | undefined = {},
  ) {
    try {
      const actualParams = {
        localization: false,
        community_data: false,
        tickers: false,
        sparkline: false,
        developer_data: false,
        x_cg_pro_api_key: this.apiKey,
        ...options,
      }

      const { data } = (await this.httpClient.get(
        `/coins/${coinId}`,
        actualParams,
      )) as CoinGeckoReturnObject<CoinGeckoCoinResponse>

      return data?.market_data?.current_price
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message))
    }
  }

  async fetchUsdPrice(
    coinId: string,
    options: Record<string, any> | undefined = {},
  ) {
    try {
      const actualParams = {
        localization: false,
        community_data: false,
        tickers: false,
        sparkline: false,
        developer_data: false,
        x_cg_pro_api_key: this.apiKey,
        ...options,
      }

      const { data } = (await this.httpClient.get(
        `/coins/${coinId}`,
        actualParams,
      )) as CoinGeckoReturnObject<CoinGeckoCoinResponse>

      return data?.market_data?.current_price?.usd
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message))
    }
  }

  async fetchCoins(params: Record<string, any> | undefined = {}) {
    try {
      const actualParams = {
        include_platform: false,
        x_cg_pro_api_key: this.apiKey,
        ...params,
      }

      return (await this.httpClient.get(
        '/coins/list',
        actualParams,
      )) as CoinGeckoReturnObject<CoinGeckoCoin[]>
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message))
    }
  }

  async fetchChart(id: string, params: Record<string, any> | undefined = {}) {
    try {
      const actualParams = {
        ...params,
        x_cg_pro_api_key: this.apiKey,
      }

      const { data } = (await this.httpClient.get(
        `/coins/${id}/market_chart/range`,
        actualParams,
      )) as CoinGeckoReturnObject<CoinGeckoMarketChartResponse>

      return data
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message))
    }
  }

  async fetchHistory(id: string, params: Record<string, any> | undefined = {}) {
    try {
      const actualParams = {
        ...params,
        x_cg_pro_api_key: this.apiKey,
      }

      const { data } = (await this.httpClient.get(
        `/coins/${id}/history`,
        actualParams,
      )) as CoinGeckoReturnObject<CoinGeckoCoinResponse>

      return data
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message))
    }
  }
}
