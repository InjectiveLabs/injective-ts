import { BigNumberInBase, BigNumber } from './classes'

export const SECONDS_IN_A_DAY: BigNumber = new BigNumber(60 * 60 * 24)

export const convertTimestampToMilliseconds = (timestamp: number) => {
  if (timestamp.toString().length > 13) {
    return parseInt(timestamp.toString().slice(0, 13), 10)
  }

  if (timestamp.toString().length < 13) {
    return parseInt(
      `${timestamp}${'0'.repeat(13 - timestamp.toString().length)}`,
      10,
    )
  }

  return timestamp
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
