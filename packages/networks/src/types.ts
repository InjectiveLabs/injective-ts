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

export type UrlEndpoint = {
  exchangeApi: string
  sentryGrpcApi: string
  sentryHttpApi: string
  tendermintApi?: string
  exchangeWeb3GatewayApi?: string
}
