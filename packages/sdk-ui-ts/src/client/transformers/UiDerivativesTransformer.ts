import { BigNumber, BigNumberInBase } from '@injectivelabs/utils'
import { MarketType, Change } from '../types/common'
import { getDecimalsFromNumber } from '@injectivelabs/sdk-ts'
import {
  UiBaseDerivativeMarketWithToken,
  UiDerivativeMarketSummary,
  UiDerivativeMarketWithToken,
} from '../types/derivatives'
import { derivativeOrderTypeToGrpcOrderType } from '../../utils/derivatives'

export class UiDerivativeTransformer {
  static derivativeOrderTypeToGrpcOrderType = derivativeOrderTypeToGrpcOrderType

  static derivativeMarketToUiDerivativeMarket(
    market: UiBaseDerivativeMarketWithToken,
  ): UiDerivativeMarketWithToken {
    return {
      ...market,
      type: MarketType.Derivative,
      subType: MarketType.Perpetual,
      quantityDecimals: getDecimalsFromNumber(market.minQuantityTickSize),
      priceDecimals: getDecimalsFromNumber(
        new BigNumberInBase(market.minPriceTickSize)
          .toWei(-market.quoteToken.decimals)
          .toNumber(),
      ),
    }
  }

  static derivativeMarketSummaryToUiMarketSummary(
    oldSummary: UiDerivativeMarketSummary,
    newSummary: UiDerivativeMarketSummary,
  ): UiDerivativeMarketSummary {
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

  static derivativeMarketsSummaryToUiMarketsSummary(
    oldSummaries: UiDerivativeMarketSummary[] = [],
    newSummaries: UiDerivativeMarketSummary[] = [],
  ): UiDerivativeMarketSummary[] {
    return oldSummaries.map((oldSummary) => {
      const newSummary = newSummaries.find(
        (m) => m.marketId === oldSummary.marketId,
      )

      // Sometimes, chronos returns zeros
      const actualNewSummary =
        newSummary && newSummary.price ? newSummary : oldSummary

      return UiDerivativeTransformer.derivativeMarketSummaryToUiMarketSummary(
        oldSummary,
        actualNewSummary,
      )
    })
  }

  static derivativeMarketsSummaryComparisons(
    newMarketSummary?: UiDerivativeMarketSummary[],
    oldMarketsSummary?: UiDerivativeMarketSummary[],
  ) {
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

    return UiDerivativeTransformer.derivativeMarketsSummaryToUiMarketsSummary(
      marketsWithOldSummaries,
      newMarketSummary,
    )
  }

  static derivativeMarketsToUiSpotMarkets(
    markets: UiBaseDerivativeMarketWithToken[],
  ) {
    return markets.map(
      UiDerivativeTransformer.derivativeMarketToUiDerivativeMarket,
    )
  }
}
