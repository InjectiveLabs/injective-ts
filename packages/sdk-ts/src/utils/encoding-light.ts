import { base64 } from '@scure/base'

const HEX_PATTERN = /^[0-9a-fA-F]*$/

const normalizeHex = (hex: string): string => {
  if (typeof hex !== 'string') {
    throw new Error('Hex string must be a string')
  }

  if (hex.trim() === '') {
    throw new Error('Hex string cannot be empty')
  }

  const actualHex = hex.replace(/^0x/i, '')

  if (!HEX_PATTERN.test(actualHex) || actualHex.length % 2 !== 0) {
    throw new Error(`Invalid hex string: ${hex}`)
  }

  return actualHex
}

const bigIntReplacer = (_key: string, value: unknown): unknown =>
  typeof value === 'bigint' ? value.toString() : value

export function hexToUint8Array(hex: string): Uint8Array {
  const actualHex = normalizeHex(hex)

  return Uint8Array.from(
    actualHex.match(/.{1,2}/g)?.map((byte) => Number.parseInt(byte, 16)) || [],
  )
}

export function uint8ArrayToHex(arr: Uint8Array): string {
  return Array.from(arr, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function base64ToUint8Array(base64String: string): Uint8Array {
  if (typeof base64String !== 'string') {
    throw new Error('Base64 string must be a string')
  }

  if (base64String.trim() === '') {
    throw new Error('Base64 string cannot be empty')
  }

  try {
    return base64.decode(base64String)
  } catch {
    throw new Error(`Invalid base64 string: ${base64String}`)
  }
}

export function uint8ArrayToBase64(arr: Uint8Array): string {
  return base64.encode(arr)
}

export function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str)
}

export function hexToBuff(hex: string): Uint8Array {
  return hexToUint8Array(hex.startsWith('0x') ? hex.slice(2) : hex)
}

export function hexToBase64(hex: string): string {
  return uint8ArrayToBase64(
    hexToUint8Array(hex.startsWith('0x') ? hex.slice(2) : hex),
  )
}

export function base64ToUtf8(base64String: string): string {
  return toUtf8(base64ToUint8Array(base64String))
}

export function fromUtf8(str: Uint8Array | string): Uint8Array {
  if (typeof str !== 'string') {
    return str
  }

  return stringToUint8Array(str)
}

export function toUtf8(data: Uint8Array | string): string {
  if (typeof data === 'string') {
    return data
  }

  return new TextDecoder().decode(data)
}

export function uint8ArrayToString(
  string: string | Uint8Array | null | undefined,
): string {
  if (!string) {
    return ''
  }

  if (string.constructor !== Uint8Array) {
    return string as string
  }

  return new TextDecoder().decode(string)
}

export function binaryToBase64(data: string | Uint8Array): string {
  return typeof data === 'string' ? data : uint8ArrayToBase64(data)
}

export function toBase64(data: Record<string, any>): string {
  return uint8ArrayToBase64(
    stringToUint8Array(JSON.stringify(data, bigIntReplacer)),
  )
}

export function fromBase64(payload: string): Record<string, any> {
  if (typeof payload !== 'string') {
    throw new Error('Base64 payload must be a string')
  }

  if (payload.trim() === '') {
    throw new Error('Base64 payload cannot be empty')
  }

  try {
    const decoded = new TextDecoder().decode(base64ToUint8Array(payload))

    return JSON.parse(decoded)
  } catch {
    throw new Error(`Failed to decode base64 JSON: ${payload}`)
  }
}

export function concatUint8Arrays(arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0)
  const result = new Uint8Array(totalLength)
  let offset = 0

  for (const arr of arrays) {
    result.set(arr, offset)
    offset += arr.length
  }

  return result
}
