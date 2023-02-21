import { INJ_DENOM } from '@injectivelabs/utils'
import {
  Token,
  TokenMeta,
  TokenType,
  NativeToken,
  IbcTokenMeta,
  Cw20TokenMeta,
  Cw20TokenSource,
} from './types'
import { ibcBaseDenoms } from './tokens/tokens'
import { getChannelIdFromPath } from './ibc'

export const getCw20Meta = (token: Token): Cw20TokenMeta | undefined => {
  const denomToLowerCase = token.denom.toLowerCase()
  return token.cw20s?.find((meta) =>
    denomToLowerCase.includes(meta.address.toLowerCase()),
  )
}

export const getIbcMeta = (token: Token): IbcTokenMeta | undefined =>
  token.ibcs?.find((meta) => token.denom.includes(meta.hash))

export const getIbcTokenMetaFromDenomTrace = ({
  hash,
  path,
  decimals,
  baseDenom,
}: {
  decimals: number
  hash: string
  path: string
  baseDenom: string
}): IbcTokenMeta => ({
  hash,
  path,
  baseDenom,
  decimals,
  channelId: getChannelIdFromPath(path),
  isNative: !baseDenom.startsWith('ibc'),
  tokenType: TokenType.Ibc,
})

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
  if (token.denom === INJ_DENOM) {
    return token.symbol
  }

  if (token.denom.startsWith('inj') || token.denom.startsWith('factory/')) {
    const meta = getCw20Meta(token) as Cw20TokenMeta

    return meta?.symbol || token.symbol
  }

  if (token.denom.startsWith('peggy')) {
    return token.erc20?.symbol || token.symbol
  }

  if (token.denom.startsWith('ibc')) {
    const meta = getIbcMeta(token)

    return meta?.symbol || token.symbol
  }

  return token.symbol
}

export const getTokenDecimals = (token: Token) => {
  if (token.denom === INJ_DENOM) {
    return token.decimals
  }

  if (token.denom.startsWith('inj') || token.denom.startsWith('factory/')) {
    const meta = getCw20Meta(token)

    return meta?.decimals || token.decimals
  }

  if (token.denom.startsWith('ibc')) {
    const meta = getIbcMeta(token)

    return meta?.decimals || token.decimals
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

  if (token.denom.startsWith('inj') || token.denom.startsWith('factory/')) {
    const meta = getCw20Meta(token)

    return meta?.address || ''
  }

  if (token.denom.startsWith('peggy')) {
    return token.erc20?.address
  }

  if (token.denom.startsWith('share')) {
    return ''
  }

  return ''
}

/**
 * This function can be used to get the cw20 token meta filter by source
 */
export const getCw20TokenBySource = (
  token: Token,
  source: Cw20TokenSource,
): NativeToken | undefined => {
  const { denom } = token

  const cw20TokenBySource = token.cw20s?.find((meta) => meta.source === source)

  if (!cw20TokenBySource) {
    return
  }

  return {
    ...token,
    ...cw20TokenBySource,
    denom,
  }
}

export const getTokenFromMeta = (meta: TokenMeta, denom: string): Token => {
  const isBaseIbcDenom = ibcBaseDenoms.includes(denom)

  const tokenType = isBaseIbcDenom
    ? TokenType.Ibc
    : getTokenTypeFromDenom(denom)

  const token = {
    ...meta,
    denom,
    tokenType,
  }

  const tokenWithDecimalsAndSymbol = {
    ...token,
    tokenType,
    decimals: getTokenDecimals(token),
    symbol: getTokenSymbol(token),
  }

  if (![TokenType.TokenFactory, TokenType.Cw20].includes(tokenType)) {
    return tokenWithDecimalsAndSymbol
  }

  /**
   * Filter the correct cw20 meta based on denom
   */

  const cw20meta = getCw20Meta({
    ...meta,
    denom,
    cw20s: meta.cw20s,
    tokenType: TokenType.Cw20,
  })

  if (cw20meta) {
    return {
      ...meta,
      ...cw20meta,
      denom,
      cw20s: meta.cw20s,
      tokenType: TokenType.Cw20,
    }
  }

  return tokenWithDecimalsAndSymbol
}
