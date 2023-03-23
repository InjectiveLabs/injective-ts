import {
  BigNumber,
  BigNumberInBase,
  getSignificantDecimalsFromNumber,
  getExactDecimalsFromNumber,
} from '@injectivelabs/utils'

const $BigNumber = BigNumber.clone({ ROUNDING_MODE: BigNumber.ROUND_DOWN })

export const isNumber = (number: string | number) => {
  if (typeof number === 'number') {
    return true
  }

  return !isNaN(parseFloat(number))
}

export const formatNumberToAllowableDecimals = (
  value: string | number,
  allowableDecimals: number,
  roundingMode?: BigNumber.RoundingMode,
): string => {
  const decimalPlacesInValue = new BigNumberInBase(
    getExactDecimalsFromNumber(value),
  )
  const valueToString = value.toString()

  if (decimalPlacesInValue.lte(0)) {
    return valueToString
  }

  const decimalMoreThanAllowance = decimalPlacesInValue.gte(allowableDecimals)

  return decimalMoreThanAllowance
    ? new BigNumberInBase(valueToString).toFixed(
        allowableDecimals,
        roundingMode,
      )
    : valueToString
}

export const formatNumberToAllowableTensMultiplier = (
  value: string | number,
  tensMultiplier: number,
  roundingMode?: BigNumber.RoundingMode,
): string => {
  const valueToBn = new BigNumberInBase(value)

  if (tensMultiplier === 0) {
    return valueToBn.toFixed(0, roundingMode)
  }

  const tensMul = new BigNumberInBase(10).pow(tensMultiplier)

  if (valueToBn.lte(tensMul)) {
    return tensMul.toFixed(0, roundingMode)
  }

  return new BigNumberInBase(valueToBn.div(tensMul).toFixed(0, roundingMode))
    .multipliedBy(tensMul)
    .toFixed(0)
}

export const formatAmountToAllowableAmount = (
  value: string | number,
  tensMultiplier: number,
): string => {
  return tensMultiplier < 0
    ? formatNumberToAllowableDecimals(
        value,
        -tensMultiplier,
        BigNumberInBase.ROUND_DOWN,
      )
    : formatNumberToAllowableTensMultiplier(
        value,
        tensMultiplier,
        BigNumberInBase.ROUND_DOWN,
      )
}

export const formatPriceToAllowablePrice = (
  value: string | number,
  tensMultiplier: number,
): string => {
  return tensMultiplier <= 0
    ? formatNumberToAllowableDecimals(value, -tensMultiplier)
    : formatNumberToAllowableTensMultiplier(value, tensMultiplier)
}

/**
 *
 * Legacy function - use formatNumberToAllowableDecimals
 *
 * @param value
 * @param allowableDecimals
 * @returns
 */
export const formatAmountToAllowableDecimals = (
  value: string | number,
  allowableDecimals: number,
): string => {
  return formatNumberToAllowableDecimals(
    value,
    allowableDecimals,
    BigNumberInBase.ROUND_DOWN,
  )
}

/**
 *
 * Legacy function - use formatNumberToAllowableDecimals
 *
 * @param value
 * @param allowableDecimals
 * @returns
 */
export const formatPriceToAllowableDecimals = (
  value: string | number,
  allowableDecimals: number,
): string => {
  return formatNumberToAllowableDecimals(value, allowableDecimals)
}

/**
 * On chain amounts queried from a sentry using the
 * gRPC API are returned with an extra decimal point
 * 18 places from the beginning, so we need to remove it
 * to get a workable amount
 */
export const denomAmountFromGrpcChainDenomAmount = (
  value: string | number | BigNumber,
) => new $BigNumber(value).dividedBy(new $BigNumber(10).pow(18))

/**
 * On chain amounts broadcasted to a sentry directly using the
 * gRPC API should be passed with an extra decimal point
 * 18 places from the beginning, so we need to add it
 * to get a workable amount
 */
export const denomAmountToGrpcChainDenomAmount = (
  value: string | number | BigNumber,
) => new $BigNumber(value).multipliedBy(new $BigNumber(10).pow(18))

