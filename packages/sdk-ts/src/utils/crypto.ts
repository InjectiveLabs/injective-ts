// import CryptoEs from 'crypto-es'
import CryptoEs from 'crypto-js'
import { secp256k1 } from '@noble/curves/secp256k1'
import keccak256 from 'keccak256'
import {
  TypedMessage,
  MessageTypes,
  TypedDataUtils,
  SignTypedDataVersion,
} from '@metamask/eth-sig-util'

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

export const domainHash = (message: any) =>
  TypedDataUtils.hashStruct(
    'EIP712Domain',
    message.domain,
    message.types,
    SignTypedDataVersion.V4,
  )

export const messageHash = (message: any) =>
  TypedDataUtils.hashStruct(
    message.primaryType,
    message.message,
    message.types,
    SignTypedDataVersion.V4,
  )

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

  return keccak256(Buffer.from(pubKey)).subarray(-20)
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

export const TypedDataUtilsSanitizeData = TypedDataUtils.sanitizeData
export const TypedDataUtilsHashStruct = TypedDataUtils.hashStruct
export const SignTypedDataVersionV4 = SignTypedDataVersion.V4
export type TypedMessageV4 = TypedMessage<MessageTypes>
