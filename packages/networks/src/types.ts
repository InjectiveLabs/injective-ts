export enum Network {
  Local = 'local',
  Internal = 'internal',
  Devnet = 'devnet',
  Staking = 'staking',
  Mainnet = 'mainnet',
}

export type UrlEndpoint = {
  baseUrl: string
  chainUrl: string
  exchangeUrl: string
  explorerUrl: string
}
