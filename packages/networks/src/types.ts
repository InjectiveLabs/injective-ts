export enum Network {
  Local = 'local',
  Public = 'public',
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
