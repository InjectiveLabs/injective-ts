import { formatDuration, intervalToDuration } from 'date-fns'
import { BigNumberInBase, BigNumber } from './classes'

export const SECONDS_IN_A_DAY: BigNumber = new BigNumber(60 * 60 * 24)

export const formatDurationFromSecondsToString = (seconds: number): string => {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 })

  const countDownDisplaySuffix: Record<string, any> = {
    xDays: 'd',
    xHours: 'h',
    xMinutes: 'm',
    xSeconds: 's',
  }

  return formatDuration(duration, {
    format: ['days', 'hours', 'minutes', 'seconds'],
    locale: {
      formatDistance: (type, count) => {
        const formattedCount = count < 10 ? `0${count}` : count

        return `${formattedCount}${countDownDisplaySuffix[type]}`
      },
    },
  })
}

export const formatDurationFromSeconds = ({
  duration,
  fullSuffix,
}: {
  duration: number
  fullSuffix?: boolean
}): string => {
  const { days, hours, minutes, seconds } = intervalToDuration({
    start: 0,
    end: duration * 1000,
  })

  const suffix = fullSuffix
    ? ['day', 'hour', 'min', 'sec']
    : ['d', 'h', 'm', 's']
  let removeLeadingZeroDuration = true

  return (
    [days, hours, minutes, seconds]
      .map((duration, index) => {
        if (duration !== 0) {
          removeLeadingZeroDuration = false
        }

        if (fullSuffix) {
          const durationSuffix = duration && duration > 1 ? 's' : ''

          return removeLeadingZeroDuration && duration === 0
            ? undefined
            : `${duration} ${suffix[index]}${durationSuffix}`
        }

        return removeLeadingZeroDuration && duration === 0
          ? undefined
          : `${duration}${suffix[index]}`
      })
      .filter((duration) => duration)
      .join(' ')
      // remove tailing 0s duration
      .replace(' 0h 0m 0s', '')
      .replace(' 0m 0s', '')
      .replace(' 0s', '')
      .replace(' 0 hour 0 minute 0 second', '')
      .replace(' 0 minute 0 second', '')
      .replace(' 0 second', '')
  )
}

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