/**
 * On chain amounts (based on the cosmosSdk.Dec type)
 * broadcasted to a sentry directly using the
 * gRPC API should be passed with an extra decimal point
 * 18 places from the beginning (i.e multiplied by 1e18), so we need to add it
 * to get a workable amount
 */
export const amountToCosmosSdkDecAmount = (
  value: string | number | BigNumber,
) => new $BigNumber(value).multipliedBy(new $BigNumber(10).pow(18))

/**
 * Amount that the chain requires is in the x * 10^(quoteDecimals) format
 * where x is a human readable number
 */
export const denomAmountToChainDenomAmount = ({
  value,
  decimals = 18,
}: {
  value: number | string | BigNumber
  decimals?: number | string
}) => new $BigNumber(value).multipliedBy(new $BigNumber(10).pow(decimals))

/**
 * Amount that the chain returns is in the x * 10^(quoteDecimals) format
 * where x is a human readable number
 */
export const denomAmountToChainDenomAmountToFixed = ({
  value,
  decimals = 18,
  tensMultiplier,
  decimalPlaces = undefined,
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  value: number | string | BigNumber
  decimals?: number | string
  tensMultiplier?: number
  decimalPlaces?: number
  roundingMode?: BigNumber.RoundingMode
}) => {
  const valueToBn = new BigNumberInBase(value).toFixed()
  const flooredValue = tensMultiplier
    ? formatPriceToAllowablePrice(valueToBn, tensMultiplier)
    : value

  const number = denomAmountToChainDenomAmount({
    value: flooredValue,
    decimals,
  })

  if (decimalPlaces === undefined) {
    return number.toFixed()
  }

  return number.toFixed(getSignificantDecimalsFromNumber(number), roundingMode)
}

/**
 * Amount that the chain returns is in the x * 10^(quoteDecimals) format
 * where x is a human readable number
 */
export const denomAmountFromChainDenomAmount = ({
  value,
  decimals = 18,
}: {
  value: number | string | BigNumber
  decimals?: number | string
}) => new $BigNumber(value).dividedBy(new $BigNumber(10).pow(decimals))
/**
 *
 * Amount that the chain returns is in the x * 10^(quoteDecimals) format
 * where x is a human readable number stringified
 */
export const denomAmountFromChainDenomAmountToFixed = ({
  value,
  decimals = 18,
  decimalPlaces = undefined,
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  value: number | string | BigNumber
  decimals?: number | string
  decimalPlaces?: number
  roundingMode?: BigNumber.RoundingMode
}) => {
  const number = denomAmountFromChainDenomAmount({ value, decimals })

  if (decimalPlaces === undefined) {
    return number.toFixed()
  }

  return number.toFixed(getSignificantDecimalsFromNumber(number), roundingMode)
}

/**
 * Amount that the chain requires is in the x * 10^(quoteDecimals) format
 * where x is a human readable number
 */
export const derivativeMarginToChainMargin = ({
  value,
  quoteDecimals = 18,
}: {
  value: number | string | BigNumber
  quoteDecimals?: number | string
}) => new $BigNumber(value).multipliedBy(new $BigNumber(10).pow(quoteDecimals))

/**
 * Amount that the chain requires is in the x * 10^(quoteDecimals) format
 * where x is a human readable number stringified
 */
export const derivativeMarginToChainMarginToFixed = ({
  value,
  quoteDecimals = 18,
  tensMultiplier,
  decimalPlaces = undefined,
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  decimalPlaces?: number
  tensMultiplier?: number
  roundingMode?: BigNumber.RoundingMode
  value: number | string | BigNumber
  quoteDecimals?: number | string
}) => {
  const valueToBn = new BigNumberInBase(value).toFixed()
  const flooredValue = tensMultiplier
    ? formatPriceToAllowablePrice(valueToBn, tensMultiplier)
    : value

  const number = derivativeMarginToChainMargin({
    value: flooredValue,
    quoteDecimals,
  })

  if (decimalPlaces === undefined) {
    return number.toFixed()
  }

  return number.toFixed(getSignificantDecimalsFromNumber(number), roundingMode)
}

