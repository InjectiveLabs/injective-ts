import { INJ_DENOM } from '@injectivelabs/utils'
import {
  Token,
  Cw20TokenSingle,
  Cw20TokenSource,
  TokenType,
  IbcToken,
} from './types'
import { canonicalChannelIds } from './ibc'

/**
 * This class can be used to get a token with
 * cw20 information when we have multiple
 * cw20 variations of the same token based on the address/denom
 */
export const getCw20TokenSingle = (
  token: Token,
  source?: Cw20TokenSource,
): Cw20TokenSingle | undefined => {
  const { cw20, cw20s, denom } = token

  if (!cw20 && !cw20s) {
    return
  }

  if (cw20) {
    return {
      ...token,
      cw20,
      tokenType: TokenType.Cw20,
    }
  }

  if (cw20s) {
    if (denom) {
      const [cw20Address] = denom.startsWith('inj')
        ? [denom]
        : denom.split('/').reverse()

      const cw20 = cw20s.find(
        (cw20) => cw20.address.toLowerCase() === cw20Address.toLowerCase(),
      )

      return cw20
        ? {
            ...token,
            cw20,
            symbol: cw20.symbol,
            tokenType: TokenType.Cw20,
          }
        : undefined
    }

    if (source) {
      const cw20 = cw20s.find(
        (cw20) => cw20.source.toLowerCase() === source.toLowerCase(),
      )

      return cw20
        ? {
            ...token,
            cw20,
            symbol: cw20.symbol,
            tokenType: TokenType.Cw20,
          }
        : undefined
    }
  }

  return undefined
}

export const isIbcTokenCanonical = (token: IbcToken) => {
  const { denom } = token

  if (!denom.startsWith('ibc/') || !token.ibc) {
    return false
  }

  const pathParts = token.ibc.path.replace('transfer/', '').split('/')

  /** More than one channelId */
  if (pathParts.length > 1) {
    return false
  }

  const [channelId] = pathParts

  return canonicalChannelIds.includes(channelId)
}

export const getTokenTypeFromDenom = (denom: string) => {
  if (denom === INJ_DENOM) {
    return TokenType.Native
  }

  if (denom.startsWith('inj')) {
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

export const getTokenDecimals = (token: Token) => {
  if (token.denom === INJ_DENOM) {
    return token.decimals
  }

  if (token.denom.startsWith('inj')) {
    return token.cw20?.decimals || token.decimals
  }

  if (token.denom.startsWith('factory/')) {
    return token.decimals
  }

  if (token.denom.startsWith('peggy')) {
    return token.erc20?.decimals || token.decimals
  }

  if (token.denom.startsWith('share')) {
    return token.decimals
  }

  return token.decimals
}

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
