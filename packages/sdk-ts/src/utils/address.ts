import { bech32 } from '@scure/base'
import { toBytes, keccak256 } from 'viem'
import { uint8ArrayToHex } from './encoding.js'

/**
 * Get injective address from Ethereum hex address
 *
 * @param ethAddress string
 * @returns string
 */
export const getInjectiveAddress = (ethAddress: string): string => {
  const addressBuffer = toBytes(ethAddress.toString())

  return bech32.encode('inj', bech32.toWords(addressBuffer))
}

/**
 * Get ethereum address from injective bech32 address
 *
 * @param injectiveAddress string
 * @returns string
 */
export const getEthereumAddress = (injectiveAddress: string): string => {
  if (injectiveAddress.startsWith('0x')) {
    return injectiveAddress
  }

  const bytes = bech32.fromWords(
    bech32.decode(injectiveAddress as `${string}1${string}`).words,
  )
  return `0x${uint8ArrayToHex(bytes)}`
}

/**
 * Get ethereum address from injective bech32 address
 *
 * @param injectiveAddress string
 * @returns string
 */
export const getInjectiveAddressFromSubaccountId = (
  subaccountId: string,
): string => {
  const ethAddress = subaccountId.slice(0, 42)

  return getInjectiveAddress(ethAddress)
}

/**
 * Get default subaccount id from injective bech32 address
 *
 * @param injectiveAddress string
 * @returns string
 */
export const getDefaultSubaccountId = (injectiveAddress: string): string => {
  const bytes = bech32.fromWords(
    bech32.decode(injectiveAddress as `${string}1${string}`).words,
  )
  return `0x${uint8ArrayToHex(bytes)}${'0'.repeat(24)}`
}

/**
 * Get subaccount id from injective bech32 address and an index (defaults to 0)
 * @param injectiveAddress string
 * @param nonce number
 * @returns string
 */
export const getSubaccountId = (
  injectiveAddress: string,
  nonce = 0,
): string => {
  const bytes = bech32.fromWords(
    bech32.decode(injectiveAddress as `${string}1${string}`).words,
  )
  return `0x${uint8ArrayToHex(bytes)}${'0'.repeat(23)}${nonce}`
}

/** @deprecated - use getEthereumAddress */
export const getAddressFromInjectiveAddress = (address: string): string => {
  if (address.startsWith('0x')) {
    return address
  }

  const bytes = bech32.fromWords(
    bech32.decode(address as `${string}1${string}`).words,
  )
  return `0x${uint8ArrayToHex(bytes)}`
}

/**
 * Convert Ethereum address to checksummed format (EIP-55)
 * @param ethAddress - Ethereum address (with or without 0x prefix)
 * @returns Checksummed Ethereum address
 */
export const getChecksumAddress = (ethAddress: string): string => {
  const lowercasedAddress = ethAddress.toLowerCase().replace('0x', '')
  const addressHash = keccak256(lowercasedAddress as `0x${string}`).replace(
    '0x',
    '',
  )

  const checksumChars = lowercasedAddress.split('').map((char, i) => {
    return parseInt(addressHash[i], 16) > 7 ? char.toUpperCase() : char
  })

  return '0x' + checksumChars.join('')
}

/**
 * Check if address is a CW20 contract address
 * @param address - Address to check
 * @returns True if address is a CW20 contract address
 */
export const isCw20ContractAddress = (address: string): boolean =>
  address.length === 42 && address.startsWith('inj')

/**
 * Add 0x prefix to hex string if not present
 * @param hex - Hex string
 * @returns Hex string with 0x prefix
 */
export const addHexPrefix = (hex: string): string =>
  hex.startsWith('0x') ? hex : `0x${hex}`

/**
 * Remove 0x prefix from hex string if present
 * @param hex - Hex string
 * @returns Hex string without 0x prefix
 */
export const removeHexPrefix = (hex: string): string =>
  hex.startsWith('0x') ? hex.slice(2) : hex
