import { BigNumberInBase, BigNumber } from './classes/index.js'

export const SECONDS_IN_A_DAY: BigNumber = new BigNumber(60 * 60 * 24)

export const convertTimestampToMilliseconds = (
  timestamp: number | string,
): number => {
  const timestampInBigNumber = new BigNumberInBase(timestamp)

  if (timestamp.toString().length > 13) {
    return timestampInBigNumber
      .precision(13, BigNumber.ROUND_HALF_UP)
      .toNumber()
  }

  if (timestamp.toString().length < 13) {
    const trailingZeros = 13 - timestamp.toString().length

    return timestampInBigNumber.times(10 ** trailingZeros).toNumber()
  }

  return timestampInBigNumber.toNumber()
}

export const getUTCDateFromTimestamp = (timestamp: number) => {
  const date = new Date(convertTimestampToMilliseconds(timestamp))

  return `${date.getUTCDate()}-${
    date.getUTCMonth() + 1
  }-${date.getUTCFullYear()}`
}

export const tomorrow = (): BigNumber =>
  new BigNumberInBase(Math.floor(new Date().valueOf() / 1000) + 3600 * 24)

export const todayInSeconds = (): number => Math.floor(Date.now() / 1000)

export const past24Hours = (): number =>
  new BigNumberInBase(todayInSeconds()).minus(SECONDS_IN_A_DAY).toNumber()

export const pastDays = (day = 1): number =>
  new BigNumberInBase(todayInSeconds())
    .minus(SECONDS_IN_A_DAY.times(day))
    .toNumber()

export const getEndDateStringFromTimeInSeconds = (
  timeInSeconds: BigNumberInBase,
): string => {
  const currentDate = new Date(timeInSeconds.toNumber() * 1000)

  return currentDate.toLocaleString('en-us')
}
