import { NetworkEndpoints } from './types'

export const endpointsMainnetK8s: NetworkEndpoints = {
  indexer: 'https://k8s.mainnet.exchange.grpc-web.injective.network',
  grpc: 'https://k8s.mainnet.chain.grpc-web.injective.network',
  rpc: 'https://k8s.mainnet.tm.injective.network',
  rest: 'https://k8s.mainnet.lcd.injective.network',
}

export const endpointsMainnet: NetworkEndpoints = {
  indexer: 'https://api.injective.network',
  grpc: 'https://grpc.injective.network',
  rpc: 'https://tm.injective.network',
  rest: 'https://lcd.injective.network',
}

export const endpointsStaging: NetworkEndpoints = {
  indexer: 'https://staging.api.injective.network',
  grpc: 'https://staging.grpc.injective.network',
  rpc: 'https://staging.tm.injective.network',
  rest: 'https://staging.lcd.injective.network',
}

export const endpointsPublic: NetworkEndpoints = {
  indexer: 'https://public.api.injective.network',
  grpc: 'https://public.grpc.injective.network',
  rpc: 'https://tm.injective.network',
  rest: 'https://public.lcd.injective.network',
}

export const endpointsTestnetK8s: NetworkEndpoints = {
  indexer: 'https://k8s.testnet.exchange.grpc-web.injective.network',
  grpc: 'https://k8s.testnet.chain.grpc-web.injective.network',
  rpc: 'https://k8s.testnet.tm.injective.network',
  rest: 'https://k8s.testnet.lcd.injective.network',
}

export const endpointsTestnet: NetworkEndpoints = {
  ...endpointsTestnetK8s,
}

export const endpointsDevnet: NetworkEndpoints = {
  indexer: 'https://devnet.api.injective.dev',
  grpc: 'https://devnet.grpc.injective.dev',
  rpc: 'https://devnet.tm.injective.dev',
  rest: 'https://devnet.lcd.injective.dev',
}

export const endpointsDevnet1: NetworkEndpoints = {
  indexer: 'https://devnet-1.api.injective.dev',
  grpc: 'https://devnet-1.grpc.injective.dev',
  rpc: 'https://devnet-1.tm.injective.dev',
  rest: 'https://devnet-1.lcd.injective.dev',
}

export const endpointsLocal: NetworkEndpoints = {
  indexer: 'https://localhost:4444',
  grpc: 'http://localhost:9091',
  rpc: 'http://localhost:9091',
  rest: 'http://localhost:9091',
}
