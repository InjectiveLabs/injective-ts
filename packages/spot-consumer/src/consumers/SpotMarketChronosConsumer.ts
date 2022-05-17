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
    const path = `market_summary`

    try {
      const { data } = (await this.client.get(path, {
        marketId,
        resolution: '24h',
      })) as ChronosSpotMarketSummaryResponse

      return data
    } catch (e: any) {
      throw new HttpException(e.response ? e.response.data.message : e.message)
    }
  }

  async fetchSpotMarketsSummary() {
    const path = `market_summary_all`

    try {
      const { data } = (await this.client.get(path, {
        resolution: '24h',
      })) as AllSpotMarketSummaryResponse

      return data
    } catch (e: any) {
      throw new HttpException(e.response ? e.response.data.message : e.message)
    }
  }
}
