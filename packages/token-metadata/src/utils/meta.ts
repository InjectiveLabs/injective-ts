import { INJ_DENOM } from '@injectivelabs/utils'
import { Cw20TokenMetaWithSource, Token, TokenBase, TokenType } from '../types'
import {
  getCw20Meta,
  getNativeTokenFactoryMeta,
  isCw20ContractAddress,
} from './helpers'

/** @deprecated - use getTokenInfo */
export const getTokenTypeFromDenom = (denom: string) => {
  if (denom === INJ_DENOM) {
    return TokenType.Native
  }

  if (isCw20ContractAddress(denom)) {
    return TokenType.Cw20
  }

  if (denom.startsWith('ibc')) {
    return TokenType.Ibc
  }

  if (denom.startsWith('factory/')) {
    return TokenType.TokenFactory
  }

  if (denom.startsWith('peggy')) {
    return TokenType.Erc20
  }

  if (denom.startsWith('share')) {
    return TokenType.InsuranceFund
  }

  return TokenType.Cw20
}

/** @deprecated - use getTokenInfo */
export const getTokenSymbol = (token: Token) => {
  if (token.denom.startsWith('factory/')) {
    const [address] = token.denom.split('/').reverse()

    if (isCw20ContractAddress(address)) {
      const meta = getCw20Meta(token) as Cw20TokenMetaWithSource

      return meta?.symbol || token.symbol
    }

    const meta = getNativeTokenFactoryMeta(token)

    return meta?.symbol || token.symbol
  }

  if (token.denom.startsWith('peggy')) {
    return token.erc20?.symbol || token.symbol
  }

  if (token.denom.startsWith('ibc')) {
    return token.ibc?.symbol || token.symbol
  }

  return token.symbol
}

/** @deprecated - use getTokenInfo */
export const getTokenLogo = (token: Token) => {
  if (isCw20ContractAddress(token.denom)) {
    return token.cw20?.name || token.name
  }

  if (token.denom.startsWith('factory/')) {
    const [address] = token.denom.split('/').reverse()

    if (isCw20ContractAddress(address)) {
      const meta = getCw20Meta(token) as Cw20TokenMetaWithSource

      return meta?.logo || token.logo
    }

    const meta = getNativeTokenFactoryMeta(token)

    return meta?.logo || token.logo
  }

  if (token.denom.startsWith('peggy')) {
    return token.erc20?.name || token.name
  }

  if (token.denom.startsWith('ibc')) {
    return token.ibc?.name || token.name
  }

  return token.name
}

/** @deprecated - use getTokenInfo */
export const getTokenName = (token: Token) => {
  if (isCw20ContractAddress(token.denom)) {
    return token.cw20?.name || token.name
  }

  if (token.denom.startsWith('factory/')) {
    const [address] = token.denom.split('/').reverse()

    if (isCw20ContractAddress(address)) {
      const meta = getCw20Meta(token) as Cw20TokenMetaWithSource

      return meta?.name || token.name
    }

    const meta = getNativeTokenFactoryMeta(token)

    return meta?.name || token.name
  }

  if (token.denom.startsWith('peggy')) {
    return token.erc20?.name || token.name
  }

  if (token.denom.startsWith('ibc')) {
    return token.ibc?.name || token.name
  }

  return token.name
}

/** @deprecated - use getTokenInfo */
export const getTokenDecimals = (token: Token) => {
  if (token.denom === INJ_DENOM) {
    return token.decimals
  }

  if (token.denom.startsWith('factory/')) {
    const [address] = token.denom.split('/').reverse()

    if (isCw20ContractAddress(address)) {
      const meta = getCw20Meta(token) as Cw20TokenMetaWithSource

      return meta?.decimals || token.decimals
    }

    const meta = getNativeTokenFactoryMeta(token)

    return meta?.decimals || token.decimals
  }

  if (token.denom.startsWith('ibc')) {
    return token.ibc?.decimals || token.decimals
  }

  if (token.denom.startsWith('peggy')) {
    return token.erc20?.decimals || token.decimals
  }

  if (token.denom.startsWith('share')) {
    return token.decimals
  }

  return token.decimals
}

/** @deprecated - use getTokenInfo */
export const getTokenAddress = (token: Token) => {
  if (token.denom === INJ_DENOM) {
    return token.erc20?.address
  }

  if (token.denom.startsWith('inj')) {
    return token.cw20?.address
  }

  if (token.denom.startsWith('factory/')) {
    const [, , address] = token.denom

    return address
  }

  if (token.denom.startsWith('peggy')) {
    return token.erc20?.address
  }

  if (token.denom.startsWith('share')) {
    return ''
  }

  return ''
}

export const getTokenInfo = (token: TokenBase) => {
  const tokenType = getTokenTypeFromDenom(token.denom)

  if (isCw20ContractAddress(token.denom)) {
    const meta = getCw20Meta(token) as Cw20TokenMetaWithSource

    return {
      symbol: meta?.symbol || token.symbol,
      name: meta?.name || token.name,
      logo: meta?.logo || token.logo,
      decimals: meta?.decimals || token.decimals,
      cw20: meta,
      tokenType,
    }
  }

  if (token.denom.startsWith('factory/')) {
    const [address] = token.denom.split('/').reverse()

    if (isCw20ContractAddress(address)) {
      const meta = getCw20Meta(token) as Cw20TokenMetaWithSource

      return {
        symbol: meta?.symbol || token.symbol || '',
        name: meta?.name || token.name || '',
        logo: meta?.logo || token.logo,
        decimals: meta?.decimals || token.decimals || 0,
        cw20: meta,
        tokenType,
      }
    }

    const meta = getNativeTokenFactoryMeta(token)

    return {
      symbol: meta?.symbol || token.symbol || '',
      name: meta?.name || token.name || '',
      logo: meta?.logo || token.logo || '',
      decimals: meta?.decimals || token.decimals || 0,
      tokenFactory: meta,
      tokenType,
    }
  }

  if (token.denom.startsWith('peggy')) {
    return {
      symbol: token.erc20?.symbol || token.symbol || '',
      name: token.erc20?.name || token.name || '',
      logo: token.erc20?.logo || token.logo || '',
      decimals: token.erc20?.decimals || token.decimals || 0,
      tokenType,
    }
  }

  if (token.denom.startsWith('ibc')) {
    return {
      symbol: token.ibc?.symbol || token.symbol || '',
      name: token.ibc?.name || token.name || '',
      logo: token.ibc?.logo || token.logo || '',
      decimals: token.ibc?.decimals || token.decimals || 0,
      tokenType,
    }
  }

  return {
    symbol: token.symbol || '',
    name: token.name || '',
    logo: token.logo || '',
    decimals: token.decimals || 0,
    tokenType,
  }
}
