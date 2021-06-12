import { HttpClient } from '@injectivelabs/utils'
import { HttpException } from '@injectivelabs/exceptions'
import {
  ChronosSpotMarketSummaryResponse,
  AllSpotMarketSummaryResponse,
} from '../types'

export class SpotMarketChronosConsumer {
  private client: HttpClient

  constructor(endpoint: string) {
    this.client = new HttpClient(endpoint)
  }

  async fetchSpotMarketSummary(marketId: string) {
    const endpoint = `chronos/v1/spot/market_summary`

    try {
      const { data } = (await this.client.get(endpoint, {
        marketId,
        resolution: '24h',
      })) as ChronosSpotMarketSummaryResponse

      return data
    } catch (error) {
      throw new HttpException(
        error.response ? error.response.data.message : error.message,
      )
    }
  }

  async fetchSpotMarketsSummary() {
    const endpoint = `chronos/v1/spot/market_summary_all`

    try {
      const { data } = (await this.client.get(endpoint, {
        resolution: '24h',
      })) as AllSpotMarketSummaryResponse

      return data
    } catch (error) {
      throw new HttpException(
        error.response ? error.response.data.message : error.message,
      )
    }
  }
}
