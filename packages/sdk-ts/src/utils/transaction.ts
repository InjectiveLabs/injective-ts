import { secp256k1 } from '@noble/curves/secp256k1'
import { hashTypedData, recoverPublicKey, type TypedDataDefinition } from 'viem'
import { uint8ArrayToHex } from './encoding.js'

export const recoverTypedSignaturePubKey = async (
  data: TypedDataDefinition,
  signature: string,
): Promise<string> => {
  const messageHash = hashTypedData(data)
  const publicKeyHex = await recoverPublicKey({
    hash: messageHash,
    signature: signature as `0x${string}`,
  })

  // viem's recoverPublicKey returns uncompressed public key (65 bytes with 0x04 prefix)
  // Use @noble/curves to convert uncompressed to compressed format
  // @noble/curves: ProjectivePoint handles conversion
  // Uncompressed key (64 bytes without prefix) -> compressed (33 bytes)
  const point = secp256k1.ProjectivePoint.fromHex(publicKeyHex.slice(2))
  const compressedKey = point.toRawBytes(true) // true = compressed format

  return `0x${uint8ArrayToHex(compressedKey)}`
}
