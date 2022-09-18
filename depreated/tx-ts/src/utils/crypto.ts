import { SHA256 } from 'jscrypto/SHA256'
import { RIPEMD160 } from 'jscrypto/RIPEMD160'
import { Base64 } from 'jscrypto/Base64'
import { Word32Array } from 'jscrypto'

export function hashToHex(data: string): string {
  return SHA256.hash(Base64.parse(data)).toString().toUpperCase()
}

export function sha256(data: Uint8Array): Uint8Array {
  return SHA256.hash(new Word32Array(data)).toUint8Array()
}

export function ripemd160(data: Uint8Array): Uint8Array {
  return RIPEMD160.hash(new Word32Array(data)).toUint8Array()
}
