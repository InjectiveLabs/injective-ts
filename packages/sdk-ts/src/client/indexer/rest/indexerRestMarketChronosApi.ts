import { HttpException } from '@injectivelabs/exceptions'
import BaseRestConsumer from '../../BaseRestConsumer'
import { ChronosMarketHistoryResponse } from '../types/markets-history-rest'

export class IndexerRestMarketChronosApi extends BaseRestConsumer {
  async fetchMarketsHistory({
    marketIds,
    resolution,
    countback,
  }: {
    marketIds: string[]
    resolution: string | number
    countback: string | number
  }) {
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
      const { data } = (await this.client.get(
        pathWithParams,
      )) as ChronosMarketHistoryResponse

      return data
    } catch (e: any) {
      throw new HttpException(e.response ? e.response.data.message : e.message)
    }
  }
}
