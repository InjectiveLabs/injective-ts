import path from 'path'
import { TokenType } from '@injectivelabs/token-metadata'
import { validatorAddressToPathMap } from './mappings'
// @ts-ignore
import validatorToAddressMapFromKeybase from '../validators-logo/mappings.json'

export const getTokenLogoWithVendorPathPrefix = (image: string) => {
  if (image.includes('@injectivelabs')) {
    return image
  }

  if (image.includes('http')) {
    return image
  }

  // not supported yet
  if (image.includes('ipfs')) {
    return path.join('/', 'vendor', '@injectivelabs', 'token-metadata', 'unknown.png')
  }

  if (image.includes('bridgingNetworks')) {
    return image
  }

  return path.join('/', 'vendor', '@injectivelabs', 'token-metadata', image)
}

export const getTokenLogoFromTokenType = (tokenType: TokenType) => {
  switch (true) {
    case tokenType === TokenType.InsuranceFund:
      return getTokenLogoWithVendorPathPrefix('insurance-fund.png')
    case tokenType === TokenType.Native:
      return getTokenLogoWithVendorPathPrefix('injective-black-fill.png')
    case tokenType === TokenType.Cw20:
      return getTokenLogoWithVendorPathPrefix('cw20.png')
    case tokenType === TokenType.Ibc:
      return getTokenLogoWithVendorPathPrefix('ibc.png')
    default:
      return getTokenLogoWithVendorPathPrefix('injective-black-fill.png')
  }
}

export const getValidatorLogoWithVendorPathPrefix = (
  validatorAddress: string,
) => {
  const validatorToAddressFromKeybaseMap = JSON.parse(
    JSON.stringify(validatorToAddressMapFromKeybase),
  )

  const validatorLogoPath = validatorToAddressFromKeybaseMap[validatorAddress]
    ? validatorToAddressFromKeybaseMap[validatorAddress]
    : validatorAddressToPathMap[validatorAddress]

  return path.join(
    '/',
    'vendor',
    '@injectivelabs',
    'sdk-ui-ts',
    validatorLogoPath ? validatorLogoPath : 'unknown.png',
  )
}