/**
 * Amount that the chain returns is in the x * 10^(quoteDecimals) format
 * where x is a human readable number
 */
export const derivativeMarginFromChainMargin = ({
  value,
  quoteDecimals = 18,
}: {
  value: number | string | BigNumber
  quoteDecimals?: number | string
}) => new $BigNumber(value).dividedBy(new $BigNumber(10).pow(quoteDecimals))

/**
 * Amount that the chain returns is in the x * 10^(quoteDecimals) format
 * where x is a human readable number
 */
export const derivativeMarginFromChainMarginToFixed = ({
  value,
  quoteDecimals = 18,
  decimalPlaces = undefined,
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  value: number | string | BigNumber
  quoteDecimals?: number | string
  decimalPlaces?: number
  roundingMode?: BigNumber.RoundingMode
}) => {
  const number = derivativeMarginFromChainMargin({ value, quoteDecimals })

  if (decimalPlaces === undefined) {
    return number.toFixed()
  }

  return number.toFixed(getSignificantDecimalsFromNumber(number), roundingMode)
}

/**
 * Amount that the chain requires is in the x * 10^(quoteDecimals) format
 * where x is a human readable number
 */
export const derivativePriceToChainPrice = ({
  value,
  quoteDecimals = 18,
}: {
  value: number | string | BigNumber
  quoteDecimals?: number | string
}) => new $BigNumber(value).multipliedBy(new $BigNumber(10).pow(quoteDecimals))

/**
 * Amount that the chain requires is in the x * 10^(quoteDecimals) format
 * where x is a human readable number stringified
 */
export const derivativePriceToChainPriceToFixed = ({
  value,
  tensMultiplier,
  quoteDecimals = 18,
  decimalPlaces = undefined,
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  value: number | string | BigNumber
  tensMultiplier?: number
  quoteDecimals?: number | string
  decimalPlaces?: number
  roundingMode?: BigNumber.RoundingMode
}) => {
  const valueToBn = new BigNumberInBase(value).toFixed()
  const flooredValue = tensMultiplier
    ? formatPriceToAllowablePrice(valueToBn, tensMultiplier)
    : value

  const number = derivativePriceToChainPrice({
    value: flooredValue,
    quoteDecimals,
  })

  if (decimalPlaces === undefined) {
    return number.toFixed()
  }

  return number.toFixed(getSignificantDecimalsFromNumber(number), roundingMode)
}

/**
 * Amount that the chain returns is in the x * 10^(quoteDecimals) format
 * where x is a human readable number
 */
export const derivativePriceFromChainPrice = ({
  value,
  quoteDecimals = 18,
}: {
  value: number | string | BigNumber
  quoteDecimals?: number | string
}) => new $BigNumber(value).dividedBy(new $BigNumber(10).pow(quoteDecimals))

/**
 * Amount that the chain returns is in the x * 10^(quoteDecimals) format
 * where x is a human readable number stringified
 */
export const derivativePriceFromChainPriceToFixed = ({
  value,
  quoteDecimals = 18,
  decimalPlaces = undefined,
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  value: number | string | BigNumber
  quoteDecimals?: number | string
  decimalPlaces?: number
  roundingMode?: BigNumber.RoundingMode
}) => {
  const number = derivativePriceFromChainPrice({ value, quoteDecimals })

  if (decimalPlaces === undefined) {
    return number.toFixed()
  }

  return number.toFixed(getSignificantDecimalsFromNumber(number), roundingMode)
}

/**
 * Amount that the chain requires is in the x format
 * where x is a human readable number
 */
export const derivativeQuantityToChainQuantity = ({
  value,
}: {
  value: number | string | BigNumber
}) => new $BigNumber(value)

/**
 * Amount that the chain requires is in the x format
 * where x is a human readable number stringified
 */
