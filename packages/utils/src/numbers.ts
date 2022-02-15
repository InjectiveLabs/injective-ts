import { BigNumber } from './classes'

/**
 * On chain amounts queried from a sentry using the
 * gRPC API are returned with an extra decimal point
 * 18 places from the beginning, so we need to remove it
 * to get a workable amount
 */
export const denomAmountFromGrpcChainDenomAmount = (
  value: string | number | BigNumber,
) => new BigNumber(value).dividedBy(new BigNumber(10).pow(18))

/**
 * On chain amounts broadcasted to a sentry directly using the
 * gRPC API should be passed with an extra decimal point
 * 18 places from the beginning, so we need to add it
 * to get a workable amount
 */
export const denomAmountToGrpcChainDenomAmount = (
  value: string | number | BigNumber,
) => new BigNumber(value).multipliedBy(new BigNumber(10).pow(18))

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
}) => new BigNumber(value).multipliedBy(new BigNumber(10).pow(decimals))

/**
 * Amount that the chain returns is in the x * 10^(quoteDecimals) format
 * where x is a human readable number
 */
export const denomAmountToChainDenomAmountToFixed = ({
  value,
  decimals = 18,
  decimalPlaces = 0,
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  value: number | string | BigNumber
  decimals?: number | string
  decimalPlaces?: number
  roundingMode?: BigNumber.RoundingMode
}) =>
  denomAmountToChainDenomAmount({ value, decimals }).toFixed(
    decimalPlaces,
    roundingMode,
  )

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
}) => new BigNumber(value).dividedBy(new BigNumber(10).pow(decimals))
/**
 *
 * Amount that the chain returns is in the x * 10^(quoteDecimals) format
 * where x is a human readable number stringified
 */
export const denomAmountFromChainDenomAmountToFixed = ({
  value,
  decimals = 18,
  decimalPlaces = 0,
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  value: number | string | BigNumber
  decimals?: number | string
  decimalPlaces?: number
  roundingMode?: BigNumber.RoundingMode
}) =>
  denomAmountFromChainDenomAmount({ value, decimals }).toFixed(
    decimalPlaces,
    roundingMode,
  )

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
}) => new BigNumber(value).multipliedBy(new BigNumber(10).pow(quoteDecimals))

/**
 * Amount that the chain requires is in the x * 10^(quoteDecimals) format
 * where x is a human readable number stringified
 */
export const derivativeMarginToChainMarginToFixed = ({
  value,
  quoteDecimals = 18,
  decimalPlaces = 0,
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  decimalPlaces?: number
  roundingMode?: BigNumber.RoundingMode
  value: number | string | BigNumber
  quoteDecimals?: number | string
}) =>
  derivativeMarginToChainMargin({ value, quoteDecimals }).toFixed(
    decimalPlaces,
    roundingMode,
  )

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
}) => new BigNumber(value).dividedBy(new BigNumber(10).pow(quoteDecimals))

/**
 * Amount that the chain returns is in the x * 10^(quoteDecimals) format
 * where x is a human readable number
 */
export const derivativeMarginFromChainMarginToFixed = ({
  value,
  quoteDecimals = 18,
  decimalPlaces = 0,
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  value: number | string | BigNumber
  quoteDecimals?: number | string
  decimalPlaces?: number
  roundingMode?: BigNumber.RoundingMode
}) =>
  derivativeMarginFromChainMargin({ value, quoteDecimals }).toFixed(
    decimalPlaces,
    roundingMode,
  )

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
}) => new BigNumber(value).multipliedBy(new BigNumber(10).pow(quoteDecimals))

/**
 * Amount that the chain requires is in the x * 10^(quoteDecimals) format
 * where x is a human readable number stringified
 */
export const derivativePriceToChainPriceToFixed = ({
  value,
  quoteDecimals = 18,
  decimalPlaces = 0,
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  value: number | string | BigNumber
  quoteDecimals?: number | string
  decimalPlaces?: number
  roundingMode?: BigNumber.RoundingMode
}) =>
  derivativePriceToChainPrice({ value, quoteDecimals }).toFixed(
    decimalPlaces,
    roundingMode,
  )

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
}) => new BigNumber(value).dividedBy(new BigNumber(10).pow(quoteDecimals))

/**
 * Amount that the chain returns is in the x * 10^(quoteDecimals) format
 * where x is a human readable number stringified
 */
