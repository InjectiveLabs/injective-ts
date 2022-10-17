import { HttpClient } from '@injectivelabs/utils'
import { HttpRequestException } from '@injectivelabs/exceptions'
import { CoinPriceFromInjectiveService } from './types'
import {
  CoinGeckoCoin,
  CoinGeckoCoinResponse,
  CoinGeckoMarketChartResponse,
  CoinGeckoReturnObject,
} from '../types'

export class InjectiveAssetService {
  private client: HttpClient

  constructor(endpoint: string) {
    this.client = new HttpClient(endpoint)
  }

  async fetchPrice(coinId: string) {
    try {
      const pricesResponse = (await this.client.get('price', {
        coinIds: coinId,
        currency: 'usd',
      })) as {
        data: {
          data: CoinPriceFromInjectiveService[]
        }
      }

      return pricesResponse.data.data
    } catch (e: unknown) {
      throw new HttpRequestException(new Error((e as any).message), {
        contextModule: 'asset-service',
      })
    }
  }

  async fetchCoin(
    coinId: string,
    options: Record<string, any> | undefined = {},
  ) {
    try {
      const { data } = (await this.client.get(
        `/coins/${coinId}`,
        options,
      )) as CoinGeckoReturnObject<CoinGeckoCoinResponse>

      return data
    } catch (e: unknown) {
      throw new HttpRequestException(new Error((e as any).message))
    }
  }

  async fetchCoins(params: Record<string, any> | undefined = {}) {
    try {
      return (await this.client.get(
        '/coins/list',
        params,
      )) as CoinGeckoReturnObject<CoinGeckoCoin[]>
    } catch (e: unknown) {
      throw new HttpRequestException(new Error((e as any).message))
    }
  }

  async fetchChart(id: string, params: Record<string, any> | undefined = {}) {
    try {
      const { data } = (await this.client.get(
        `/coins/${id}/market_chart/range`,
        params,
      )) as CoinGeckoReturnObject<CoinGeckoMarketChartResponse>

      return data
    } catch (e: unknown) {
      throw new HttpRequestException(new Error((e as any).message))
    }
  }

  async fetchHistory(id: string, params: Record<string, any> | undefined = {}) {
    try {
      const { data } = (await this.client.get(
        `/coins/${id}/history`,
        params,
      )) as CoinGeckoReturnObject<CoinGeckoCoinResponse>

      return data
    } catch (e: unknown) {
      throw new HttpRequestException(new Error((e as any).message))
    }
  }
}
