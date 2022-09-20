import {
  HttpRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import {
  ChronosSpotMarketSummaryResponse,
  AllSpotMarketSummaryResponse,
} from '../types/spot-rest'
import BaseRestConsumer from '../../BaseRestConsumer'
import { IndexerModule } from '../types'

/**
 * @category Indexer Chronos API
 */
export class IndexerRestSpotChronosApi extends BaseRestConsumer {
  async fetchMarketSummary(marketId: string) {
    const path = `market_summary`

    try {
      const { data } = (await this.get(path, {
        marketId,
        resolution: '24h',
      })) as ChronosSpotMarketSummaryResponse

      return data
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        contextModule: IndexerModule.ChronosSpot,
      })
    }
  }

  async fetchMarketsSummary() {
    const path = `market_summary_all`

    try {
      const { data } = (await this.get(path, {
        resolution: '24h',
      })) as AllSpotMarketSummaryResponse

      return data
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        contextModule: IndexerModule.ChronosSpot,
      })
    }
  }
}
