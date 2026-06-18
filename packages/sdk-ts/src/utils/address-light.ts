import { bech32 } from '@scure/base'

const HEX_PATTERN = /^[0-9a-fA-F]*$/

const normalizeHex = (hex: string): string => {
  const actualHex = removeHexPrefix(hex)

  if (!HEX_PATTERN.test(actualHex) || actualHex.length % 2 !== 0) {
    throw new Error(`Invalid hex string: ${hex}`)
  }

  return actualHex
}

const getInjectiveAddressBytes = (injectiveAddress: string): Uint8Array => {
  return bech32.fromWords(
    bech32.decode(injectiveAddress as `${string}1${string}`).words,
  )
}

export const bytesToHex = (bytes: number[] | Uint8Array): string =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')

export const hexToBytes = (hex: string): Uint8Array => {
  const actualHex = normalizeHex(hex)

  return Uint8Array.from(
    actualHex.match(/.{1,2}/g)?.map((byte) => Number.parseInt(byte, 16)) || [],
  )
}

export const getInjectiveAddress = (ethAddress: string): string => {
  const addressBytes = hexToBytes(ethAddress)

  if (addressBytes.length !== 20) {
    throw new Error(`Invalid Ethereum address: ${ethAddress}`)
  }

  return bech32.encode('inj', bech32.toWords(addressBytes))
}

export const getEthereumAddress = (injectiveAddress: string): string => {
  if (injectiveAddress.startsWith('0x')) {
    return injectiveAddress
  }

  const bytes = getInjectiveAddressBytes(injectiveAddress)

  return `0x${bytesToHex(bytes)}`
}

export const getInjectiveAddressFromSubaccountId = (
  subaccountId: string,
): string => {
  const ethAddress = subaccountId.slice(0, 42)

  return getInjectiveAddress(ethAddress)
}

export const getDefaultSubaccountId = (injectiveAddress: string): string => {
  const bytes = getInjectiveAddressBytes(injectiveAddress)

  return `0x${bytesToHex(bytes)}${'0'.repeat(24)}`
}

export const getSubaccountId = (
  injectiveAddress: string,
  nonce = 0,
): string => {
  const bytes = getInjectiveAddressBytes(injectiveAddress)

  if (!Number.isInteger(nonce) || nonce < 0 || nonce > 255) {
    throw new Error('Invalid nonce, must be an integer between 0 and 255')
  }

  const nonceInHex = nonce.toString(16).padStart(2, '0')

  return `0x${bytesToHex(bytes)}${'0'.repeat(22)}${nonceInHex}`
}

export const getAddressFromInjectiveAddress = (address: string): string => {
  return getEthereumAddress(address)
}

export const isCw20ContractAddress = (address: string): boolean =>
  address.length === 42 && address.startsWith('inj')

export const addHexPrefix = (hex: string): string =>
  hex.startsWith('0x') ? hex : `0x${hex}`

export const removeHexPrefix = (hex: string): string => hex.replace(/^0x/i, '')