export const derivativePriceFromChainPriceToFixed = ({
  value,
  quoteDecimals = 18,
  decimalPlaces = 0,
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  value: number | string | BigNumber
  quoteDecimals?: number | string
  decimalPlaces?: number
  roundingMode?: BigNumber.RoundingMode
}) =>
  derivativePriceFromChainPrice({ value, quoteDecimals }).toFixed(
    decimalPlaces,
    roundingMode,
  )

/**
 * Amount that the chain requires is in the x format
 * where x is a human readable number
 */
export const derivativeQuantityToChainQuantity = ({
  value,
}: {
  value: number | string | BigNumber
}) => new BigNumber(value)

/**
 * Amount that the chain requires is in the x format
 * where x is a human readable number stringified
 */
export const derivativeQuantityToChainQuantityToFixed = ({
  value,
  decimalPlaces = 0,
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  value: number | string | BigNumber
  decimalPlaces?: number
  roundingMode?: BigNumber.RoundingMode
}) =>
  derivativeQuantityToChainQuantity({ value }).toFixed(
    decimalPlaces,
    roundingMode,
  )

/**
 * Amount that the chain requires is in the x format
 * where x is a human readable number
 */
export const derivativeQuantityFromChainQuantity = ({
  value,
}: {
  value: number | string | BigNumber
}) => new BigNumber(value)

/**
 * Amount that the chain requires is in the x format
 * where x is a human readable number stringified
 */
export const derivativeQuantityFromChainQuantityToFixed = ({
  value,
  decimalPlaces = 0,
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  value: number | string | BigNumber
  decimalPlaces?: number
  roundingMode?: BigNumber.RoundingMode
}) =>
  derivativeQuantityFromChainQuantity({ value }).toFixed(
    decimalPlaces,
    roundingMode,
  )

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
  new BigNumber(value).multipliedBy(
    new BigNumber(10).pow(new BigNumber(quoteDecimals).minus(baseDecimals)),
  )

/**
 * Amount that the chain requires is in the x / 10^(quoteDecimals - baseDecimals) format
 * where x is a human readable number stringified
 */
export const spotPriceToChainPriceToFixed = ({
  value,
  baseDecimals = 18,
  quoteDecimals = 6,
  decimalPlaces = 0,
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  value: number | string | BigNumber
  quoteDecimals?: number | string
  baseDecimals?: number | string
  decimalPlaces?: number
  roundingMode?: BigNumber.RoundingMode
}) =>
  spotPriceToChainPrice({ value, baseDecimals, quoteDecimals }).toFixed(
    decimalPlaces,
    roundingMode,
  )

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
  new BigNumber(value).dividedBy(
    new BigNumber(10).pow(new BigNumber(quoteDecimals).minus(baseDecimals)),
  )

/**
 * Amount that the chain returns is in the x / 10^(quoteDecimals - baseDecimals) format
 * where x is a human readable number stringified
 */
export const spotPriceFromChainPriceToFixed = ({
  value,
  baseDecimals = 18,
  quoteDecimals = 6,
  decimalPlaces = 0,
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  value: number | string | BigNumber
  quoteDecimals?: number | string
  baseDecimals?: number | string
  decimalPlaces?: number
  roundingMode?: BigNumber.RoundingMode
}) =>
  spotPriceFromChainPrice({ value, baseDecimals, quoteDecimals }).toFixed(
    decimalPlaces,
    roundingMode,
  )

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
}) => new BigNumber(value).multipliedBy(new BigNumber(10).pow(baseDecimals))

/**
 * Amount that the chain requires is in the x * 10^(baseDecimals) format
 * where x is a human readable number
 */
export const spotQuantityToChainQuantityToFixed = ({
  value,
  baseDecimals = 18,
  decimalPlaces = 0,
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  value: number | string | BigNumber
  baseDecimals?: number | string
  decimalPlaces?: number
  roundingMode?: BigNumber.RoundingMode
}) =>
  spotQuantityToChainQuantity({ value, baseDecimals }).toFixed(
    decimalPlaces,
    roundingMode,
  )

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
}) => new BigNumber(value).multipliedBy(new BigNumber(10).pow(baseDecimals))

/**
 * Amount that the chain returns is in the x * 10^(baseDecimals) format
 * where x is a human readable number
 */
export const spotQuantityFromChainQuantityToFixed = ({
  value,
  baseDecimals = 18,
  decimalPlaces = 0,
  roundingMode = BigNumber.ROUND_DOWN,
}: {
  value: number | string | BigNumber
  baseDecimals?: number | string
  decimalPlaces?: number
  roundingMode?: BigNumber.RoundingMode
}) =>
  spotQuantityFromChainQuantity({ value, baseDecimals }).toFixed(
    decimalPlaces,
    roundingMode,
  )