export const derivativeQuantityToChainQuantityToFixed = ({
  value,
  decimalPlaces = undefined,
  tensMultiplier,
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  value: number | string | BigNumber
  decimalPlaces?: number
  tensMultiplier?: number
  roundingMode?: BigNumber.RoundingMode
}) => {
  const valueToBn = new BigNumberInBase(value).toFixed()
  const flooredValue = tensMultiplier
    ? formatPriceToAllowablePrice(valueToBn, tensMultiplier)
    : value

  const number = derivativeQuantityToChainQuantity({ value: flooredValue })

  if (decimalPlaces === undefined) {
    return number.toFixed()
  }

  return number.toFixed(getSignificantDecimalsFromNumber(number), roundingMode)
}

/**
 * Amount that the chain requires is in the x format
 * where x is a human readable number
 */
export const derivativeQuantityFromChainQuantity = ({
  value,
}: {
  value: number | string | BigNumber
}) => new $BigNumber(value)

/**
 * Amount that the chain requires is in the x format
 * where x is a human readable number stringified
 */
export const derivativeQuantityFromChainQuantityToFixed = ({
  value,
  decimalPlaces = undefined,
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  value: number | string | BigNumber
  decimalPlaces?: number
  roundingMode?: BigNumber.RoundingMode
}) => {
  const number = derivativeQuantityFromChainQuantity({ value })

  if (decimalPlaces === undefined) {
    return number.toFixed()
  }

  return number.toFixed(getSignificantDecimalsFromNumber(number), roundingMode)
}

/**
 * Amount that the chain requires is in the x / 10^(quoteDecimals - baseDecimals) format
 * where x is a human readable number
 */
export const spotPriceToChainPrice = ({
  value,
  baseDecimals = 18,
  quoteDecimals = 6,
}: {
  value: number | string | BigNumber
  quoteDecimals?: number | string
  baseDecimals?: number | string
}) =>
  new $BigNumber(value).multipliedBy(
    new $BigNumber(10).pow(new $BigNumber(quoteDecimals).minus(baseDecimals)),
  )

/**
 * Amount that the chain requires is in the x / 10^(quoteDecimals - baseDecimals) format
 * where x is a human readable number stringified
 */
export const spotPriceToChainPriceToFixed = ({
  value,
  baseDecimals = 18,
  quoteDecimals = 6,
  tensMultiplier,
  decimalPlaces = undefined,
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  value: number | string | BigNumber
  quoteDecimals?: number | string
  baseDecimals?: number | string
  decimalPlaces?: number
  tensMultiplier?: number
  roundingMode?: BigNumber.RoundingMode
}) => {
  const valueToBn = new BigNumberInBase(value).toFixed()
  const flooredValue = tensMultiplier
    ? formatPriceToAllowablePrice(valueToBn, tensMultiplier)
    : value

  const number = spotPriceToChainPrice({
    value: flooredValue,
    baseDecimals,
    quoteDecimals,
  })

  if (decimalPlaces === undefined) {
    return number.toFixed()
  }

  return number.toFixed(getSignificantDecimalsFromNumber(number), roundingMode)
}

/**
 * Amount that the chain returns is in the x / 10^(quoteDecimals - baseDecimals) format
 * where x is a human readable number
 */
export const spotPriceFromChainPrice = ({
  value,
  baseDecimals = 18,
  quoteDecimals = 6,
}: {
  value: number | string | BigNumber
  quoteDecimals?: number | string
  baseDecimals?: number | string
}) =>
  new $BigNumber(value).dividedBy(
    new $BigNumber(10).pow(new $BigNumber(quoteDecimals).minus(baseDecimals)),
  )

/**
 * Amount that the chain returns is in the x / 10^(quoteDecimals - baseDecimals) format
 * where x is a human readable number stringified
 */
export const spotPriceFromChainPriceToFixed = ({
  value,
  baseDecimals = 18,
  quoteDecimals = 6,
  decimalPlaces = undefined,
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  value: number | string | BigNumber
  quoteDecimals?: number | string
  baseDecimals?: number | string
  decimalPlaces?: number
  roundingMode?: BigNumber.RoundingMode
}) => {
  const number = spotPriceFromChainPrice({ value, baseDecimals, quoteDecimals })

  if (decimalPlaces === undefined) {
    return number.toFixed()
  }

  return number.toFixed(getSignificantDecimalsFromNumber(number), roundingMode)
}

