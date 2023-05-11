import { ChronosLeaderboardResponse } from '../types/leaderboard-rest'
import BaseRestConsumer from '../../BaseRestConsumer'
import {
  HttpRequestException,
  HttpRequestMethod,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'

/**
 * @category Indexer Chronos API
 */
export class IndexerRestLeaderboardChronosApi extends BaseRestConsumer {
  async fetchLeaderboard(resolution: string) {
    const path = ``

    try {
      const { data } = (await this.get(path, {
        resolution,
      })) as ChronosLeaderboardResponse

      return data
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}`,
        method: HttpRequestMethod.Get,
        contextModule: 'Leaderboard',
      })
    }
  }
}
