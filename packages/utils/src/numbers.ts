import BigNumber from './classes/BigNumber/BigNumber.js'

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

export const getExactDecimalsFromNumber = (number: number | string): number => {
  if (!number.toString().includes('.')) {
    return 0
  }

  if (Number(number) % 1 === 0) {
    return 0
  }

  const [, decimals] = number.toString().split('.')

  if (!decimals) {
    return 0
  }

  return decimals.length
}
