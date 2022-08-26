import { BigNumber } from '@injectivelabs/utils'

const $BigNumber = BigNumber.clone({ ROUNDING_MODE: BigNumber.ROUND_DOWN })

export const getSignificantDecimalsFromNumber = (
  number: BigNumber | number | string,
): number => {
  if (Math.floor(new $BigNumber(number).toNumber()) === number) {
    return 0
  }

  const parts = new $BigNumber(number).toFixed().split('.')
  const [, decimals] = parts

  /** Number doesn't have decimals */
  if (!decimals) {
    return 0
  }

  return decimals.length
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
  decimalPlaces = undefined,
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  value: number | string | BigNumber
  decimals?: number | string
  decimalPlaces?: number
  roundingMode?: BigNumber.RoundingMode
}) => {
  const number = denomAmountToChainDenomAmount({ value, decimals })

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
  decimalPlaces = undefined,
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  decimalPlaces?: number
  roundingMode?: BigNumber.RoundingMode
  value: number | string | BigNumber
  quoteDecimals?: number | string
}) => {
  const number = derivativeMarginToChainMargin({ value, quoteDecimals })

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
  quoteDecimals = 18,
  decimalPlaces = undefined,
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  value: number | string | BigNumber
  quoteDecimals?: number | string
  decimalPlaces?: number
  roundingMode?: BigNumber.RoundingMode
}) => {
  const number = derivativePriceToChainPrice({ value, quoteDecimals })

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
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  value: number | string | BigNumber
  decimalPlaces?: number
  roundingMode?: BigNumber.RoundingMode
}) => {
  const number = derivativeQuantityToChainQuantity({ value })

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
  decimalPlaces = undefined,
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  value: number | string | BigNumber
  quoteDecimals?: number | string
  baseDecimals?: number | string
  decimalPlaces?: number
  roundingMode?: BigNumber.RoundingMode
}) => {
  const number = spotPriceToChainPrice({ value, baseDecimals, quoteDecimals })

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
  decimalPlaces = undefined,
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  value: number | string | BigNumber
  baseDecimals?: number | string
  decimalPlaces?: number
  roundingMode?: BigNumber.RoundingMode
}) => {
  const number = spotQuantityToChainQuantity({
    value,
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
}) => new $BigNumber(value).multipliedBy(new $BigNumber(10).pow(baseDecimals))

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

export const getDecimalsFromNumber = (number: number | string): number => {
  const UI_DEFAULT_MAX_DISPLAY_DECIMALS = 4
  const numberToBn = new BigNumber(number).toNumber()
  const numberParts = numberToBn.toString().split('.')
  const [, decimals] = numberParts

  const actualDecimals = decimals ? decimals.length : 0

  return actualDecimals > UI_DEFAULT_MAX_DISPLAY_DECIMALS
    ? UI_DEFAULT_MAX_DISPLAY_DECIMALS
    : actualDecimals
}

export const getTriggerPrice = (triggerPrice?: number | string) => {
  return triggerPrice
    ? amountToCosmosSdkDecAmount(triggerPrice || 0).toFixed()
    : ''
}
