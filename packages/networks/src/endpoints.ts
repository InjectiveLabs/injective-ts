import { UrlEndpoint } from './types'

export const urlEndpointsMainnetK8s: UrlEndpoint = {
  exchangeApi: 'https://k8s-api.injective.network',
  sentryGrpcApi: 'https://k8s-grpc.injective.network',
  tendermintApi: 'https://tm.injective.network',
  sentryHttpApi: 'https://k8s-lcd.injective.network',
  exchangeWeb3GatewayApi: 'https://k8s-gateway.injective.network',
}

export const urlEndpointsMainnet: UrlEndpoint = {
  exchangeApi: 'https://api.injective.network',
  sentryGrpcApi: 'https://grpc.injective.network',
  tendermintApi: 'https://tm.injective.network',
  sentryHttpApi: 'https://lcd.injective.network',
  exchangeWeb3GatewayApi: 'https://web3-gateway.injective.network',
}

export const urlEndpointsMainnetStaging: UrlEndpoint = {
  exchangeApi: 'https://staging.api.injective.network',
  sentryGrpcApi: 'https://staging.grpc.injective.network',
  tendermintApi: 'https://staging.tm.injective.network',
  sentryHttpApi: 'https://staging.lcd.injective.network',
  exchangeWeb3GatewayApi: 'https://web3-gateway.injective.network',
}

export const urlEndpointsMainnetOld: UrlEndpoint = {
  exchangeApi: 'https://api.injective.network',
  sentryGrpcApi: 'https://grpc.injective.network',
  tendermintApi: 'https://tm.injective.network',
  sentryHttpApi: 'https://lcd.injective.network',
  exchangeWeb3GatewayApi: 'https://web3-gateway.injective.network',
}

export const urlEndpointsPublic: UrlEndpoint = {
  exchangeApi: 'https://public.api.injective.network',
  sentryGrpcApi: 'https://public.grpc.injective.network',
  tendermintApi: 'https://tm.injective.network',
  sentryHttpApi: 'https://public.lcd.injective.network',
  exchangeWeb3GatewayApi: 'https://public.web3-gateway.injective.network',
}

export const urlEndpointsTestnet: UrlEndpoint = {
  exchangeApi: 'https://testnet.api.injective.dev',
  sentryGrpcApi: 'https://testnet.grpc.injective.dev',
  tendermintApi: 'https://testnet.tm.injective.dev',
  sentryHttpApi: 'https://testnet.lcd.injective.dev',
  exchangeWeb3GatewayApi: 'https://testnet.web3-gateway.injective.dev',
}

export const urlEndpointsTestnetK8s: UrlEndpoint = {
  exchangeApi: 'https://k8s.testnet.exchange.grpc-web.injective.network',
  sentryGrpcApi: 'https://k8s.testnet.chain.grpc-web.injective.network',
  tendermintApi: 'https://k8s.testnet.tm.injective.network',
  sentryHttpApi: 'https://k8s.testnet.lcd.injective.network',
  exchangeWeb3GatewayApi: 'https://staging.web3-gateway.injective.network',
}

export const urlEndpointsDevnet: UrlEndpoint = {
  exchangeApi: 'https://devnet.api.injective.dev',
  sentryGrpcApi: 'https://devnet.grpc.injective.dev',
  tendermintApi: 'https://devnet.tm.injective.dev',
  sentryHttpApi: 'https://devnet.lcd.injective.dev',
  exchangeWeb3GatewayApi: 'https://devnet.gateway.injective.dev',
}

export const urlEndpointsDevnet1: UrlEndpoint = {
  exchangeApi: 'https://devnet-1.api.injective.dev',
  sentryGrpcApi: 'https://devnet-1.grpc.injective.dev',
  tendermintApi: 'https://devnet-1.tm.injective.dev',
  sentryHttpApi: 'https://devnet-1.lcd.injective.dev',
  exchangeWeb3GatewayApi: 'https://devnet-1.gateway.injective.dev',
}

export const urlEndpointsLocal: UrlEndpoint = {
  exchangeApi: 'https://localhost:4444',
  sentryGrpcApi: 'http://localhost:9091',
  tendermintApi: 'http://localhost:9091',
  sentryHttpApi: 'http://localhost:9091',
  exchangeWeb3GatewayApi: 'https://localhost:4445',
}
