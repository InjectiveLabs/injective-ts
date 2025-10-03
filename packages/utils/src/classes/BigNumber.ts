import { BigNumber } from 'bignumber.js'

export default BigNumber

/**
 * Converts a value to BigNumber if it isn't already
 */
export const toBigNumber = (value: BigNumber | string | number): BigNumber => {
  if (value instanceof BigNumber) {
    return value
  }

  return new BigNumber(value)
}

/**
 * Converts a value to Wei (multiplies by 10^decimals) default to 18 decimals
 */
// parseUnits
export const toChainFormat = (
  value: BigNumber | string | number,
  decimals = 18,
): BigNumber => {
  const bn = toBigNumber(value)

  return bn.multipliedBy(new BigNumber(10).pow(decimals))
}

/**
 * Converts a value from Wei to Base (divides by 10^decimals) default to 18 decimals
 */
// formatUnits
export const toHumanReadable = (
  value: BigNumber | string | number,
  decimals = 18,
): BigNumber => {
  const bn = toBigNumber(value)

  return bn.dividedBy(new BigNumber(10).pow(decimals))
}
