import { isAbortError, throwIfAborted } from '@injectivelabs/utils'
import {
  HttpRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { IndexerModule } from '../types/index.js'
import BaseRestConsumer from '../../base/BaseRestConsumer.js'
import type { RequestOptions } from '@injectivelabs/utils'
import type {
  AllSpotMarketSummaryResponse,
  ChronosSpotMarketSummaryResponse,
} from '../types/spot-rest.js'

/**
 * @category Indexer Chronos API
 */
export class IndexerRestSpotChronosApi extends BaseRestConsumer {
  async fetchMarketSummary(marketId: string, options?: RequestOptions) {
    throwIfAborted(options?.signal)
    const path = `market_summary`

    try {
      const { data } = await this.retry<ChronosSpotMarketSummaryResponse>(
        (requestConfig) =>
          this.get(
            path,
            {
              marketId,
              resolution: '24h',
            },
            requestConfig,
          ),
        options,
      )

      return data
    } catch (e: unknown) {
      if (isAbortError(e) || e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${path}?marketId=${marketId}`,
        contextModule: IndexerModule.ChronosSpot,
      })
    }
  }

  async fetchMarketsSummary(options?: RequestOptions) {
    throwIfAborted(options?.signal)
    const path = `market_summary_all`

    try {
      const { data } = await this.retry<AllSpotMarketSummaryResponse>(
        (requestConfig) =>
          this.get(
            path,
            {
              resolution: '24h',
            },
            requestConfig,
          ),
        options,
      )

      return data
    } catch (e: unknown) {
      if (isAbortError(e) || e instanceof HttpRequestException) {
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
