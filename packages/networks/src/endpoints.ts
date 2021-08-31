import { UrlEndpoint } from './types'

export const urlEndpointsMainnet: UrlEndpoint = {
  baseUrl: 'https://k8s-api.injective.network/api',
  chainUrl: 'https://k8s-grpc.injective.network',
  chainHttpUrl: 'https://k8s-lcd.injective.network',
  exchangeUrl: 'https://k8s-api.injective.network',
  exchangeGatewayUrl: 'https://k8s-gateway.injective.network',
  explorerUrl: 'https://k8s-api.injective.network/api/explorer/v1',
}

export const urlEndpointsPublic: UrlEndpoint = {
  baseUrl: 'https://public-api.injective.network/api',
  chainUrl: 'https://public-grpc.injective.network',
  chainHttpUrl: 'https://public-lcd.injective.network',
  exchangeUrl: 'https://public-api.injective.network',
  exchangeGatewayUrl: 'https://public-gateway.injective.network',
  explorerUrl: 'https://public-api.injective.network/api/explorer/v1',
}

export const urlEndpointsMainnetOld: UrlEndpoint = {
  baseUrl: 'https://staking-api.injective.network/api',
  chainUrl: 'https://staking-grpc.injective.network',
  chainHttpUrl: 'https://staking-lcd.injective.network',
  exchangeUrl: 'https://staking-api.injective.network',
  exchangeGatewayUrl: 'https://staking-gateway.injective.network',
  explorerUrl: 'https://staking-api.injective.network/api/explorer/v1',
}

export const urlEndpointsStaking: UrlEndpoint = {
  baseUrl: 'https://staking-api-testnet.injective.network/api',
  chainUrl: 'https://staking-grpc-testnet.injective.network',
  chainHttpUrl: 'https://staking-lcd-testnet.injective.network',
  exchangeUrl: 'https://staking-api-testnet.injective.network',
  exchangeGatewayUrl: 'https://staking-gateway-testnet.injective.network',
  explorerUrl: 'https://staking-api-testnet.injective.network/api/explorer/v1',
}

export const urlEndpointsDevnet: UrlEndpoint = {
  baseUrl: 'https://devnet-api.injective.dev/api',
  chainUrl: 'https://devnet-grpc.injective.dev',
  chainHttpUrl: 'https://devnet-lcd.injective.dev',
  exchangeUrl: 'https://devnet-api.injective.dev',
  exchangeGatewayUrl: 'https://devnet-gateway.injective.dev',
  explorerUrl: 'https://devnet-api.injective.dev/api/explorer/v1',
}

export const urlEndpointsLocal: UrlEndpoint = {
  baseUrl: 'https://localhost:4444/api',
  chainUrl: 'http://localhost:9091',
  chainHttpUrl: 'http://localhost:9091',
  exchangeUrl: 'https://localhost:4444',
  exchangeGatewayUrl: 'https://localhost:4445',
  explorerUrl: 'https://localhost:4444/api/explorer/v1',
}
