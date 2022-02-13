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
export const denomAmountFromChainDenomAmount = ({
  value,
  decimals = 18,
}: {
  value: number | string | BigNumber
  decimals?: number | string
}) => new BigNumber(value).dividedBy(new BigNumber(10).pow(decimals))

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
 * Amount that the chain requires is in the x format
 * where x is a human readable number
 */
export const derivativeQuantityToChainQuantity = (
  value: number | string | BigNumber,
) => new BigNumber(value)

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
