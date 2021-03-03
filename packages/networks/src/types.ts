export enum Network {
  Local = 'local',
  Devnet = 'devnet',
  Staking = 'staking',
  Mainnet = 'mainnet',
}

export enum Region {
  af = 'Africa',
  an = 'Antartica',
  as = 'Asia',
  eu = 'Europe',
  na = 'North America',
  oc = 'Oceania',
  sa = 'South America',
  Africa = 'af',
  Antartica = 'an',
  Asia = 'as',
  Europe = 'eu',
  NorthAmerica = 'na',
  Oceania = 'oc',
  SouthAmerica = 'sa',
}

export interface RegionResponse {
  data: {
    continent: string
    country: string
  }
}

export type UrlEndpoint = {
  baseUrl: string
  chainUrl: string
  exchangeUrl: string
}

export interface UrlEndpointUrls {
  america: UrlEndpoint
  europe: UrlEndpoint
  asia: UrlEndpoint
}

export type Rpc = string

export interface RpcUrls {
  america: Rpc
  europe: Rpc
  asia: Rpc
}

export type GraphUrl = string
