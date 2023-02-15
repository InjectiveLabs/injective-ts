import { INJ_DENOM } from '@injectivelabs/utils'
import {
  Token,
  TokenMeta,
  TokenType,
  Cw20TokenSingle,
  Cw20TokenSource,
  Cw20TokenMeta,
  Cw20TokenMetaWithSource,
} from './types'
import { ibcBaseDenoms } from './tokens/tokens'

const getCw20Meta = (
  token: Token,
): Cw20TokenMetaWithSource | Cw20TokenMeta | undefined => {
  const denomToLowerCase = token.denom.toLowerCase()
  const cw20MetaFromCw20s = token.cw20s?.find((meta) =>
    denomToLowerCase.includes(meta.address.toLowerCase()),
  )

  return cw20MetaFromCw20s || token.cw20 || undefined
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

export const getTokenSymbol = (token: Token) => {
  if (token.denom.startsWith('factory/')) {
    const meta = getCw20Meta(token) as Cw20TokenMetaWithSource

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

export const getTokenDecimals = (token: Token) => {
  if (token.denom === INJ_DENOM) {
    return token.decimals
  }

  if (token.denom.startsWith('inj')) {
    return token.cw20?.decimals || token.decimals
  }

  if (token.denom.startsWith('factory/')) {
    const meta = getCw20Meta(token)

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

  const tokenType = isBaseIbcDenom
    ? TokenType.Ibc
    : getTokenTypeFromDenom(denom || '')

  const token = {
    ...meta,
    denom: denom || '',
    tokenType,
  }

  return {
    ...token,
    decimals: getTokenDecimals(token),
    symbol: getTokenSymbol(token),
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
