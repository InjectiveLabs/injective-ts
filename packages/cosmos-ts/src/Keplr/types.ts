import { erc20TokenMeta, TokenMeta } from '@injectivelabs/token-metadata'

export interface TokenMetaWithNativeDenom extends TokenMeta {
  denom: string
}

export enum CosmosChainId {
  Injective = 'injective-1',
  Cosmoshub = 'cosmoshub-4',
  Juno = 'juno-1',
  Osmosis = 'osmosis-1',
  Terra = 'columbus-5',
  TerraUST = 'columbus-5',
  Chihuahua = 'chihuahua-1',
  Axelar = 'axelar-dojo-1',
}

export enum TestnetCosmosChainId {
  Injective = 'injective-888',
  Cosmoshub = 'cosmoshub-testnet',
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
  [TestnetCosmosChainId.Cosmoshub]: {
    ...erc20TokenMeta.getMetaBySymbol('UPHOTON'),
    denom: 'uphoton',
  },
  [TestnetCosmosChainId.Injective]: {
    ...erc20TokenMeta.getMetaBySymbol('INJ'),
    denom: 'inj',
  },
} as Record<string, TokenMetaWithNativeDenom | TokenMetaWithNativeDenom[]>
