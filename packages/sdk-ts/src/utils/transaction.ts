import { fromRpcSig, ecrecover } from 'ethereumjs-util'
import * as secp256k1 from 'secp256k1'
import { TypedDataUtils, SignTypedDataVersion } from '@metamask/eth-sig-util'

export const recoverTypedSignaturePubKey = (
  data: any,
  signature: string,
): string => {
  const compressedPubKeyPrefix = Buffer.from('04', 'hex')
  const message = TypedDataUtils.eip712Hash(data, SignTypedDataVersion.V4)
  const sigParams = fromRpcSig(signature)
  const publicKey = ecrecover(message, sigParams.v, sigParams.r, sigParams.s)
  const prefixedKey = Buffer.concat([compressedPubKeyPrefix, publicKey])
  const compressedKey = Buffer.from(secp256k1.publicKeyConvert(prefixedKey))

  return `0x${compressedKey.toString('hex')}`
}
