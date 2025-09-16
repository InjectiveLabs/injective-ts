import * as secp256k1 from 'secp256k1'
import { recoverPublicKey, hashTypedData, type TypedDataDefinition } from 'viem'

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
  // Convert to Buffer for secp256k1.publicKeyConvert (expects Uint8Array)
  const uncompressedKey = Buffer.from(publicKeyHex.slice(2), 'hex')

  // Convert to compressed format (33 bytes)
  const compressedKey = Buffer.from(
    secp256k1.publicKeyConvert(uncompressedKey, true),
  )

  return `0x${compressedKey.toString('hex')}`
}
