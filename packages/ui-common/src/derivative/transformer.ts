import { BigNumberInBase } from '@injectivelabs/utils'
import { MarketType } from '../types'
import { getDecimalsFromNumber } from '../utils'
import {
  UiBaseDerivativeMarketWithTokenMeta,
  UiDerivativeMarketWithTokenMeta,
} from './types'
import { derivativeOrderTypeToGrpcOrderType } from './utils'

export const derivativeMarketToUiDerivativeMarket = (
  market: UiBaseDerivativeMarketWithTokenMeta,
): UiDerivativeMarketWithTokenMeta => ({
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

export const derivativeMarketsToUiSpotMarkets = (
  markets: UiBaseDerivativeMarketWithTokenMeta[],
) => markets.map(derivativeMarketToUiDerivativeMarket)

export class DerivativeTransformer {
  static derivativeOrderTypeToGrpcOrderType = derivativeOrderTypeToGrpcOrderType

  static derivativeMarketToUiDerivativeMarket =
    derivativeMarketToUiDerivativeMarket

  static derivativeMarketsToUiSpotMarkets = derivativeMarketsToUiSpotMarkets
}
