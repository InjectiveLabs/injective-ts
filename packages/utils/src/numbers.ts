import { BigNumber } from './classes'

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
