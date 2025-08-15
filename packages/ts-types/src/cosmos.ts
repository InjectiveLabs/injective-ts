export interface Coin {
  denom: string
  amount: string
}

export type CosmosChainIdType =
  | 'injective-1'
  | 'cosmoshub-4'
  | 'juno-1'
  | 'osmosis-1'
  | 'columbus-5'
  | 'chihuahua-1'
  | 'axelar-dojo-1'
  | 'evmos_9001-2'
  | 'core-1'
  | 'secret-4'
  | 'stride-1'
  | 'crescent-1'
  | 'sommelier-3'
  | 'canto_7700-1'
  | 'kava_2222-10'
  | 'Oraichain'
  | 'noble-1'
  | 'celestia'
  | 'migaloo-1'
  | 'kaiyo-1'
  | 'wormchain'
  | 'andromeda-1'
  | 'ssc-1'
  | 'neutron-1'
  | 'fetchhub-4'

export const CosmosChainId = {
  Injective: 'injective-1',
  Cosmoshub: 'cosmoshub-4',
  Juno: 'juno-1',
  Osmosis: 'osmosis-1',
  Terra: 'columbus-5',
  TerraUST: 'columbus-5',
  Chihuahua: 'chihuahua-1',
  Axelar: 'axelar-dojo-1',
  Evmos: 'evmos_9001-2',
  Persistence: 'core-1',
  Secret: 'secret-4',
  Stride: 'stride-1',
  Crescent: 'crescent-1',
  Sommelier: 'sommelier-3',
  Canto: 'canto_7700-1',
  Kava: 'kava_2222-10',
  Oraichain: 'Oraichain',
  Noble: 'noble-1',
  Celestia: 'celestia',
  Migaloo: 'migaloo-1',
  Kujira: 'kaiyo-1',
  Wormchain: 'wormchain',
  Andromeda: 'andromeda-1',
  Saga: 'ssc-1',
  Neutron: 'neutron-1',
  Fetch: 'fetchhub-4',
} as const

export type TestnetCosmosChainIdType =
  | 'injective-888'
  | 'theta-testnet-001'
  | 'evmos_9000-4'
  | 'xion-testnet-1'

export const TestnetCosmosChainId = {
  Injective: 'injective-888',
  Cosmoshub: 'theta-testnet-001',
  Evmos: 'evmos_9000-4',
  Xion: 'xion-testnet-1',
} as const

export type DevnetCosmosChainIdType = 'injective-777'

export const DevnetCosmosChainId = {
  Injective: 'injective-777',
  Injective1: 'injective-777',
  Injective2: 'injective-777',
} as const
