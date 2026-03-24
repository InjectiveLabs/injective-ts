import {
  HttpRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { IndexerModule } from '../types/index.js'
import BaseRestConsumer from '../../base/BaseRestConsumer.js'
import type { CallOptions } from '../../../types/index.js'
import type {
  AllDerivativeMarketSummaryResponse,
  ChronosDerivativeMarketSummaryResponse,
} from '../types/derivatives-rest.js'

/**
 * @category Indexer Chronos API
 */
export class IndexerRestDerivativesChronosApi extends BaseRestConsumer {
  async fetchMarketSummary(marketId: string, options?: CallOptions) {
    const path = `market_summary`

    try {
      const { data } = await this.retry<ChronosDerivativeMarketSummaryResponse>(
        () =>
          this.get(
            path,
            {
              marketId,
              resolution: '24h',
            },
            options?.signal,
          ),
        3,
        1000,
        options?.signal,
      )

      return data
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${path}?marketId=${marketId}`,
        contextModule: IndexerModule.ChronosDerivative,
      })
    }
  }

  async fetchMarketsSummary(options?: CallOptions) {
    const path = `market_summary_all`

    try {
      const { data } = await this.retry<AllDerivativeMarketSummaryResponse>(
        () =>
          this.get(
            path,
            {
              resolution: '24h',
            },
            options?.signal,
          ),
        3,
        1000,
        options?.signal,
      )

      return data
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
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
