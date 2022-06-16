import { HttpException } from '@injectivelabs/exceptions'
import {
  ChronosBinaryOptionsMarketSummaryResponse,
  AllBinaryOptionsMarketSummaryResponse,
} from '../types/binary-options-rest'
import BaseRestConsumer from '../../BaseRestConsumer'

export class ExchangeRestBinaryOptionsChronosApi extends BaseRestConsumer {
  async fetchMarketSummary(marketId: string) {
    const path = `market_summary`

    try {
      const { data } = (await this.client.get(path, {
        marketId,
        resolution: '24h',
      })) as ChronosBinaryOptionsMarketSummaryResponse

      return data
    } catch (e: any) {
      throw new HttpException(e.response ? e.response.data.message : e.message)
    }
  }

  async fetchMarketsSummary() {
    const path = `market_summary_all`

    try {
      const { data } = (await this.client.get(path, {
        resolution: '24h',
      })) as AllBinaryOptionsMarketSummaryResponse

      return data
    } catch (e: any) {
      throw new HttpException(e.response ? e.response.data.message : e.message)
    }
  }
}
