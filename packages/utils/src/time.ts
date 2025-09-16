import BigNumber from './classes/BigNumber.js'

export const getSecondsInDay = (): BigNumber => new BigNumber(60 * 60 * 24)

export const convertTimestampToMilliseconds = (
  timestamp: number | string,
): number => {
  const timestampInBigNumber = new BigNumber(timestamp)

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
  new BigNumber(Math.floor(new Date().valueOf() / 1000) + 3600 * 24)

export const todayInSeconds = (): number => Math.floor(Date.now() / 1000)

export const past24Hours = (): number =>
  new BigNumber(todayInSeconds()).minus(getSecondsInDay()).toNumber()

export const pastDays = (day = 1): number =>
  new BigNumber(todayInSeconds()).minus(getSecondsInDay().times(day)).toNumber()

export const getEndDateStringFromTimeInSeconds = (
  timeInSeconds: BigNumber,
): string => {
  const currentDate = new Date(timeInSeconds.toNumber() * 1000)

  return currentDate.toLocaleString('en-us')
}
