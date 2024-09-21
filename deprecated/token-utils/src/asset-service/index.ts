import { HttpRestClient } from '@injectivelabs/utils'
import { HttpRequestException } from '@injectivelabs/exceptions'
import { CoinPriceFromInjectiveService } from './types'
import {
  CoinGeckoCoin,
  CoinGeckoCoinResponse,
  CoinGeckoMarketChartResponse,
  CoinGeckoReturnObject,
} from '../types'

export class InjectiveAssetService {
  private client: HttpRestClient

  public endpoint: string

  constructor(endpoint: string) {
    this.client = new HttpRestClient(endpoint)
    this.endpoint = endpoint
  }

  async fetchPrice(coinId: string) {
    try {
      const pricesResponse = (await this.client.get('/coins/price', {
        coinIds: coinId,
        currency: 'usd',
      })) as {
        data: {
          data: CoinPriceFromInjectiveService[]
        }
      }

      if (pricesResponse.data.data.length === 0) {
        throw new HttpRequestException(
          new Error(`The price for ${coinId} could not be fetched`),
        )
      }

      const [response] = pricesResponse.data.data

      if (!response) {
        throw new HttpRequestException(
          new Error(`The price for ${coinId} could not be fetched`),
        )
      }

      return response
    } catch (e: unknown) {
      throw new HttpRequestException(new Error((e as any).message), {
        context: `${this.endpoint}/coins/price `,
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
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message), {
        context: `${this.endpoint}/coins/${coinId}`,
        contextModule: 'asset-service',
      })
    }
  }

  async fetchCoins(params: Record<string, any> | undefined = {}) {
    try {
      return (await this.client.get(
        '/coins/list',
        params,
      )) as CoinGeckoReturnObject<CoinGeckoCoin[]>
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message), {
        context: `${this.endpoint}/coins/list`,
        contextModule: 'asset-service',
      })
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
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message), {
        context: `${this.endpoint}/coins/${id}/market_chart/range`,
        contextModule: 'asset-service',
      })
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
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message), {
        context: `${this.endpoint}/coins/${id}/history`,
        contextModule: 'asset-service',
      })
    }
  }
}
