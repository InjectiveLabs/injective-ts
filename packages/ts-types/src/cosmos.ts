export interface Coin {
  denom: string
  amount: string
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
  Stride = 'stride-1',
  Crescent = 'crescent-1',
  Sommelier = 'sommelier-3',
  Canto = 'canto_7700-1',
  Kava = 'kava_2222-10',
  Oraichain = 'Oraichain',
  Noble = 'noble-1',
  Celestia = 'celestia',
  Migaloo = 'migaloo-1',
  Kujira = 'kaiyo-1',
  Wormchain = 'wormchain',
  Andromeda = 'andromeda-1',
  Saga = 'ssc-1',
}

export enum TestnetCosmosChainId {
  Injective = 'injective-888',
  Cosmoshub = 'theta-testnet-001',
}

export enum DevnetCosmosChainId {
  Injective = 'injective-777',
  Injective1 = 'injective-777',
  Injective2 = 'injective-777',
}
