import { getEthereumAddress, getInjectiveAddress } from '@injectivelabs/sdk-ts'

export const getInjectiveSignerAddress = (address: string | undefined) => {
  if (!address) {
    return ''
  }

  if (address.startsWith('inj')) {
    return address
  }

  if (address.startsWith('0x')) {
    return getInjectiveAddress(address)
  }

  return ''
}

export const getEthereumSignerAddress = (address: string | undefined) => {
  if (!address) {
    return ''
  }

  if (address.startsWith('0x')) {
    return address
  }

  if (address.startsWith('inj')) {
    return getEthereumAddress(address)
  }

  return ''
}
