import { UrlEndpoint } from './types'

export const urlEndpointsMainnet: UrlEndpoint = {
  baseUrl: 'https://staking-api.injective.network:4444/api',
  chainUrl: 'https://staking-grpc.injective.network',
  exchangeUrl: 'https://staking-api.injective.network:4444',
  explorerUrl: 'https://explorer-api.injective.network/v1',
}

export const urlEndpointsStaking: UrlEndpoint = {
  baseUrl: 'https://staking-api-testnet.injective.network:4444/api',
  chainUrl: 'https://staking-grpc-testnet.injective.network',
  exchangeUrl: 'https://staking-api-testnet.injective.network:4444',
  explorerUrl: 'https://explorer-api-testnet.injective.network/v1',
}

export const urlEndpointsDevnet: UrlEndpoint = {
  baseUrl: 'https://devnet-api.injective.dev:4444/api',
  chainUrl: 'https://devnet-grpc.injective.dev',
  exchangeUrl: 'https://devnet-api.injective.dev:4444',
  explorerUrl: 'https://explorer-api-testnet.injective.network/v1', // TODO
}

export const urlEndpointsPublic: UrlEndpoint = {
  baseUrl: 'https://public-api.injective.network:4444/api',
  chainUrl: 'https://public-grpc.injective.network',
  exchangeUrl: 'https://public-api.injective.network:4444',
  explorerUrl: 'https://public-explorer-api.injective.network',
}

export const urlEndpointsLocal: UrlEndpoint = {
  baseUrl: 'https://localhost:4444/api',
  chainUrl: 'http://localhost:9091',
  exchangeUrl: 'https://localhost:4444',
  explorerUrl: 'https://explorer-api-testnet.injective.network/v1', // TODO
}
