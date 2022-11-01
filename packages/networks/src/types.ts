export enum Network {
  MainnetK8s = 'mainnetK8s',
  Mainnet = 'mainnet',
  Staging = 'staging',
  Public = 'public',
  TestnetK8s = 'testnetK8s',
  Testnet = 'testnet',
  Devnet1 = 'devnet1',
  Devnet = 'devnet',
  Local = 'local',
}

export type NetworkEndpoints = {
  indexerApi: string
  sentryGrpcApi: string
  sentryHttpApi: string
  tendermintApi?: string
  chronosApi?: string
  exchangeWeb3GatewayApi?: string
}

export type UrlEndpoints = NetworkEndpoints /** Deprecated */

export type ChainInfo = { feeDenom: string; chainId: string; env: string }
