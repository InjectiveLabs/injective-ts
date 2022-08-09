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

  return path.join('/', 'vendor', '@injectivelabs', 'token-metadata', image)
}

export const getTokenLogoFromTokenType = (tokenType: TokenType) => {
  switch (true) {
    case tokenType === TokenType.InsuranceFund:
      return getTokenLogoWithVendorPathPrefix('insurance-fund.svg')
    case tokenType === TokenType.Native:
      return getTokenLogoWithVendorPathPrefix('injective-black-fill.svg')
    case tokenType === TokenType.Cw20:
      return getTokenLogoWithVendorPathPrefix('cw20.svg')
    case tokenType === TokenType.Ibc:
      return getTokenLogoWithVendorPathPrefix('ibc.svg')
    default:
      return getTokenLogoWithVendorPathPrefix('injective-black-fill.svg')
  }
}
