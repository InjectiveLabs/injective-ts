import { isAbortError, throwIfAborted } from '@injectivelabs/utils'
import {
  HttpRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import BaseRestConsumer from '../../base/BaseRestConsumer.js'
import type { RequestOptions } from '@injectivelabs/utils'
import type { ChronosLeaderboardResponse } from '../types/leaderboard-rest.js'

/**
 * @category Indexer Chronos API
 */
export class IndexerRestLeaderboardChronosApi extends BaseRestConsumer {
  async fetchLeaderboard(resolution: string, options?: RequestOptions) {
    throwIfAborted(options?.signal)
    const path = ``

    try {
      const { data } = await this.retry<ChronosLeaderboardResponse>(
        (requestConfig) =>
          this.get(
            path,
            {
              resolution,
            },
            requestConfig,
          ),
        undefined,
        undefined,
        options,
      )

      return data
    } catch (e: unknown) {
      if (isAbortError(e) || e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}`,
        contextModule: 'Leaderboard',
      })
    }
  }
}
