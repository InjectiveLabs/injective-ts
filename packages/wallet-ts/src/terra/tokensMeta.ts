import { tokenMetaUtil, TokenMeta } from '@injectivelabs/token-metadata'
import { TerraChainId } from './types'

export interface TokenMetaWithDenom extends TokenMeta {
  denom: string
}

export const TerraTokensMeta = {
  [TerraChainId.Mainnet]: [
    {
      ...tokenMetaUtil.getMetaBySymbol('LUNA'),
      denom: 'uluna',
    },
    {
      ...tokenMetaUtil.getMetaBySymbol('UST'),
      denom: 'uusd',
    },
  ],
} as Record<TerraChainId, TokenMetaWithDenom[]>
