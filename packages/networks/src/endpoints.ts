import { NetworkEndpoints } from './types'

export const urlEndpointsMainnetK8s: NetworkEndpoints = {
  indexerApi: 'https://k8s.mainnet.exchange.grpc.injective.network',
  chronosApi: 'https://k8s.mainnet.exchange.grpc.injective.network',
  sentryGrpcApi: 'https://k8s.mainnet.grpc.injective.network/',
  tendermintApi: 'https://k8s.mainnet.tm.injective.network/',
  sentryHttpApi: 'https://k8s.mainnet.lcd.injective.network/',
  exchangeWeb3GatewayApi: 'https://k8s.mainnet.exchange.grpc.injective.network',
}

export const urlEndpointsMainnet: NetworkEndpoints = {
  indexerApi: 'https://api.injective.network',
  chronosApi: 'https://api.injective.network',
  sentryGrpcApi: 'https://grpc.injective.network',
  tendermintApi: 'https://tm.injective.network',
  sentryHttpApi: 'https://lcd.injective.network',
  exchangeWeb3GatewayApi: 'https://web3-gateway.injective.network',
}

export const urlEndpointsStaging: NetworkEndpoints = {
  indexerApi: 'https://staging.api.injective.network',
  chronosApi: 'https://staging.api.injective.network',
  sentryGrpcApi: 'https://staging.grpc.injective.network',
  tendermintApi: 'https://staging.tm.injective.network',
  sentryHttpApi: 'https://staging.lcd.injective.network',
  exchangeWeb3GatewayApi: 'https://web3-gateway.injective.network',
}

export const urlEndpointsPublic: NetworkEndpoints = {
  indexerApi: 'https://public.api.injective.network',
  chronosApi: 'https://public.api.injective.network',
  sentryGrpcApi: 'https://public.grpc.injective.network',
  tendermintApi: 'https://tm.injective.network',
  sentryHttpApi: 'https://public.lcd.injective.network',
  exchangeWeb3GatewayApi: 'https://public.web3-gateway.injective.network',
}

export const urlEndpointsTestnetK8s: NetworkEndpoints = {
  indexerApi: 'https://k8s.testnet.exchange.grpc-web.injective.network',
  chronosApi: 'https://k8s.testnet.exchange.grpc-web.injective.network',
  sentryGrpcApi: 'https://k8s.testnet.chain.grpc-web.injective.network',
  tendermintApi: 'https://k8s.testnet.tm.injective.network',
  sentryHttpApi: 'https://k8s.testnet.lcd.injective.network',
  exchangeWeb3GatewayApi: 'https://staging.web3-gateway.injective.network',
}

export const urlEndpointsTestnet: NetworkEndpoints = {
  ...urlEndpointsTestnetK8s,
}

export const urlEndpointsDevnet: NetworkEndpoints = {
  indexerApi: 'https://devnet.api.injective.dev',
  chronosApi: 'https://devnet.api.injective.dev',
  sentryGrpcApi: 'https://devnet.grpc.injective.dev',
  tendermintApi: 'https://devnet.tm.injective.dev',
  sentryHttpApi: 'https://devnet.lcd.injective.dev',
  exchangeWeb3GatewayApi: 'https://devnet.gateway.injective.dev',
}

export const urlEndpointsDevnet1: NetworkEndpoints = {
  indexerApi: 'https://devnet-1.api.injective.dev',
  chronosApi: 'https://devnet-1.api.injective.dev',
  sentryGrpcApi: 'https://devnet-1.grpc.injective.dev',
  tendermintApi: 'https://devnet-1.tm.injective.dev',
  sentryHttpApi: 'https://devnet-1.lcd.injective.dev',
  exchangeWeb3GatewayApi: 'https://devnet-1.gateway.injective.dev',
}

export const urlEndpointsLocal: NetworkEndpoints = {
  indexerApi: 'https://localhost:4444',
  chronosApi: 'https://localhost:4444',
  sentryGrpcApi: 'http://localhost:9091',
  tendermintApi: 'http://localhost:9091',
  sentryHttpApi: 'http://localhost:9091',
  exchangeWeb3GatewayApi: 'https://localhost:4445',
}
