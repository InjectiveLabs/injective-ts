import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'

export enum Network {
  MainnetK8s = 'mainnetK8s',
  MainnetLB = 'mainnetLB',
  Mainnet = 'mainnet',
  MainnetSentry = 'mainnetSentry',
  Staging = 'staging',
  Public = 'public',
  Internal = 'internal', // @deprecated
  TestnetK8s = 'testnetK8s',
  TestnetOld = 'testnetOld',
  TestnetSentry = 'testnetSentry',
  Testnet = 'testnet',
  Devnet1 = 'devnet1',
  Devnet2 = 'devnet2',
  Devnet = 'devnet',
  Local = 'local',
}

export type NetworkEndpoints = {
  indexer: string // Indexer API
  chronos: string
  explorer: string
  grpc: string // Sentry gRPC
  rest: string // LCD
  rpc?: string // Tendermint
  cache?: string // Cache Service
}

export type UrlEndpoints = NetworkEndpoints /** Deprecated */

export type ChainInfo = {
  feeDenom: string
  chainId: ChainId
  env: string
  ethereumChainId?: EthereumChainId
}
