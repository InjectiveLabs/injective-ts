import { OldNetworkEndpoints } from './types'

export const oldEndpointsMainnetK8s: OldNetworkEndpoints = {
  indexerApi: 'https://k8s.mainnet.exchange.grpc-web.injective.network',
  sentryGrpcApi: 'https://k8s.mainnet.chain.grpc-web.injective.network',
  tendermintApi: 'https://k8s.mainnet.tm.injective.network',
  sentryHttpApi: 'https://k8s.mainnet.lcd.injective.network',
}

export const oldEndpointsMainnet: OldNetworkEndpoints = {
  indexerApi: 'https://api.injective.network',
  sentryGrpcApi: 'https://grpc.injective.network',
  tendermintApi: 'https://tm.injective.network',
  sentryHttpApi: 'https://lcd.injective.network',
}

export const oldEndpointsStaging: OldNetworkEndpoints = {
  indexerApi: 'https://staging.api.injective.network',
  sentryGrpcApi: 'https://staging.grpc.injective.network',
  tendermintApi: 'https://staging.tm.injective.network',
  sentryHttpApi: 'https://staging.lcd.injective.network',
}

export const oldEndpointsPublic: OldNetworkEndpoints = {
  indexerApi: 'https://public.api.injective.network',
  sentryGrpcApi: 'https://public.grpc.injective.network',
  tendermintApi: 'https://tm.injective.network',
  sentryHttpApi: 'https://public.lcd.injective.network',
}

export const oldEndpointsTestnetK8s: OldNetworkEndpoints = {
  indexerApi: 'https://k8s.testnet.exchange.grpc-web.injective.network',
  sentryGrpcApi: 'https://k8s.testnet.chain.grpc-web.injective.network',
  tendermintApi: 'https://k8s.testnet.tm.injective.network',
  sentryHttpApi: 'https://k8s.testnet.lcd.injective.network',
}

export const oldEndpointsTestnet: OldNetworkEndpoints = {
  ...oldEndpointsTestnetK8s,
}

export const oldEndpointsDevnet: OldNetworkEndpoints = {
  indexerApi: 'https://devnet.api.injective.dev',
  sentryGrpcApi: 'https://devnet.grpc.injective.dev',
  tendermintApi: 'https://devnet.tm.injective.dev',
  sentryHttpApi: 'https://devnet.lcd.injective.dev',
}

export const oldEndpointsDevnet1: OldNetworkEndpoints = {
  indexerApi: 'https://devnet-1.api.injective.dev',
  sentryGrpcApi: 'https://devnet-1.grpc.injective.dev',
  tendermintApi: 'https://devnet-1.tm.injective.dev',
  sentryHttpApi: 'https://devnet-1.lcd.injective.dev',
}

export const oldEndpointsDevnet2: OldNetworkEndpoints = {
  indexerApi: 'https://devnet-2.api.injective.dev',
  sentryGrpcApi: 'https://devnet-2.grpc.injective.dev',
  tendermintApi: 'https://devnet-2.tm.injective.dev',
  sentryHttpApi: 'https://devnet-2.lcd.injective.dev',
}

export const oldEndpointsLocal: OldNetworkEndpoints = {
  indexerApi: 'https://localhost:4444',
  sentryGrpcApi: 'http://localhost:9091',
  tendermintApi: 'http://localhost:9091',
  sentryHttpApi: 'http://localhost:9091',
}
