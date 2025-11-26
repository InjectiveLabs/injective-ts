import type { ChainId, EvmChainId } from '@injectivelabs/ts-types'

export const Network = {
  MainnetK8s: 'mainnetK8s',
  MainnetLB: 'mainnetLB',
  Mainnet: 'mainnet',
  MainnetSentry: 'mainnetSentry',
  MainnetOld: 'mainnetOld',
  Staging: 'staging',
  Internal: 'internal', // @deprecated
  TestnetK8s: 'testnetK8s',
  TestnetOld: 'testnetOld',
  TestnetSentry: 'testnetSentry',
  Testnet: 'testnet',
  Devnet1: 'devnet1',
  Devnet2: 'devnet2',
  Devnet3: 'devnet3',
  Devnet: 'devnet',
  Local: 'local',
} as const

export type Network = (typeof Network)[keyof typeof Network]

export type NetworkEndpoints = {
  indexer: string // Indexer API
  grpc: string // Sentry gRPC
  rest: string // LCD
  rpc?: string // Tendermint
  cacheGrpc?: string // Cache gRPC service
  cacheRest?: string // Cache LCD service
  chronos?: string // Chronos Service
  web3gw?: string // Web3Gateway Service
  explorer?: string // Explorer Service
  chart?: string // Chart Service
}

export type UrlEndpoints = NetworkEndpoints /** Deprecated */

export type InjectiveEvmNetworkParams = {
  wInjAddress: string
  chainName: string
  chainId: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
}

export type ChainInfo = {
  feeDenom: string
  chainId: ChainId
  env: string
  evmChainId?: EvmChainId
  injectiveEvmNetworkParams: InjectiveEvmNetworkParams
}
