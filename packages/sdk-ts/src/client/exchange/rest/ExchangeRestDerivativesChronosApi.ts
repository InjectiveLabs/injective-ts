import { HttpException } from '@injectivelabs/exceptions'
import {
  ChronosDerivativeMarketSummaryResponse,
  AllDerivativeMarketSummaryResponse,
} from '../types/derivatives-rest'
import BaseRestConsumer from '../../BaseRestConsumer'

/**
 * @category Exchange Chronos API
 */
export class ExchangeRestDerivativesChronosApi extends BaseRestConsumer {
  async fetchMarketSummary(marketId: string) {
    const path = `market_summary`

    try {
      const { data } = (await this.client.get(path, {
        marketId,
        resolution: '24h',
      })) as ChronosDerivativeMarketSummaryResponse

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
      })) as AllDerivativeMarketSummaryResponse

      return data
    } catch (e: any) {
      throw new HttpException(e.response ? e.response.data.message : e.message)
    }
  }
}
