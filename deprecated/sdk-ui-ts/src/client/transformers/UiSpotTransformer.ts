import { BigNumber } from '@injectivelabs/utils'
import { Change, MarketType } from '../types/common'
import {
  getSpotMarketTensMultiplier,
  getSpotMarketDecimals,
} from '@injectivelabs/sdk-ts'
import {
  UiBaseSpotMarketWithToken,
  UiSpotMarketWithToken,
  UiSpotMarketSummary,
} from '../types/spot'
import { orderSideToOrderType } from '../../utils/exchange'

export class UiSpotTransformer {
  static orderSideToOrderType = orderSideToOrderType

  static spotMarketToUiSpotMarket(
    market: UiBaseSpotMarketWithToken,
  ): UiSpotMarketWithToken {
    return {
      ...market,
      type: MarketType.Spot,
      subType: MarketType.Spot,
      ...getSpotMarketDecimals({
        minPriceTickSize: market.minPriceTickSize,
        minQuantityTickSize: market.minQuantityTickSize,
        baseDecimals: market.baseToken.decimals,
        quoteDecimals: market.quoteToken.decimals,
      }),
      ...getSpotMarketTensMultiplier({
        minPriceTickSize: market.minPriceTickSize,
        minQuantityTickSize: market.minQuantityTickSize,
        baseDecimals: market.baseToken.decimals,
        quoteDecimals: market.quoteToken.decimals,
      }),
    }
  }

  static spotMarketSummaryToUiMarketSummary(
    oldSummary: UiSpotMarketSummary,
    newSummary: UiSpotMarketSummary,
  ): UiSpotMarketSummary {
    if (new BigNumber(oldSummary.price).eq(newSummary.price)) {
      return {
        ...newSummary,
        lastPrice: oldSummary.price,
        lastPriceChange: oldSummary.lastPriceChange || Change.NoChange,
      }
    }

    return {
      ...newSummary,
      lastPrice: oldSummary.price,
      lastPriceChange: new BigNumber(newSummary.price).gte(oldSummary.price)
        ? Change.Increase
        : Change.Decrease,
    }
  }

  static spotMarketsSummaryToUiMarketsSummary(
    oldSummaries: UiSpotMarketSummary[] = [],
    newSummaries: UiSpotMarketSummary[] = [],
  ): UiSpotMarketSummary[] {
    return oldSummaries.map((oldSummary) => {
      const newSummary = newSummaries.find(
        (m) => m.marketId === oldSummary.marketId,
      )

      // Sometimes, chronos returns zeros
      const actualNewSummary =
        newSummary && newSummary.price ? newSummary : oldSummary

      return UiSpotTransformer.spotMarketSummaryToUiMarketSummary(
        oldSummary,
        actualNewSummary,
      )
    })
  }

  static spotMarketsSummaryComparisons(
    newMarketSummary?: UiSpotMarketSummary[],
    oldMarketsSummary?: UiSpotMarketSummary[],
  ) {
    if (!oldMarketsSummary && !newMarketSummary) {
      return undefined
    }

    if (!newMarketSummary) {
      return oldMarketsSummary as UiSpotMarketSummary[]
    }

    if (!oldMarketsSummary) {
      return newMarketSummary
    }

    const marketsWithOldSummaries = oldMarketsSummary.filter((market) =>
      newMarketSummary.find((m) => m.marketId === market.marketId),
    )

    return UiSpotTransformer.spotMarketsSummaryToUiMarketsSummary(
      marketsWithOldSummaries,
      newMarketSummary,
    )
  }

  static spotMarketsToUiSpotMarkets(markets: UiBaseSpotMarketWithToken[]) {
    return markets.map(UiSpotTransformer.spotMarketToUiSpotMarket)
  }
}
