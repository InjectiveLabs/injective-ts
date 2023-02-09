import { tokenMetaUtils, TokenMeta } from '@injectivelabs/token-metadata'
import { TerraChainId } from './types'

export interface TokenMetaWithDenom extends TokenMeta {
  denom: string
}

export const TerraTokensMeta = {
  [TerraChainId.Mainnet]: [
    {
      ...tokenMetaUtils.getMetaBySymbol('LUNA'),
      denom: 'uluna',
    },
    {
      ...tokenMetaUtils.getMetaBySymbol('UST'),
      denom: 'uusd',
    },
  ],
} as Record<TerraChainId, TokenMetaWithDenom[]>
