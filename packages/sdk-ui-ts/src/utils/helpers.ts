import path from 'path'
import { TokenType, IbcToken, Token } from '@injectivelabs/token-metadata'

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

export const getTokenLogoFromTokenType = (token: Token) => {
  const { tokenType, logo } = token
  const { isCanonical } = token as IbcToken

  const isIbcOrEthTokenWithVendorLogo =
    logo && logo !== '' && logo !== TokenType.Cw20

  switch (true) {
    case tokenType === TokenType.InsuranceFund:
      return getTokenLogoWithVendorPathPrefix('insurance-fund.svg')
    case tokenType === TokenType.Native:
      return getTokenLogoWithVendorPathPrefix('injective-black-fill.svg')
    case tokenType === TokenType.Cw20 && !logo:
      return getTokenLogoWithVendorPathPrefix('cw20.svg')
    case tokenType === TokenType.Cw20 && logo:
      return logo
    case tokenType === TokenType.Ibc && !isCanonical:
      return getTokenLogoWithVendorPathPrefix('ibc.svg')
    case isIbcOrEthTokenWithVendorLogo:
      return getTokenLogoWithVendorPathPrefix(logo)
    default:
      return getTokenLogoWithVendorPathPrefix('injective-black-fill.svg')
  }
}
