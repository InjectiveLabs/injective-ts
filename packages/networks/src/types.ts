import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'

export enum Network {
  MainnetK8s = 'mainnetK8s',
  Mainnet = 'mainnet',
  Staging = 'staging',
  Public = 'public',
  TestnetK8s = 'testnetK8s',
  TestnetOld = 'testnetOld',
  Testnet = 'testnet',
  Devnet1 = 'devnet1',
  Devnet2 = 'devnet2',
  Devnet = 'devnet',
  Local = 'local',
}

export type OldNetworkEndpoints = {
  indexerApi: string
  sentryGrpcApi: string
  sentryHttpApi: string
  tendermintApi?: string
  chronosApi?: string
  exchangeWeb3GatewayApi?: string
}

export type NetworkEndpoints = {
  indexer: string // Indexer API
  chronos: string
  explorer: string
  grpc: string // Sentry gRPC
  rest: string // LCD
  rpc?: string // Tendermint
}

export type UrlEndpoints = NetworkEndpoints /** Deprecated */

export type ChainInfo = {
  feeDenom: string
  chainId: ChainId
  env: string
  ethereumChainId?: EthereumChainId
}
