import { fromRpcSig, ecrecover } from 'ethereumjs-util'
import { publicKeyConvert } from 'secp256k1'
import { TypedDataUtils } from 'eth-sig-util'

export const recoverTypedSignaturePubKey = (
  data: any,
  signature: string,
): string => {
  const compressedPubKeyPrefix = Buffer.from('04', 'hex')
  const message = TypedDataUtils.sign(data)
  const sigParams = fromRpcSig(signature)
  const publicKey = ecrecover(message, sigParams.v, sigParams.r, sigParams.s)
  const prefixedKey = Buffer.concat([compressedPubKeyPrefix, publicKey])
  const compressedKey = Buffer.from(publicKeyConvert(prefixedKey))

  return `0x${compressedKey.toString('hex')}`
}
