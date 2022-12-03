import {
  TokenMeta,
  canonicalChannelIds,
  TokenType,
  Token,
} from '@injectivelabs/token-metadata'
import { INJ_DENOM } from '@injectivelabs/utils'

export const getTokenTypeFromDenom = (denom: string): TokenType => {
  if (denom === INJ_DENOM) {
    return TokenType.Native
  }

  if (denom.startsWith('peggy')) {
    return TokenType.Erc20
  }

  if (denom.startsWith('ibc')) {
    return TokenType.Ibc
  }

  if (denom.startsWith('share')) {
    return TokenType.InsuranceFund
  }

  if (denom.startsWith('factory')) {
    return TokenType.TokenFactory
  }

  return TokenType.Cw20
}

export const checkIsIbcDenomCanonical = (path: string): boolean => {
  const pathParts = path.replace('transfer/', '').split('/')

  /** More than one channelId */
  if (pathParts.length > 1) {
    return false
  }

  const [channelId] = pathParts

  return canonicalChannelIds.includes(channelId)
}

export const tokenMetaToToken = (
  tokenMeta: TokenMeta | undefined,
  denom: string,
): Token | undefined => {
  if (!tokenMeta) {
    return
  }

  return {
    denom,
    logo: tokenMeta.logo,
    symbol: tokenMeta.symbol,
    name: tokenMeta.name,
    decimals: tokenMeta.decimals,
    address: tokenMeta.address,
    tokenType: getTokenTypeFromDenom(denom),
    coinGeckoId: tokenMeta.coinGeckoId,
  }
}
