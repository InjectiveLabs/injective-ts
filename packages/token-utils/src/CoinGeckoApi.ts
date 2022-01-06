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

  private apiKey: string

  constructor({ apiKey, baseUrl }: { apiKey: string; baseUrl: string }) {
    this.httpClient = new HttpClient(baseUrl)
    this.apiKey = apiKey
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
        x_cg_pro_api_key: this.apiKey,
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
        x_cg_pro_api_key: this.apiKey,
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
        x_cg_pro_api_key: this.apiKey,
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
        x_cg_pro_api_key: this.apiKey,
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
        x_cg_pro_api_key: this.apiKey,
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
