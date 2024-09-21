import { BigNumber } from '@injectivelabs/utils'

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