/**
 * Amount that the chain requires is in the x * 10^(baseDecimals) format
 * where x is a human readable number
 */
export const spotQuantityToChainQuantity = ({
  value,
  baseDecimals = 18,
}: {
  value: number | string | BigNumber
  baseDecimals?: number | string
}) => new $BigNumber(value).multipliedBy(new $BigNumber(10).pow(baseDecimals))

/**
 * Amount that the chain requires is in the x * 10^(baseDecimals) format
 * where x is a human readable number
 */
export const spotQuantityToChainQuantityToFixed = ({
  value,
  baseDecimals = 18,
  tensMultiplier,
  decimalPlaces = undefined,
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  value: number | string | BigNumber
  tensMultiplier?: number
  baseDecimals?: number | string
  decimalPlaces?: number
  roundingMode?: BigNumber.RoundingMode
}) => {
  const valueToBn = new BigNumberInBase(value).toFixed()
  const flooredValue = tensMultiplier
    ? formatPriceToAllowablePrice(valueToBn, tensMultiplier)
    : value

  const number = spotQuantityToChainQuantity({
    value: flooredValue,
    baseDecimals,
  })

  if (decimalPlaces === undefined) {
    return number.toFixed()
  }

  return number.toFixed(getSignificantDecimalsFromNumber(number), roundingMode)
}

/**
 * Amount that the chain returns is in the x * 10^(baseDecimals) format
 * where x is a human readable number
 */
export const spotQuantityFromChainQuantity = ({
  value,
  baseDecimals = 18,
}: {
  value: number | string | BigNumber
  baseDecimals?: number | string
}) => new $BigNumber(value).dividedBy(new $BigNumber(10).pow(baseDecimals))

/**
 * Amount that the chain returns is in the x * 10^(baseDecimals) format
 * where x is a human readable number
 */
export const spotQuantityFromChainQuantityToFixed = ({
  value,
  baseDecimals = 18,
  decimalPlaces = undefined,
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  value: number | string | BigNumber
  baseDecimals?: number | string
  decimalPlaces?: number
  roundingMode?: BigNumber.RoundingMode
}) => {
  const number = spotQuantityFromChainQuantity({
    value,
    baseDecimals,
  })

  if (decimalPlaces === undefined) {
    return number.toFixed()
  }

  return number.toFixed(getSignificantDecimalsFromNumber(number), roundingMode)
}

export const cosmosSdkDecToBigNumber = (
  number: string | number | BigNumber,
): BigNumber => new BigNumber(number).dividedBy(new BigNumber(10).pow(18))

export const numberToCosmosSdkDecString = (
  value: string | number | BigNumber,
): string => {
  return new BigNumber(value).toFixed(18)
}

/**
 * This function returns a multiplier of 10
 * based on the input. There are two cases:
 *
 * 1. If the number is less than 1, it returns a NEGATIVE
 * number which is the number of decimals the number has
 *
 * 2. If the number is higher than 1, it returns a POSITIVE
 * number which is the number of 10 multiplier the number has
 *
 * @param number
 * @returns {number}
 */
export const getTensMultiplier = (number: number | string): number => {
  const numberToBn = new BigNumber(number)

  if (numberToBn.eq(1)) {
    return 0
  }

  if (numberToBn.lt(1)) {
    return -1 * getExactDecimalsFromNumber(numberToBn.toFixed())
  }

  const [, zerosInTheNumber] = numberToBn.toFixed().split('1')

  return zerosInTheNumber.length
}

export const getTriggerPrice = (triggerPrice?: number | string) => {
  return triggerPrice ? amountToCosmosSdkDecAmount(triggerPrice).toFixed() : ''
}

export { getSignificantDecimalsFromNumber, getExactDecimalsFromNumber }
