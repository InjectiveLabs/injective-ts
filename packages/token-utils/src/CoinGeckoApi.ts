import { HttpClient } from '@injectivelabs/utils'
import { HttpException } from '@injectivelabs/exceptions'
import {
  CoinGeckoCoin,
  CoinGeckoReturnObject,
  CoinGeckoMarketChartResponse,
  CoinGeckoCoinResponse,
} from './types'

export default class CoinGeckoApi {
  private httpClient: HttpClient

  constructor({ apiKey, baseUrl }: { apiKey: string; baseUrl: string }) {
    const headers = {
      'Content-Type': 'application/json',
    } as any

    if (apiKey) {
      headers['X-Cg-Pro-Api-Key'] = apiKey
    }

    this.httpClient = new HttpClient(baseUrl).setConfig({
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
        ...options,
      }

      const { data } = (await this.httpClient.get(
        `/coins/${coinId}`,
        actualParams,
      )) as CoinGeckoReturnObject<CoinGeckoCoinResponse>

      return data
    } catch (e: any) {
      throw new HttpException(e.message)
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
        ...options,
      }

      const { data } = (await this.httpClient.get(
        `/coins/${coinId}`,
        actualParams,
      )) as CoinGeckoReturnObject<CoinGeckoCoinResponse>

      return data?.market_data?.current_price
    } catch (e: any) {
      throw new HttpException(e.message)
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
        ...options,
      }

      const { data } = (await this.httpClient.get(
        `/coins/${coinId}`,
        actualParams,
      )) as CoinGeckoReturnObject<CoinGeckoCoinResponse>

      return data?.market_data?.current_price?.usd
    } catch (e: any) {
      throw new HttpException(e.message)
    }
  }

  async fetchCoins(params: Record<string, any> | undefined = {}) {
    try {
      const actualParams = {
        include_platform: false,
        ...params,
      }

      return (await this.httpClient.get(
        '/coins/list',
        actualParams,
      )) as CoinGeckoReturnObject<CoinGeckoCoin[]>
    } catch (e: any) {
      throw new HttpException(e.message)
    }
  }

  async fetchChart(id: string, params: Record<string, any> | undefined = {}) {
    try {
      const actualParams = {
        ...params,
      }

      const { data } = (await this.httpClient.get(
        `/coins/${id}/market_chart/range`,
        actualParams,
      )) as CoinGeckoReturnObject<CoinGeckoMarketChartResponse>

      return data
    } catch (e: any) {
      throw new HttpException(e.message)
    }
  }

  async fetchHistory(id: string, params: Record<string, any> | undefined = {}) {
    try {
      const actualParams = {
        ...params,
      }

      const { data } = (await this.httpClient.get(
        `/coins/${id}/history`,
        actualParams,
      )) as CoinGeckoReturnObject<CoinGeckoCoinResponse>

      return data
    } catch (e: any) {
      throw new HttpException(e.message)
    }
  }
}
