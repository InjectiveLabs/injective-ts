import {
  HttpRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import BaseRestConsumer from '../../base/BaseRestConsumer.js'
import type { CallOptions } from '../../../types/index.js'
import type { ChronosLeaderboardResponse } from '../types/leaderboard-rest.js'

/**
 * @category Indexer Chronos API
 */
export class IndexerRestLeaderboardChronosApi extends BaseRestConsumer {
  async fetchLeaderboard(resolution: string, options?: CallOptions) {
    const path = ``

    try {
      const { data } = await this.retry<ChronosLeaderboardResponse>(
        () =>
          this.get(
            path,
            {
              resolution,
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
        context: `${this.endpoint}`,
        contextModule: 'Leaderboard',
      })
    }
  }
}
