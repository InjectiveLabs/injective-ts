import path from 'path'
import { TokenType } from '@injectivelabs/token-metadata'

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

  if (image === 'ibc') {
    return path.join(
      '/',
      'vendor',
      '@injectivelabs',
      'token-metadata',
      'ibc.svg',
    )
  }

  return path.join('/', 'vendor', '@injectivelabs', 'token-metadata', image)
}

export const getTokenTypeFromSlug = (slug: string) => {
  switch (true) {
    case slug.toLowerCase() === 'inj':
      return TokenType.Native
    case slug.toLowerCase() === 'usdt':
      return TokenType.ERC20
    default:
      return TokenType.IBC
  }
}
