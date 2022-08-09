export enum Network {
  Local = 'local',
  Public = 'public',
  Devnet = 'devnet',
  Devnet1 = 'devnet1',
  Testnet = 'testnet',
  TestnetK8s = 'testnetK8s',
  Mainnet = 'mainnet',
  Staging = 'staging',
  MainnetStaging = 'mainnetStaging',
  MainnetK8s = 'mainnetK8s',
  MainnetOld = 'mainnetOld',
}

export type NetworkEndpoints = {
  exchangeApi: string // @deprecated
  indexerApi: string
  sentryGrpcApi: string
  sentryHttpApi: string
  tendermintApi?: string
  chronosApi?: string
  exchangeWeb3GatewayApi?: string
}

export type UrlEndpoints = NetworkEndpoints /** Deprecated */

export type ChainInfo = { feeDenom: string; chainId: string; env: string }
