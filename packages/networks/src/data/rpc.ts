import { UrlEndpoint } from '../types'

export const urlEndpointsMainnet: UrlEndpoint = {
  baseUrl: '',
  chainUrl: '',
  exchangeUrl: '',
  explorerUrl: '',
}

export const urlEndpointsStaking: UrlEndpoint = {
  baseUrl: 'https://staking-api.injective.network/api',
  chainUrl: 'https://staking-evm.injective.network',
  exchangeUrl: 'https://staking-api.injective.network',
  explorerUrl: 'https://staking-explorer-api.injective.network/v1',
}

export const urlEndpointsDevnet: UrlEndpoint = {
  baseUrl: 'https://devnet-api.injective.dev:4444/api',
  chainUrl: 'https://devnet-evm.injective.dev',
  exchangeUrl: 'https://devnet-api.injective.dev:4444',
  explorerUrl: 'https://devnet-explorer-api.injective.dev',
}

export const urlEndpointsInternal: UrlEndpoint = {
  baseUrl: 'https://internal-api.injective.network/api',
  chainUrl: 'https://internal-evm.injective.network',
  exchangeUrl: 'https://internal-api.injective.network',
  explorerUrl: 'https://internal-explorer-api.injective.dev',
}

export const urlEndpointsLocal: UrlEndpoint = {
  baseUrl: 'https://localhost:4444/api',
  chainUrl: 'http://localhost:1317',
  exchangeUrl: 'https://localhost:4444',
  explorerUrl: 'https://testnet-explorer-api.injective.dev/v1',
}
