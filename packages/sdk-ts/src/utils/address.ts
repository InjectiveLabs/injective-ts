import { keccak256 } from 'viem'
import {
  bytesToHex,
  hexToBytes,
  addHexPrefix,
  removeHexPrefix,
  getSubaccountId,
  getEthereumAddress,
  getInjectiveAddress,
  isCw20ContractAddress,
  getDefaultSubaccountId,
  getAddressFromInjectiveAddress,
  getInjectiveAddressFromSubaccountId,
} from './address-light.js'
import type { Hash } from 'viem'

export {
  bytesToHex,
  hexToBytes,
  addHexPrefix,
  removeHexPrefix,
  getSubaccountId,
  getEthereumAddress,
  getInjectiveAddress,
  isCw20ContractAddress,
  getDefaultSubaccountId,
  getAddressFromInjectiveAddress,
  getInjectiveAddressFromSubaccountId,
}

/**
 * Convert Ethereum address to checksummed format (EIP-55)
 * @param ethAddress - Ethereum address (with or without 0x prefix)
 * @returns Checksummed Ethereum address
 */
export const getChecksumAddress = (ethAddress: string): string => {
  const lowercasedAddress = ethAddress.toLowerCase().replace('0x', '')
  const addressHash = keccak256(lowercasedAddress as Hash).replace('0x', '')

  const checksumChars = lowercasedAddress.split('').map((char, i) => {
    return parseInt(addressHash[i], 16) > 7 ? char.toUpperCase() : char
  })

  return '0x' + checksumChars.join('')
}
