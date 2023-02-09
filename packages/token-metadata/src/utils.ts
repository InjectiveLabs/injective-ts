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

  if (denom.startsWith('factory/')) {
    return TokenType.TokenFactory
  }

  if (denom.startsWith('peggy')) {
    return TokenType.Native
  }

  if (denom.startsWith('share')) {
    return TokenType.InsuranceFund
  }

  return TokenType.Cw20
}
