import { BigNumber } from '@injectivelabs/utils'
import { getExactDecimalsFromNumber, getTensMultiplier } from './numbers'

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
      new BigNumber(minPriceTickSize).shiftedBy(-quoteDecimals).toNumber(),
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
        .toNumber(),
    ),
    quantityTensMultiplier: getTensMultiplier(
      new BigNumber(minQuantityTickSize).shiftedBy(-baseDecimals).toNumber(),
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
      new BigNumber(minPriceTickSize).shiftedBy(-quoteDecimals).toNumber(),
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
        .toNumber(),
    ),
    quantityDecimals: getExactDecimalsFromNumber(
      new BigNumber(minQuantityTickSize).shiftedBy(-baseDecimals).toNumber(),
    ),
  }
}
