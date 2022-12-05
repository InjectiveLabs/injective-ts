import { bech32 } from 'bech32'
import { Address } from 'ethereumjs-util'

/**
 * Get injective address from Ethereum hex address
 *
 * @param ethAddress string
 * @returns string
 */
export const getInjectiveAddress = (ethAddress: string): string => {
  const addressBuffer = Address.fromString(ethAddress.toString()).toBuffer()

  return bech32.encode('inj', bech32.toWords(addressBuffer))
}

/**
 * Get ethereum address from injective bech32 address
 *
 * @param ethAddress string
 * @returns string
 */
export const getEthereumAddress = (injectiveAddress: string): string => {
  if (injectiveAddress.startsWith('0x')) {
    return injectiveAddress
  }

  return `0x${Buffer.from(
    bech32.fromWords(bech32.decode(injectiveAddress).words),
  ).toString('hex')}`
}

/** @deprecated - use getEthereumAddress */
export const getAddressFromInjectiveAddress = (address: string): string => {
  if (address.startsWith('0x')) {
    return address
  }

  return `0x${Buffer.from(
    bech32.fromWords(bech32.decode(address).words),
  ).toString('hex')}`
}
