import { DEFAULT_TIMESTAMP_TIMEOUT_MS } from '@injectivelabs/utils'

/**
 * Returns a timeout timestamp in milliseconds so its compatible
 * with the way Cosmos handles transactions
 */
export const makeTimeoutTimestamp = (
  timeoutInMs: number = DEFAULT_TIMESTAMP_TIMEOUT_MS,
) => {
  const now = new Date()
  const timestamp = new Date(now.getTime() + timeoutInMs)
  const actualTimestamp = timestamp.getTime()

  return actualTimestamp
}

/**
 * Returns a timeout timestamp in nanoseconds so its compatible
 * with the way Cosmos handles transactions
 */
export const makeTimeoutTimestampInNs = (
  timeoutInMs: number = DEFAULT_TIMESTAMP_TIMEOUT_MS,
) => makeTimeoutTimestamp(timeoutInMs) * 1e6

/**
 * Converts a protobuf Timestamp to a JavaScript Date
 * @param timestamp - Protobuf Timestamp object with seconds and nanos fields
 * @returns JavaScript Date or undefined if timestamp is null/undefined
 */
export const protobufTimestampToDate = (
  timestamp: { seconds: bigint | number; nanos: number } | null | undefined,
): Date | undefined => {
  if (!timestamp) {
    return undefined
  }

  return new Date(
    Number(timestamp.seconds) * 1000 + Number(timestamp.nanos) / 1000000,
  )
}

/**
 * Converts a protobuf Timestamp to Unix timestamp in seconds
 * @param timestamp - Protobuf Timestamp object with seconds and nanos fields
 * @returns Unix timestamp in seconds or 0 if timestamp is null/undefined
 */
export const protobufTimestampToUnixSeconds = (
  timestamp: { seconds: bigint | number; nanos: number } | null | undefined,
): number => {
  if (!timestamp) {
    return 0
  }

  return Math.floor(
    Number(timestamp.seconds) + Number(timestamp.nanos) / 1_000_000_000,
  )
}

/**
 * Converts a protobuf Timestamp to Unix timestamp in milliseconds
 * @param timestamp - Protobuf Timestamp object with seconds and nanos fields
 * @returns Unix timestamp in milliseconds or 0 if timestamp is null/undefined
 */
export const protobufTimestampToUnixMs = (
  timestamp: { seconds: bigint | number; nanos: number } | null | undefined,
): number => {
  if (!timestamp) {
    return 0
  }

  return Math.floor(
    Number(timestamp.seconds) * 1000 + Number(timestamp.nanos) / 1_000_000,
  )
}
