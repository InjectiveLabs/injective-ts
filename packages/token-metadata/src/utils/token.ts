import { ibcBaseDenoms } from '../tokens/tokens'
import { Token, TokenMetaBase, TokenType } from '../types'
import { getCw20Meta, getIbcMeta } from './helpers'
import { getTokenInfo } from './meta'

/**
 * We only need to perform the base denom check
 * when we are getting token metadata
 * from symbol
 **/
export const getTokenFromMetaIncludingIbcBaseDenoms = (
  meta: TokenMetaBase,
  denom?: string,
): Token => {
  const isBaseIbcDenom =
    ibcBaseDenoms.includes(denom || '') || meta.ibcs?.find(ibc => ibc.baseDenom.includes(denom || ''))

  const tokenMeta = getTokenFromMeta(meta, denom)

  const token = {
    ...meta,
    denom: denom || '',
  }

  return {
    ...token,
    ...getTokenInfo(token),
    tokenType: isBaseIbcDenom ? TokenType.Ibc : tokenMeta.tokenType,
    denom: denom || '',
    ...(token.cw20s && { cw20: getCw20Meta(token) }),
    ...(token.ibcs && { ibc: getIbcMeta(token) }),
  } as Token
}

export const getTokenFromMeta = (
  meta: TokenMetaBase,
  denom?: string,
): Token => {
  const token = {
    ...meta,
    denom: denom || '',
  }
  const tokenInfo = getTokenInfo(token)

  return {
    ...token,
    ...tokenInfo,
    ...(token.cw20s && { cw20: getCw20Meta(token) }),
    ...(token.ibcs && { ibc: getIbcMeta(token) }),
  } as Token
}
