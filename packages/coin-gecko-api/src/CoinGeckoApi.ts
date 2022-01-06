import { HttpClient } from '@injectivelabs/utils'
import { HttpException } from '@injectivelabs/exceptions'
import {
  CoinGeckoCoin,
  CoinGeckoReturnObject,
  CoinGeckoCoinResponse,
  CoinGeckoMarketChartResponse,
} from './types'

export default class CoinGeckoApi {
  private httpClient: HttpClient

  private apiKey: string

  constructor({ apiKey, baseUrl }: { apiKey: string; baseUrl: string }) {
    this.httpClient = new HttpClient(baseUrl)
    this.apiKey = apiKey
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

  async fetchCoin(id: string, params: Record<string, any> | undefined = {}) {
    try {
      const actualParams = {
        localization: false,
        community_data: false,
        tickers: false,
        sparkline: false,
        developer_data: false,
        x_cg_pro_api_key: this.apiKey,
        ...params,
      }

      return (await this.httpClient.get(
        `/coins/${id}`,
        actualParams,
      )) as CoinGeckoReturnObject<CoinGeckoCoinResponse>
    } catch (e: any) {
      throw new HttpException(e.message)
    }
  }

  async chart(id: string, params: Record<string, any> | undefined = {}) {
    try {
      const actualParams = {
        x_cg_pro_api_key: this.apiKey,
        ...params,
      }

      return (await this.httpClient.get(
        `/coins/${id}/market_chart/range`,
        actualParams,
      )) as CoinGeckoReturnObject<CoinGeckoMarketChartResponse>
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

      return (await this.httpClient.get(
        `/coins/${id}/history`,
        actualParams,
      )) as CoinGeckoReturnObject<CoinGeckoCoinResponse>
    } catch (e: any) {
      throw new HttpException(e.message)
    }
  }
}
