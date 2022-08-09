import { SHA256 } from 'jscrypto/SHA256'
import { RIPEMD160 } from 'jscrypto/RIPEMD160'
import { Base64 } from 'jscrypto/Base64'
import { Word32Array } from 'jscrypto'
import * as secp256k1 from 'secp256k1'

export const hashToHex = (data: string): string => {
  return SHA256.hash(Base64.parse(data)).toString().toUpperCase()
}

export const sha256 = (data: Uint8Array): Uint8Array => {
  return SHA256.hash(new Word32Array(data)).toUint8Array()
}

export const ripemd160 = (data: Uint8Array): Uint8Array => {
  return RIPEMD160.hash(new Word32Array(data)).toUint8Array()
}

export const privateKeyToPublicKey = (privateKey: Uint8Array): Uint8Array => {
  return secp256k1.publicKeyCreate(privateKey, true)
}

export const privateKeyHashToPublicKey = (
  privateKeyHash: string,
): Uint8Array => {
  const privateKey = privateKeyHash.startsWith('0x')
    ? privateKeyHash.slice(2)
    : privateKeyHash

  return secp256k1.publicKeyCreate(Buffer.from(privateKey, 'hex'), true)
}

export const privateKeyToPublicKeyBase64 = (privateKey: Uint8Array): string => {
  return Buffer.from(privateKeyToPublicKey(privateKey)).toString('base64')
}

export const privateKeyHashToPublicKeyBase64 = (
  privateKeyHash: string,
): string => {
  return Buffer.from(privateKeyHashToPublicKey(privateKeyHash)).toString(
    'base64',
  )
}
