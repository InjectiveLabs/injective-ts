import { INJ_DENOM } from '@injectivelabs/utils'
import {
  Token,
  TokenMeta,
  TokenType,
  Cw20TokenSingle,
  Cw20TokenSource,
} from './types'
import { ibcBaseDenoms } from './tokens/tokens'

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

export const getTokenFromMeta = (meta: TokenMeta, denom?: string) => {
  const isBaseIbcDenom =
    ibcBaseDenoms.includes(denom || '') || meta.ibc?.baseDenom === denom

  if (isBaseIbcDenom) {
    return {
      ...meta,
      denom: denom || '',
      tokenType: TokenType.Ibc,
    }
  }

  return {
    ...meta,
    denom: denom || '',
    tokenType: getTokenTypeFromDenom(denom || ''),
  }
}

/**
 * This function can be used to get a token with
 * cw20 information when we have multiple
 * cw20 variations of the same token based on the address/denom
 */
export const getCw20TokenSingle = (
  token: Token | TokenMeta,
  source?: Cw20TokenSource,
): Cw20TokenSingle | undefined => {
  const { cw20, cw20s } = token
  const denom = (token as Token).denom || ''

  if (!cw20 && !cw20s) {
    return
  }

  if (cw20) {
    return {
      ...token,
      cw20,
      denom: cw20.address,
      tokenType: getTokenTypeFromDenom(cw20.address),
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
            denom: cw20.address,
            symbol: cw20.symbol,
            tokenType: getTokenTypeFromDenom(cw20.address),
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
            denom: cw20.address,
            symbol: cw20.symbol,
            tokenType: getTokenTypeFromDenom(cw20.address),
          }
        : undefined
    }
  }

  return undefined
}
