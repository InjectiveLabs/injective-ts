import { erc20TokenMeta, TokenMeta } from '@injectivelabs/token-metadata'
import { CosmosChainId, TestnetCosmosChainId } from '../chains/types'

export interface TokenMetaWithNativeDenom extends TokenMeta {
  denom: string
}

export const cosmosNativeDenomsFromChainId = {
  [CosmosChainId.Cosmoshub]: {
    ...erc20TokenMeta.getMetaBySymbol('ATOM'),
    denom: 'uatom',
  },
  [CosmosChainId.Osmosis]: [
    {
      ...erc20TokenMeta.getMetaBySymbol('OSMO'),
      denom: 'uosmo',
    },
    {
      ...erc20TokenMeta.getMetaBySymbol('INJ'),
      denom:
        'ibc/64BA6E31FE887D66C6F8F31C7B1A80C7CA179239677B4088BB55F5EA07DBE273',
    },
  ],
  [CosmosChainId.Terra]: [
    {
      ...erc20TokenMeta.getMetaBySymbol('LUNA'),
      denom: 'uluna',
    },
    {
      ...erc20TokenMeta.getMetaBySymbol('UST'),
      denom: 'uusd',
    },
  ],
  [CosmosChainId.Injective]: {
    ...erc20TokenMeta.getMetaBySymbol('INJ'),
    denom: 'inj',
  },
  [CosmosChainId.Chihuahua]: {
    ...erc20TokenMeta.getMetaBySymbol('HUAHUA'),
    denom: 'uhuahua',
  },
  [CosmosChainId.Juno]: {
    ...erc20TokenMeta.getMetaBySymbol('JUNO'),
    denom: 'ujuno',
  },
  [CosmosChainId.Axelar]: {
    ...erc20TokenMeta.getMetaBySymbol('AXL'),
    denom: 'uaxl',
  },
  [CosmosChainId.Evmos]: {
    ...erc20TokenMeta.getMetaBySymbol('EVMOS'),
    denom: 'aevmos',
  },
  [CosmosChainId.Persistence]: {
    ...erc20TokenMeta.getMetaBySymbol('XRPT'),
    denom: 'uxprt',
  },
  [TestnetCosmosChainId.Cosmoshub]: {
    ...erc20TokenMeta.getMetaBySymbol('UPHOTON'),
    denom: 'uphoton',
  },
  [TestnetCosmosChainId.Injective]: {
    ...erc20TokenMeta.getMetaBySymbol('INJ'),
    denom: 'inj',
  },
} as Record<string, TokenMetaWithNativeDenom | TokenMetaWithNativeDenom[]>
