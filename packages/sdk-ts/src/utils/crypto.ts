import SHA256 from 'crypto-js/sha256.js'
import RIPEMD160 from 'crypto-js/ripemd160.js'
import Base64 from 'crypto-js/enc-base64.js'
import * as secp256k1 from 'secp256k1'
import { SignTypedDataVersion, TypedDataUtils } from '@metamask/eth-sig-util'

export const hashToHex = (data: string): string => {
  return SHA256(Base64.parse(data)).toString().toUpperCase()
}

export const sha256 = (data: Uint8Array): Uint8Array => {
  const dataInUtf8 = Buffer.from(data).toString('utf-8')

  return Uint8Array.from(Buffer.from(SHA256(dataInUtf8).toString(), 'hex'))
}

export const ripemd160 = (data: Uint8Array): Uint8Array => {
  const dataInUtf8 = Buffer.from(data).toString('utf-8')

  return Uint8Array.from(Buffer.from(RIPEMD160(dataInUtf8).toString(), 'hex'))
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
  // if already decompressed an not has trailing 04
  const testBuffer = Buffer.from(startsWith02Or03, 'hex')

  if (testBuffer.length === 64) startsWith02Or03 = '04' + startsWith02Or03

  let decompressed = uint8ArrayToHex(
    secp256k1.publicKeyConvert(hexToUnit8Array(startsWith02Or03), false),
  )

  // remove trailing 04
  decompressed = decompressed.substring(2)

  return decompressed
}
