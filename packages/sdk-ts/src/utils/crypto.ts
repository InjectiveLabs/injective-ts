import { keccak256 } from 'viem'
import { hashTypedData } from 'viem'
import { secp256k1 } from '@noble/curves/secp256k1'
import { sha256 as nobleSha256 } from '@noble/hashes/sha2'
import { ripemd160 as nobleRipemd160 } from '@noble/hashes/legacy'
import { bigIntToString } from './helpers.js'
import {
  hexToUint8Array,
  uint8ArrayToHex,
  uint8ArrayToBase64,
  base64ToUint8Array,
} from './encoding.js'
import type { TypedDataDefinition } from 'viem'

/**
 * Hash data to hex string using SHA256
 * @param data - Base64 encoded string to hash
 * @returns Uppercase hex string
 */
export const hashToHex = (data: string): string => {
  const bytes = base64ToUint8Array(data)
  return uint8ArrayToHex(nobleSha256(bytes)).toUpperCase()
}

/**
 * Compute SHA256 hash of Uint8Array data
 * @param data - Data to hash
 * @returns SHA256 hash as Uint8Array
 */
export const sha256 = (data: Uint8Array): Uint8Array => {
  return nobleSha256(data)
}

/**
 * Compute RIPEMD160 hash of Uint8Array data
 * @param data - Data to hash
 * @returns RIPEMD160 hash as Uint8Array
 */
export const ripemd160 = (data: Uint8Array): Uint8Array => {
  return nobleRipemd160(data)
}

/**
 * Derive public key from private key
 * @param privateKey - Private key as Uint8Array
 * @returns Compressed public key (33 bytes)
 */
export const privateKeyToPublicKey = (privateKey: Uint8Array): Uint8Array => {
  return secp256k1.getPublicKey(privateKey, true)
}

/**
 * Derive public key from private key hash (hex string)
 * @param privateKeyHash - Private key as hex string (with or without 0x prefix)
 * @returns Compressed public key (33 bytes)
 */
export const privateKeyHashToPublicKey = (
  privateKeyHash: string,
): Uint8Array => {
  const privateKey = privateKeyHash.startsWith('0x')
    ? privateKeyHash.slice(2)
    : privateKeyHash

  return secp256k1.getPublicKey(hexToUint8Array(privateKey), true)
}

/**
 * Derive public key from private key and encode as base64
 * @param privateKey - Private key as Uint8Array
 * @returns Base64 encoded compressed public key
 */
export const privateKeyToPublicKeyBase64 = (privateKey: Uint8Array): string => {
  return uint8ArrayToBase64(privateKeyToPublicKey(privateKey))
}

/**
 * Derive public key from private key hash and encode as base64
 * @param privateKeyHash - Private key as hex string (with or without 0x prefix)
 * @returns Base64 encoded compressed public key
 */
export const privateKeyHashToPublicKeyBase64 = (
  privateKeyHash: string,
): string => {
  return uint8ArrayToBase64(privateKeyHashToPublicKey(privateKeyHash))
}

/**
 * Hash only the domain portion of EIP-712 typed data
 * @param message - EIP-712 typed data definition
 * @returns Hash of the domain
 */
export const domainHash = (message: TypedDataDefinition) => {
  const domainTypedData: TypedDataDefinition = {
    domain: message.domain,
    types: message.types,
    primaryType: 'EIP712Domain',
    message: {},
  }

  return hashTypedData(domainTypedData)
}

/**
 * Hash only the message portion of EIP-712 typed data
 * @param message - EIP-712 typed data definition
 * @returns Hash of the message
 */
export const messageHash = (message: TypedDataDefinition) => {
  const messageTypedData: TypedDataDefinition = {
    domain: {},
    types: message.types,
    primaryType: message.primaryType,
    message: message.message,
  }

  return hashTypedData(messageTypedData)
}

