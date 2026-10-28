import { isAbortError, throwIfAborted } from '@injectivelabs/utils'
import {
  HttpRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { IndexerModule } from '../types/index.js'
import BaseRestConsumer from '../../base/BaseRestConsumer.js'
import type { RequestOptions } from '@injectivelabs/utils'
import type {
  AllDerivativeMarketSummaryResponse,
  ChronosDerivativeMarketSummaryResponse,
} from '../types/derivatives-rest.js'

/**
 * @category Indexer Chronos API
 */
export class IndexerRestDerivativesChronosApi extends BaseRestConsumer {
  async fetchMarketSummary(marketId: string, options?: RequestOptions) {
    throwIfAborted(options?.signal)
    const path = `market_summary`

    try {
      const { data } = await this.retry<ChronosDerivativeMarketSummaryResponse>(
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
        contextModule: IndexerModule.ChronosDerivative,
      })
    }
  }

  async fetchMarketsSummary(options?: RequestOptions) {
    throwIfAborted(options?.signal)
    const path = `market_summary_all`

    try {
      const { data } = await this.retry<AllDerivativeMarketSummaryResponse>(
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
        contextModule: IndexerModule.ChronosDerivative,
      })
    }
  }
}
