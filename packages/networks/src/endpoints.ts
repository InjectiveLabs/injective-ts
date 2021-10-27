import { UrlEndpoint } from './types'

export const urlEndpointsMainnet: UrlEndpoint = {
  baseUrl: 'https://k8s-api.injective.network/api',
  chainUrl: 'https://k8s-grpc.injective.network',
  tmUrl: 'https://tm.injective.network',
  chainHttpUrl: 'https://k8s-lcd.injective.network',
  exchangeUrl: 'https://k8s-api.injective.network',
  exchangeGatewayUrl: 'https://k8s-gateway.injective.network',
  explorerUrl: 'https://k8s-api.injective.network/api/explorer/v1',
}

export const urlEndpointsPublic: UrlEndpoint = {
  baseUrl: 'https://public.api.injective.network/api',
  chainUrl: 'https://public.grpc.injective.network',
  tmUrl: 'https://public.tm.injective.network',
  chainHttpUrl: 'https://public.lcd.injective.network',
  exchangeUrl: 'https://public.api.injective.network',
  exchangeGatewayUrl: 'https://public.web3-gateway.injective.network',
  explorerUrl: 'https://public.api.injective.network/api/explorer/v1',
}

export const urlEndpointsMainnetOld: UrlEndpoint = {
  baseUrl: 'https://api.injective.network/api',
  chainUrl: 'https://grpc.injective.network',
  tmUrl: 'https://public.tm.injective.network',
  chainHttpUrl: 'https://lcd.injective.network',
  exchangeUrl: 'https://api.injective.network',
  exchangeGatewayUrl: 'https://web3-gateway.injective.network',
  explorerUrl: 'https://api.injective.network/api/explorer/v1',
}

export const urlEndpointsTestnet: UrlEndpoint = {
  baseUrl: 'https://testnet.api.injective.dev/api',
  chainUrl: 'https://testnet.grpc.injective.dev',
  tmUrl: 'https://testnet.tm.injective.dev',
  chainHttpUrl: 'https://testnet.lcd.injective.dev',
  exchangeUrl: 'https://testnet.api.injective.dev',
  exchangeGatewayUrl: 'https://testnet.web3-gateway.injective.dev',
  explorerUrl: 'https://testnet.api.injective.dev/api/explorer/v1',
}

export const urlEndpointsDevnet: UrlEndpoint = {
  baseUrl: 'https://devnet.api.injective.dev/api',
  chainUrl: 'https://devnet.grpc.injective.dev',
  tmUrl: 'https://devnet.tm.injective.dev',
  chainHttpUrl: 'https://devnet.lcd.injective.dev',
  exchangeUrl: 'https://devnet.api.injective.dev',
  exchangeGatewayUrl: 'https://devnet.gateway.injective.dev',
  explorerUrl: 'https://devnet.api.injective.dev/api/explorer/v1',
}

export const urlEndpointsLocal: UrlEndpoint = {
  baseUrl: 'https://localhost:4444/api',
  chainUrl: 'http://localhost:9091',
  tmUrl: 'http://localhost:9091',
  chainHttpUrl: 'http://localhost:9091',
  exchangeUrl: 'https://localhost:4444',
  exchangeGatewayUrl: 'https://localhost:4445',
  explorerUrl: 'https://localhost:4444/api/explorer/v1',
}
