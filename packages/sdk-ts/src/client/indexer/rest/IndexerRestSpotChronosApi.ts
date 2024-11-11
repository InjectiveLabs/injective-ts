import {
  HttpRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import {
  ChronosSpotMarketSummaryResponse,
  AllSpotMarketSummaryResponse,
} from '../types/spot-rest'
import BaseRestConsumer from '../../base/BaseRestConsumer'
import { IndexerModule } from '../types'

/**
 * @category Indexer Chronos API
 */
export class IndexerRestSpotChronosApi extends BaseRestConsumer {
  async fetchMarketSummary(marketId: string) {
    const path = `market_summary`

    try {
      const { data } = await this.retry<ChronosSpotMarketSummaryResponse>(() =>
        this.get(path, {
          marketId,
          resolution: '24h',
        }),
      )

      return data
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${path}?marketId=${marketId}`,
        contextModule: IndexerModule.ChronosSpot,
      })
    }
  }

  async fetchMarketsSummary() {
    const path = `market_summary_all`

    try {
      const { data } = await this.retry<AllSpotMarketSummaryResponse>(() =>
        this.get(path, {
          resolution: '24h',
        }),
      )

      return data
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${path}`,
        contextModule: IndexerModule.ChronosSpot,
      })
    }
  }
}
