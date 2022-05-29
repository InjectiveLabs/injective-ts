import { BigNumber, BigNumberInBase } from '@injectivelabs/utils'
import { MarketType, Change } from '../../types'
import { getDecimalsFromNumber } from '../../utils'
import {
  UiBaseDerivativeMarketWithToken,
  UiDerivativeMarketSummary,
  UiDerivativeMarketWithToken,
} from './types'
import { derivativeOrderTypeToGrpcOrderType } from './utils'

export const derivativeMarketToUiDerivativeMarket = (
  market: UiBaseDerivativeMarketWithToken,
): UiDerivativeMarketWithToken => ({
  ...market,
  type: MarketType.Derivative,
  subType: MarketType.Perpetual,
  quantityDecimals: getDecimalsFromNumber(market.minQuantityTickSize),
  priceDecimals: getDecimalsFromNumber(
    new BigNumberInBase(market.minPriceTickSize)
      .toWei(-market.quoteToken.decimals)
      .toNumber(),
  ),
})

export const derivativeMarketSummaryToUiMarketSummary = (
  oldSummary: UiDerivativeMarketSummary,
  newSummary: UiDerivativeMarketSummary,
): UiDerivativeMarketSummary => {
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

export const derivativeMarketsSummaryToUiMarketsSummary = (
  oldSummaries: UiDerivativeMarketSummary[] = [],
  newSummaries: UiDerivativeMarketSummary[] = [],
): UiDerivativeMarketSummary[] =>
  oldSummaries.map((oldSummary) => {
    const newSummary = newSummaries.find(
      (m) => m.marketId === oldSummary.marketId,
    )

    // Sometimes, chronos returns zeros
    const actualNewSummary =
      newSummary && newSummary.price ? newSummary : oldSummary

    return derivativeMarketSummaryToUiMarketSummary(
      oldSummary,
      actualNewSummary,
    )
  })

export const derivativeMarketsSummaryComparisons = (
  newMarketSummary?: UiDerivativeMarketSummary[],
  oldMarketsSummary?: UiDerivativeMarketSummary[],
) => {
  if (!oldMarketsSummary && !newMarketSummary) {
    return undefined
  }

  if (!newMarketSummary) {
    return oldMarketsSummary as UiDerivativeMarketSummary[]
  }

  if (!oldMarketsSummary) {
    return newMarketSummary
  }

  const marketsWithOldSummaries = oldMarketsSummary.filter((market) =>
    newMarketSummary.find((m) => m.marketId === market.marketId),
  )

  return derivativeMarketsSummaryToUiMarketsSummary(
    marketsWithOldSummaries,
    newMarketSummary,
  )
}

export const derivativeMarketsToUiSpotMarkets = (
  markets: UiBaseDerivativeMarketWithToken[],
) => markets.map(derivativeMarketToUiDerivativeMarket)

export class DerivativeTransformer {
  static derivativeOrderTypeToGrpcOrderType = derivativeOrderTypeToGrpcOrderType

  static derivativeMarketToUiDerivativeMarket =
    derivativeMarketToUiDerivativeMarket

  static derivativeMarketsToUiSpotMarkets = derivativeMarketsToUiSpotMarkets

  static marketsSummaryToUiMarketsSummary =
    derivativeMarketsSummaryToUiMarketsSummary

  static marketSummaryToUiMarketSummary =
    derivativeMarketSummaryToUiMarketSummary

  static marketsSummaryComparisons = derivativeMarketsSummaryComparisons
}
