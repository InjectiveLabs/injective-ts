import { HttpClient } from '@injectivelabs/utils'
import { HttpException } from '@injectivelabs/exceptions'
import {
  ChronosDerivativeMarketSummaryResponse,
  AllDerivativeMarketSummaryResponse,
} from '../types'

export class DerivativeMarketChronosConsumer {
  private client: HttpClient

  constructor(endpoint: string) {
    this.client = new HttpClient(endpoint)
  }

  async fetchDerivativeMarketSummary(marketId: string) {
    const endpoint = `chronos/v1/derivative/market_summary`

    try {
      const { data } = (await this.client.get(endpoint, {
        marketId,
        resolution: '24h',
      })) as ChronosDerivativeMarketSummaryResponse

      return data
    } catch (e: any) {
      throw new HttpException(e.response ? e.response.data.message : e.message)
    }
  }

  async fetchDerivativeMarketsSummary() {
    const endpoint = `chronos/v1/derivative/market_summary_all`

    try {
      const { data } = (await this.client.get(endpoint, {
        resolution: '24h',
      })) as AllDerivativeMarketSummaryResponse

      return data
    } catch (e: any) {
      throw new HttpException(e.response ? e.response.data.message : e.message)
    }
  }
}
