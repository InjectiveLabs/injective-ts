import { BigNumber } from '@injectivelabs/utils'
import { getExactDecimalsFromNumber, getTensMultiplier } from './numbers.js'

export const getDerivativeMarketTensMultiplier = ({
  quoteDecimals,
  minPriceTickSize,
  minQuantityTickSize,
}: {
  minPriceTickSize: number | string
  minQuantityTickSize: number | string
  quoteDecimals: number
}) => {
  return {
    quantityTensMultiplier: getTensMultiplier(minQuantityTickSize),
    priceTensMultiplier: getTensMultiplier(
      new BigNumber(minPriceTickSize).shiftedBy(-quoteDecimals).toFixed(),
    ),
  }
}

export const getSpotMarketTensMultiplier = ({
  baseDecimals,
  quoteDecimals,
  minPriceTickSize,
  minQuantityTickSize,
}: {
  minPriceTickSize: number | string
  minQuantityTickSize: number | string
  baseDecimals: number
  quoteDecimals: number
}) => {
  return {
    priceTensMultiplier: getTensMultiplier(
      new BigNumber(minPriceTickSize)
        .shiftedBy(baseDecimals - quoteDecimals)
        .toFixed(),
    ),
    quantityTensMultiplier: getTensMultiplier(
      new BigNumber(minQuantityTickSize).shiftedBy(-baseDecimals).toFixed(),
    ),
  }
}

export const getDerivativeMarketDecimals = ({
  minPriceTickSize,
  minQuantityTickSize,
  quoteDecimals,
}: {
  minPriceTickSize: number | string
  minQuantityTickSize: number | string
  quoteDecimals: number
}) => {
  return {
    quantityDecimals: getExactDecimalsFromNumber(minQuantityTickSize),
    priceDecimals: getExactDecimalsFromNumber(
      new BigNumber(minPriceTickSize).shiftedBy(-quoteDecimals).toFixed(),
    ),
  }
}

export const getSpotMarketDecimals = ({
  minPriceTickSize,
  minQuantityTickSize,
  baseDecimals,
  quoteDecimals,
}: {
  minPriceTickSize: number | string
  minQuantityTickSize: number | string
  baseDecimals: number
  quoteDecimals: number
}) => {
  return {
    priceDecimals: getExactDecimalsFromNumber(
      new BigNumber(minPriceTickSize)
        .shiftedBy(baseDecimals - quoteDecimals)
        .toFixed(),
    ),
    quantityDecimals: getExactDecimalsFromNumber(
      new BigNumber(minQuantityTickSize).shiftedBy(-baseDecimals).toFixed(),
    ),
  }
}
