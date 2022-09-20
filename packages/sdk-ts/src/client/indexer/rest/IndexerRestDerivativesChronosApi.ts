import {
  ChronosDerivativeMarketSummaryResponse,
  AllDerivativeMarketSummaryResponse,
} from '../types/derivatives-rest'
import BaseRestConsumer from '../../BaseRestConsumer'
import {
  HttpRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'

/**
 * @category Indexer Chronos API
 */
export class IndexerRestDerivativesChronosApi extends BaseRestConsumer {
  async fetchMarketSummary(marketId: string) {
    const path = `market_summary`

    try {
      const { data } = (await this.get(path, {
        marketId,
        resolution: '24h',
      })) as ChronosDerivativeMarketSummaryResponse

      return data
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        contextModule: 'GET',
      })
    }
  }

  async fetchMarketsSummary() {
    const path = `market_summary_all`

    try {
      const { data } = (await this.get(path, {
        resolution: '24h',
      })) as AllDerivativeMarketSummaryResponse

      return data
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        contextModule: 'GET',
      })
    }
  }
}
