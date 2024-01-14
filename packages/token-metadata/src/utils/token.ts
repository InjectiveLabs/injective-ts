import { ibcBaseDenoms } from '../tokens/tokens'
import { Token, TokenMetaBase, TokenType } from '../types'
import { getTokenInfo } from './meta'

/** We only need to perform the base denom check when we are getting token metadata from symbol */
export const getTokenFromMetaIncludingIbcBaseDenoms = (
  meta: TokenMetaBase,
  denom?: string,
): Token => {
  const isBaseIbcDenom =
    ibcBaseDenoms.includes(denom || '') || meta.ibc?.baseDenom === denom

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

  return {
    ...token,
    ...getTokenInfo(token),
  } as Token
}
