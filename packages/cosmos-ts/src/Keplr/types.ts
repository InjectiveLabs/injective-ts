import { Erc20TokenMeta, TokenMeta } from '@injectivelabs/token-metadata'

export interface TokenMetaWithNativeDenom extends TokenMeta {
  denom: string
}

export enum CosmosChainId {
  Injective = 'injective-1',
  Cosmoshub = 'cosmoshub-4',
  Terra = 'columbus-5',
  TerraUST = 'columbus-5',
}

export enum TestnetCosmosChainId {
  Injective = 'injective-888',
  Cosmoshub = 'cosmoshub-testnet',
}

export const cosmosNativeDenomsFromChainId = {
  [CosmosChainId.Cosmoshub]: {
    ...Erc20TokenMeta.getMetaBySymbol('ATOM'),
    denom: 'uatom',
  },
  [CosmosChainId.Terra]: [
    {
      ...Erc20TokenMeta.getMetaBySymbol('LUNA'),
      denom: 'uluna',
    },
    {
      ...Erc20TokenMeta.getMetaBySymbol('UST'),
      denom: 'uusd',
    },
  ],
  [CosmosChainId.Injective]: {
    ...Erc20TokenMeta.getMetaBySymbol('INJ'),
    denom: 'inj',
  },
  [TestnetCosmosChainId.Cosmoshub]: {
    ...Erc20TokenMeta.getMetaBySymbol('UPHOTON'),
    denom: 'uphoton',
  },
  [TestnetCosmosChainId.Injective]: {
    ...Erc20TokenMeta.getMetaBySymbol('INJ'),
    denom: 'inj',
  },
} as Record<string, TokenMetaWithNativeDenom | TokenMetaWithNativeDenom[]>
