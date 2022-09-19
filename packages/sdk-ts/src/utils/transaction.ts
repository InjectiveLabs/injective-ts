import { fromRpcSig, ecrecover } from 'ethereumjs-util'
import { publicKeyConvert } from 'secp256k1'
import { TypedDataUtils, SignTypedDataVersion } from '@metamask/eth-sig-util'
import { DEFAULT_TIMESTAMP_TIMEOUT_MS } from '@injectivelabs/utils'

export const recoverTypedSignaturePubKey = (
  data: any,
  signature: string,
): string => {
  const compressedPubKeyPrefix = Buffer.from('04', 'hex')
  const message = TypedDataUtils.eip712Hash(data, SignTypedDataVersion.V4)
  const sigParams = fromRpcSig(signature)
  const publicKey = ecrecover(message, sigParams.v, sigParams.r, sigParams.s)
  const prefixedKey = Buffer.concat([compressedPubKeyPrefix, publicKey])
  const compressedKey = Buffer.from(publicKeyConvert(prefixedKey))

  return `0x${compressedKey.toString('hex')}`
}

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
