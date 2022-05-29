import { TokenMeta } from '@injectivelabs/token-metadata'

/**
 * Token is an interface that includes the denom
 * alongside the TokenMeta (name, decimals, symbol, etc)
 */
export interface Token extends TokenMeta {
  denom: string
  isIbc?: boolean
}

export interface IbcToken extends Token {
  baseDenom: string
  channelId: string
}
