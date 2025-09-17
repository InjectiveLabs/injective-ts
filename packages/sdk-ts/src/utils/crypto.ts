// import CryptoEs from 'crypto-es'
import CryptoEs from 'crypto-js'
import { keccak256 } from 'viem'
import { hashTypedData } from 'viem'
import { secp256k1 } from '@noble/curves/secp256k1'
import type { TypedDataDefinition } from 'viem'

export const hashToHex = (data: string): string => {
  return CryptoEs.SHA256(CryptoEs.enc.Base64.parse(data))
    .toString()
    .toUpperCase()
}

export const sha256 = (data: Uint8Array): Uint8Array => {
  const wordArray = CryptoEs.lib.WordArray.create(data)
  const hash = CryptoEs.SHA256(wordArray)

  return Uint8Array.from(Buffer.from(hash.toString(), 'hex'))
}

export const ripemd160 = (data: Uint8Array): Uint8Array => {
  const wordArray = CryptoEs.lib.WordArray.create(data)
  const hash = CryptoEs.RIPEMD160(wordArray)

  return Uint8Array.from(Buffer.from(hash.toString(), 'hex'))
}

export const privateKeyToPublicKey = (privateKey: Uint8Array): Uint8Array => {
  return secp256k1.getPublicKey(privateKey, true)
}

export const privateKeyHashToPublicKey = (
  privateKeyHash: string,
): Uint8Array => {
  const privateKey = privateKeyHash.startsWith('0x')
    ? privateKeyHash.slice(2)
    : privateKeyHash

  return secp256k1.getPublicKey(Buffer.from(privateKey, 'hex'), true)
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

// Hash only the domain portion
export const domainHash = (message: TypedDataDefinition) => {
  const domainTypedData: TypedDataDefinition = {
    domain: message.domain,
    types: message.types,
    primaryType: 'EIP712Domain',
    message: {},
  }
  return hashTypedData(domainTypedData)
}

// Hash only the message portion
export const messageHash = (message: TypedDataDefinition) => {
  const messageTypedData: TypedDataDefinition = {
    domain: {},
    types: message.types,
    primaryType: message.primaryType,
    message: message.message,
  }
  return hashTypedData(messageTypedData)
}

export function uint8ArrayToHex(arr: Uint8Array) {
  return Buffer.from(arr).toString('hex')
}

export function hexToUnit8Array(str: string) {
  return new Uint8Array(Buffer.from(str, 'hex'))
}

export function decompressPubKey(startsWith02Or03: string) {
  const testBuffer = Buffer.from(startsWith02Or03, 'hex')

  if (testBuffer.length === 64) startsWith02Or03 = '04' + startsWith02Or03

  const point = secp256k1.ProjectivePoint.fromHex(
    Buffer.from(testBuffer).toString('hex'),
  )

  const decompressed = point.toHex(false)

  if (!decompressed.startsWith('04')) return decompressed

  return decompressed.slice(2)
}

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

  return keccak256(Buffer.from(pubKey), 'bytes').subarray(-20)
}

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
      return (data as bigint).toString() as unknown as T

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
