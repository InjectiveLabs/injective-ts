import {
  ChronosDerivativeMarketSummaryResponse,
  AllDerivativeMarketSummaryResponse,
} from '../types/derivatives-rest.js'
import BaseRestConsumer from '../../base/BaseRestConsumer.js'
import {
  HttpRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { IndexerModule } from '../types/index.js'

/**
 * @category Indexer Chronos API
 */
export class IndexerRestDerivativesChronosApi extends BaseRestConsumer {
  async fetchMarketSummary(marketId: string) {
    const path = `market_summary`

    try {
      const { data } = await this.retry<ChronosDerivativeMarketSummaryResponse>(
        () =>
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
        contextModule: IndexerModule.ChronosDerivative,
      })
    }
  }

  async fetchMarketsSummary() {
    const path = `market_summary_all`

    try {
      const { data } = await this.retry<AllDerivativeMarketSummaryResponse>(
        () =>
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
        contextModule: IndexerModule.ChronosDerivative,
      })
    }
  }
}
