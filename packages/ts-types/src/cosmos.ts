export interface Coin {
  denom: string
  amount: string
}

export enum StreamOperation {
  Insert = 'insert',
  Delete = 'delete',
  Replace = 'replace',
  Update = 'update',
  Invalidate = 'invalidate',
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
  Evmos = 'evmos_9001-2',
  Persistence = 'core-1',
  Secret = 'secret-4',
}

export enum TestnetCosmosChainId {
  Injective = 'injective-888',
  Cosmoshub = 'cosmoshub-testnet',
}

export enum DevnetCosmosChainId {
  Injective = 'injective-777',
  Injective1 = 'injective-777',
}