/**
 * Decompress a compressed public key (starts with 02 or 03)
 * If the key is already 64 bytes, prepends '04' to make it uncompressed
 * @param startsWith02Or03 - Compressed public key hex string
 * @returns Decompressed public key hex string (without 04 prefix)
 */
export function decompressPubKey(startsWith02Or03: string): string {
  const testBuffer = hexToUint8Array(startsWith02Or03)

  if (testBuffer.length === 64) {
    startsWith02Or03 = '04' + startsWith02Or03
  }

  const point = secp256k1.ProjectivePoint.fromHex(startsWith02Or03)

  const decompressed = point.toHex(false)

  if (!decompressed.startsWith('04')) return decompressed

  return decompressed.slice(2)
}

/**
 * Convert public key to Ethereum address using Keccak256
 * @param pubKey - Public key as Uint8Array (64 bytes uncompressed or 33 bytes compressed)
 * @param sanitize - If true, will decompress compressed keys before hashing
 * @returns Ethereum address (20 bytes)
 * @throws Error if pubKey length is not 64 after sanitization
 */
export const publicKeyToAddress = function (
  pubKey: Uint8Array,
  sanitize: boolean = false,
): Uint8Array {
  if (sanitize && pubKey.length !== 64) {
    pubKey = secp256k1.ProjectivePoint.fromHex(pubKey)
      .toRawBytes(false)
      .slice(1)
  }

  if (pubKey.length !== 64) {
    throw new Error('Expected pubKey to be of length 64')
  }

  return keccak256(pubKey, 'bytes').subarray(-20)
}

/**
 * Sanitize typed data by converting BigInt values to strings
 * Recursively processes objects and arrays
 * @param data - Data to sanitize (can be object, array, or primitive)
 * @returns Sanitized data with BigInt values converted to strings
 */
export const sanitizeTypedData = <
  T extends
    | object
    | any[]
    | bigint
    | string
    | number
    | boolean
    | null
    | undefined,
>(
  data: T,
): T => {
  switch (Object.prototype.toString.call(data)) {
    case '[object Object]': {
      const entries = Object.keys(data as object).map((k) => [
        k,
        sanitizeTypedData((data as any)[k]),
      ])

      return Object.fromEntries(entries) as T
    }

    case '[object Array]':
      return (data as any[]).map((v) => sanitizeTypedData(v)) as T

    case '[object BigInt]':
      return bigIntToString(data) as unknown as T

    default:
      return data
  }
}

// Interface to match the original Buffer-like return type
interface BufferLike {
  toString(encoding?: string): string
}

// Create a hashStruct function that mimics the original behavior
function hashStruct(
  primaryType: string,
  data: any,
  types: any,
  _version?: string,
): BufferLike {
  if (!data) {
    throw new Error('Invalid data: data is empty')
  }

  // For EIP-712, we need to create a complete structure
  // The original implementation would hash just the specific part
  let typedData: TypedDataDefinition

  if (primaryType === 'EIP712Domain') {
    // For domain hash, we only need the domain data
    typedData = {
      domain: data,
      types: { EIP712Domain: types.EIP712Domain },
      primaryType: 'EIP712Domain',
      message: {},
    }
  } else {
    // For message hash, we need the complete structure
    // Use the domain data if it's available in types
    typedData = {
      domain: types.domain || {},
      types,
      primaryType,
      message: data,
    }
  }

  const hash = hashTypedData(typedData)

  return {
    toString: (encoding?: string) => {
      if (encoding === 'hex') {
        return hash.slice(2) // Remove 0x prefix for hex string
      }

      return hash
    },
  }
}

// Maintain backward compatibility with existing exports
export const TypedDataUtilsSanitizeData = sanitizeTypedData
export const TypedDataUtilsHashStruct: (
  primaryType: string,
  data: any,
  types: any,
  _version?: string,
) => BufferLike = hashStruct
export const SignTypedDataVersionV4 = 'V4' as const
export type TypedMessageV4 = TypedDataDefinition
