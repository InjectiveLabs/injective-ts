import { erc20TokenMeta, TokenMeta } from '@injectivelabs/token-metadata'
import { TerraChainId } from './types'

export interface TokenMetaWithDenom extends TokenMeta {
  denom: string
}

export const TerraTokensMeta = {
  [TerraChainId.Mainnet]: [
    {
      ...erc20TokenMeta.getMetaBySymbol('LUNA'),
      denom: 'uluna',
    },
    {
      ...erc20TokenMeta.getMetaBySymbol('UST'),
      denom: 'uusd',
    },
  ],
} as Record<TerraChainId, TokenMetaWithDenom[]>
