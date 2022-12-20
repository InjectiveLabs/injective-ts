import { BigNumberInBase, BigNumberInWei } from '@injectivelabs/utils'
import { getDecimalsFromNumber, getTensMultiplier } from './numbers'

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
      new BigNumberInBase(minPriceTickSize).toWei(-quoteDecimals).toNumber(),
    ),
  }
}

export const getSpotMarketTensMultiplier = ({
  baseDecimals,
  quoteDecimals,
  minPriceTickSize,
  minQuantityTickSize,
}: {
  minPriceTickSize: number
  minQuantityTickSize: number
  baseDecimals: number
  quoteDecimals: number
}) => {
  return {
    priceTensMultiplier: getTensMultiplier(
      new BigNumberInWei(minPriceTickSize)
        .toBase(quoteDecimals - baseDecimals)
        .toNumber(),
    ),
    quantityTensMultiplier: getTensMultiplier(
      new BigNumberInBase(minQuantityTickSize).toWei(-baseDecimals).toNumber(),
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
    quantityDecimals: getDecimalsFromNumber(minQuantityTickSize),
    priceDecimals: getDecimalsFromNumber(
      new BigNumberInBase(minPriceTickSize).toWei(-quoteDecimals).toNumber(),
    ),
  }
}

export const getSpotMarketDecimals = ({
  minPriceTickSize,
  minQuantityTickSize,
  baseDecimals,
  quoteDecimals,
}: {
  minPriceTickSize: number
  minQuantityTickSize: number
  baseDecimals: number
  quoteDecimals: number
}) => {
  return {
    priceDecimals: getDecimalsFromNumber(
      new BigNumberInWei(minPriceTickSize)
        .toBase(quoteDecimals - baseDecimals)
        .toNumber(),
    ),
    quantityDecimals: getDecimalsFromNumber(
      new BigNumberInBase(minQuantityTickSize).toWei(-baseDecimals).toNumber(),
    ),
  }
}
