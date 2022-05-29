import {
  BigNumber,
  BigNumberInBase,
  BigNumberInWei,
} from '@injectivelabs/utils'
import { Change, MarketType } from '../../types'
import { getDecimalsFromNumber } from '../../utils'
import {
  UiBaseSpotMarketWithToken,
  UiSpotMarketWithToken,
  UiSpotMarketSummary,
} from './types'
import { spotOrderTypeToGrpcOrderType } from './utils'

export const spotMarketToUiSpotMarket = (
  market: UiBaseSpotMarketWithToken,
): UiSpotMarketWithToken => ({
  ...market,
  type: MarketType.Spot,
  subType: MarketType.Spot,
  priceDecimals: getDecimalsFromNumber(
    new BigNumberInWei(market.minPriceTickSize)
      .toBase(market.quoteToken.decimals - market.baseToken.decimals)
      .toNumber(),
  ),
  quantityDecimals: getDecimalsFromNumber(
    new BigNumberInBase(market.minQuantityTickSize)
      .toWei(-market.baseToken.decimals)
      .toNumber(),
  ),
})

export const spotMarketSummaryToUiMarketSummary = (
  oldSummary: UiSpotMarketSummary,
  newSummary: UiSpotMarketSummary,
): UiSpotMarketSummary => {
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

export const spotMarketsSummaryToUiMarketsSummary = (
  oldSummaries: UiSpotMarketSummary[] = [],
  newSummaries: UiSpotMarketSummary[] = [],
): UiSpotMarketSummary[] =>
  oldSummaries.map((oldSummary) => {
    const newSummary = newSummaries.find(
      (m) => m.marketId === oldSummary.marketId,
    )

    // Sometimes, chronos returns zeros
    const actualNewSummary =
      newSummary && newSummary.price ? newSummary : oldSummary

    return spotMarketSummaryToUiMarketSummary(oldSummary, actualNewSummary)
  })

export const spotMarketsSummaryComparisons = (
  newMarketSummary?: UiSpotMarketSummary[],
  oldMarketsSummary?: UiSpotMarketSummary[],
) => {
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

  return spotMarketsSummaryToUiMarketsSummary(
    marketsWithOldSummaries,
    newMarketSummary,
  )
}

export const spotMarketsToUiSpotMarkets = (
  markets: UiBaseSpotMarketWithToken[],
) => markets.map(spotMarketToUiSpotMarket)

export class SpotTransformer {
  static spotOrderTypeToGrpcOrderType = spotOrderTypeToGrpcOrderType

  static spotMarketToUiSpotMarket = spotMarketToUiSpotMarket

  static spotMarketsToUiSpotMarkets = spotMarketsToUiSpotMarkets

  static marketsSummaryToUiMarketsSummary = spotMarketsSummaryToUiMarketsSummary

  static marketSummaryToUiMarketSummary = spotMarketSummaryToUiMarketSummary

  static marketsSummaryComparisons = spotMarketsSummaryComparisons
}
