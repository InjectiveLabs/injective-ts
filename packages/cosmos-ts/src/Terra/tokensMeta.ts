import { Erc20TokenMeta, TokenMeta } from '@injectivelabs/token-metadata'
import { TerraChainId } from './types'

export interface TokenMetaWithDenom extends TokenMeta {
  denom: string
}

export const TerraTokensMeta = {
  [TerraChainId.Mainnet]: [
    {
      ...Erc20TokenMeta.getMetaBySymbol('LUNA'),
      denom: 'uluna',
    },
    {
      ...Erc20TokenMeta.getMetaBySymbol('UST'),
      denom: 'uusd',
    },
  ],
} as Record<TerraChainId, TokenMetaWithDenom[]>
