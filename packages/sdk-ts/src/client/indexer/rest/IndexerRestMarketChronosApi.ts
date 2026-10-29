import { isAbortError, throwIfAborted } from '@injectivelabs/utils'
import {
  HttpRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { IndexerModule } from '../types/index.js'
import BaseRestConsumer from '../../base/BaseRestConsumer.js'
import type { RequestOptions } from '@injectivelabs/utils'
import type { ChronosMarketHistoryResponse } from '../types/markets-history-rest.js'

export class IndexerRestMarketChronosApi extends BaseRestConsumer {
  async fetchMarketsHistory(
    {
      marketIds,
      resolution,
      countback,
    }: {
      marketIds: string[]
      resolution: string | number
      countback: string | number
    },
    options?: RequestOptions,
  ) {
    throwIfAborted(options?.signal)
    const path = `history`
    const queryMarketIds = marketIds.map((marketId) => ({
      marketIDs: marketId,
    }))

    const params = [
      ...queryMarketIds,
      { resolution: String(resolution) },
      { countback: String(countback) },
    ] as Record<string, string>[]
    const stringifiedParams = params
      .map((param) => new URLSearchParams(param))
      .join('&')
    const pathWithParams = `${path}?${stringifiedParams}`

    try {
      const { data } = await this.getWithRetry<ChronosMarketHistoryResponse>(
        pathWithParams,
        {},
        options,
      )

      return data
    } catch (e: unknown) {
      if (isAbortError(e) || e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${pathWithParams}`,
        contextModule: IndexerModule.ChronosMarkets,
      })
    }
  }
}
