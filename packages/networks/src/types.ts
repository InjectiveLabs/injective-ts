export enum Network {
  Local = 'local',
  Public = 'public',
  Devnet = 'devnet',
  Testnet = 'testnet',
  Mainnet = 'mainnet',
  MainnetOld = 'mainnetOld',
}

export type UrlEndpoint = {
  baseUrl: string
  chainUrl: string
  tmUrl: string
  chainHttpUrl: string
  exchangeUrl: string
  dmmExchangeUrl: string
  exchangeGatewayUrl: string
  explorerUrl: string
}
