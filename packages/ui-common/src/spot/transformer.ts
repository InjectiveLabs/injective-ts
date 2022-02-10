import { BigNumberInBase, BigNumberInWei } from '@injectivelabs/utils'
import { MarketType } from '../types'
import { getDecimalsFromNumber } from '../utils'
import {
  UiBaseSpotMarketWithTokenMeta,
  UiSpotMarketWithTokenMeta,
} from './types'
import { spotOrderTypeToGrpcOrderType } from './utils'

export const spotMarketToUiSpotMarket = (
  market: UiBaseSpotMarketWithTokenMeta,
): UiSpotMarketWithTokenMeta => ({
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

export const spotMarketsToUiSpotMarkets = (
  markets: UiBaseSpotMarketWithTokenMeta[],
) => markets.map(spotMarketToUiSpotMarket)

export class SpotTransformer {
  static spotOrderTypeToGrpcOrderType = spotOrderTypeToGrpcOrderType

  static spotMarketToUiSpotMarket = spotMarketToUiSpotMarket

  static spotMarketsToUiSpotMarkets = spotMarketsToUiSpotMarkets
}
