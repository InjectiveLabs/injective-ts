import { AllChronosMarketHistory } from '@injectivelabs/sdk-ts'
import { UiMarketsHistory } from '../types/markets-history-rest'
export class UiMarketsHistoryTransformer {
  static marketsHistoryToUiMarketsHistory(
    marketsHistory: AllChronosMarketHistory[],
  ): UiMarketsHistory[] {
    return marketsHistory.map((m) => {
      return {
        marketId: m.marketID,
        resolution: m.resolution,
        time: m.t,
        volume: m.v,
        closePrice: m.c,
        highPrice: m.h,
        lowPrice: m.l,
        openPrice: m.o,
      }
    })
  }
}
