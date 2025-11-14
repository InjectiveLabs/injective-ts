/**
 * Encoding/decoding utilities using industry-standard libraries
 *
 * Uses viem for hex encoding and @scure/base for base64 encoding
 * to ensure compatibility, better performance, and reduce bundle size.
 *
 * These libraries are already dependencies in the project and are
 * battle-tested by millions of developers.
 */

import { base64 } from '@scure/base'
import { hexToBytes, bytesToHex } from 'viem'

/**
 * Convert a hex string to Uint8Array
 * @param hex - Hex string (with or without 0x prefix)
 * @returns Uint8Array
 * @throws Error if hex string is invalid
 */
export function hexToUint8Array(hex: string): Uint8Array {
  if (typeof hex !== 'string') {
    throw new Error('Hex string must be a string')
  }
  if (hex.trim() === '') {
    throw new Error('Hex string cannot be empty')
  }
  // Ensure hex has 0x prefix for viem
  const prefixedHex = hex.startsWith('0x') ? hex : `0x${hex}`
  try {
    return hexToBytes(prefixedHex as `0x${string}`)
  } catch {
    throw new Error(`Invalid hex string: ${hex}`)
  }
}

/**
 * Convert a Uint8Array to hex string
 * @param arr - Uint8Array to convert
 * @returns Hex string (without 0x prefix)
 */
export function uint8ArrayToHex(arr: Uint8Array): string {
  // viem returns hex with 0x prefix, remove it to match original behavior
  return bytesToHex(arr).slice(2)
}

/**
 * Convert a base64 string to Uint8Array
 * @param base64String - Base64 encoded string
 * @returns Uint8Array
 * @throws Error if base64 string is invalid
 */
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

/**
 * Convert a Uint8Array to base64 string
 * @param arr - Uint8Array to convert
 * @returns Base64 encoded string
 */
export function uint8ArrayToBase64(arr: Uint8Array): string {
  return base64.encode(arr)
}

/**
 * Convert a string to Uint8Array using UTF-8 encoding
 * @param str - String to encode
 * @returns Uint8Array
 */
export function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str)
}

/**
 * Convert a hex string to Uint8Array (buffer-like)
 * Handles hex strings with or without 0x prefix
 * @param hex - Hex string (with or without 0x prefix)
 * @returns Uint8Array
 */
export function hexToBuff(hex: string): Uint8Array {
  return hexToUint8Array(hex.startsWith('0x') ? hex.slice(2) : hex)
}

/**
 * Convert a hex string to base64 string
 * Handles hex strings with or without 0x prefix
 * @param hex - Hex string (with or without 0x prefix)
 * @returns Base64 encoded string
 */
export function hexToBase64(hex: string): string {
  return uint8ArrayToBase64(
    hexToUint8Array(hex.startsWith('0x') ? hex.slice(2) : hex),
  )
}

/**
 * Convert a base64 string to UTF-8 string
 * @param base64String - Base64 encoded string
 * @returns Decoded UTF-8 string
 * @throws Error if base64 string is invalid
 */
export function base64ToUtf8(base64String: string): string {
  return toUtf8(base64ToUint8Array(base64String))
}

/**
 * Convert a string or Uint8Array to Uint8Array using UTF-8 encoding
 * If input is already Uint8Array, returns it as-is
 * @param str - String or Uint8Array to encode
 * @returns Uint8Array
 */
export function fromUtf8(str: Uint8Array | string): Uint8Array {
  if (typeof str !== 'string') {
    return str
  }

  return stringToUint8Array(str)
}

/**
 * Convert a Uint8Array or string to string using UTF-8 decoding
 * If input is already a string, returns it as-is
 * @param data - Uint8Array or string to decode
 * @returns Decoded string
 */
export function toUtf8(data: Uint8Array | string): string {
  if (typeof data === 'string') {
    return data
  }

  return new TextDecoder().decode(data)
}

/**
 * Convert a Uint8Array, string, null, or undefined to string using UTF-8 decoding
 * More robust version that handles null/undefined gracefully
 * @param string - Uint8Array, string, null, or undefined to decode
 * @returns Decoded string (empty string if input is null/undefined)
 */
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

/**
 * Convert binary data (string or Uint8Array) to base64 string
 * If input is already a string, returns it as-is
 * @param data - String or Uint8Array to encode
 * @returns Base64 encoded string
 */
export function binaryToBase64(data: string | Uint8Array): string {
  return typeof data === 'string' ? data : uint8ArrayToBase64(data)
}

/**
 * Convert a JSON object to base64 string
 * @param data - JSON object to encode
 * @returns Base64 encoded string
 */
export function toBase64(data: Record<string, any>): string {
  return uint8ArrayToBase64(stringToUint8Array(JSON.stringify(data)))
}

/**
 * Convert a base64 string to JSON object
 * @param payload - Base64 encoded string
 * @returns Decoded JSON object
 * @throws Error if base64 string is invalid or contains invalid JSON
 */
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

/**
 * Concatenate multiple Uint8Arrays into a single Uint8Array
 * Replacement for Buffer.concat()
 * @param arrays - Array of Uint8Arrays to concatenate
 * @returns Concatenated Uint8Array
 */
export function concatUint8Arrays(arrays: Uint8Array[]): Uint8Array {
  if (arrays.length === 0) {
    return new Uint8Array(0)
  }

  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0)
  const result = new Uint8Array(totalLength)
  let offset = 0

  for (const arr of arrays) {
    result.set(arr, offset)
    offset += arr.length
  }

  return result
}
