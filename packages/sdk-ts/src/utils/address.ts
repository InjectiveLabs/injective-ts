import { bech32 } from 'bech32'
import { Address } from 'ethereumjs-util'
import keccak256 from 'keccak256'

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
 * @param injectiveAddress string
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

/**
 * Get default subaccount id from injective bech32 address
 *
 * @param injectiveAddress string
 * @returns string
 */
export const getDefaultSubaccountId = (injectiveAddress: string): string => {
  return `0x${Buffer.from(
    bech32.fromWords(bech32.decode(injectiveAddress).words),
  ).toString('hex')}${'0'.repeat(24)}`
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

export const getChecksumAddress = (ethAddress: string) => {
  const lowercasedAddress = ethAddress.toLowerCase().replace('0x', '')
  const addressHash = keccak256(lowercasedAddress)
    .toString('hex')
    .replace('0x', '')

  let checksumAddress = '0x'

  for (var i = 0; i < lowercasedAddress.length; i++) {
    if (parseInt(addressHash[i], 16) > 7) {
      checksumAddress += lowercasedAddress[i].toUpperCase()
    } else {
      checksumAddress += lowercasedAddress[i]
    }
  }

  return checksumAddress
}
