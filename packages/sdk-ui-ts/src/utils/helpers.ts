import { TokenType } from '@injectivelabs/token-metadata'
import path from 'path'

export const getTokenLogoWithVendorPathPrefix = (image: string) => {
  if (image.includes('@injectivelabs')) {
    return image
  }

  if (image.includes('http')) {
    return image
  }

  if (image.includes('bridgingNetworks')) {
    return image
  }

  return path.join('/', 'vendor', '@injectivelabs', 'token-metadata', image)
}

export const getTokenTypeBaseOnAddress = (address: string): TokenType => {
  if (address.startsWith('inj')) {
    return TokenType.CW20
  }

  if (address.startsWith('ibc')) {
    return TokenType.IBC
  }

  return TokenType.ERC20
}
