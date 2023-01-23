import { NetworkEndpoints } from './types'

export const endpointsMainnetK8s: NetworkEndpoints = {
  indexer: 'https://k8s.mainnet.exchange.grpc-web.injective.network',
  grpc: 'https://k8s.mainnet.chain.grpc-web.injective.network',
  rpc: 'https://k8s.mainnet.tm.injective.network',
  rest: 'https://k8s.mainnet.lcd.injective.network',
  chronos: 'https://k8s.mainnet.chronos.grpc-web.injective.network',
  explorer: 'https://k8s.mainnet.explorer.grpc-web.injective.network',
}

export const endpointsMainnetLB: NetworkEndpoints = {
  indexer: 'https://k8s.global.mainnet.exchange.grpc-web.injective.network',
  grpc: 'https://k8s.global.mainnet.chain.grpc-web.injective.network',
  rpc: 'https://k8s.global.mainnet.tm.injective.network',
  rest: 'https://k8s.global.mainnet.lcd.injective.network',
  chronos: 'https://k8s.global.mainnet.chronos.grpc-web.injective.network',
  explorer: 'https://k8s.global.mainnet.explorer.grpc-web.injective.network',
}

export const endpointsMainnet: NetworkEndpoints = {
  indexer: 'https://api.injective.network',
  grpc: 'https://grpc.injective.network',
  rpc: 'https://tm.injective.network',
  rest: 'https://lcd.injective.network',
  chronos: 'https://api.injective.network',
  explorer: 'https://api.injective.network',
}

export const endpointsStaging: NetworkEndpoints = {
  indexer: 'https://staging.api.injective.network',
  grpc: 'https://staging.grpc.injective.network',
  rpc: 'https://staging.tm.injective.network',
  rest: 'https://staging.lcd.injective.network',
  chronos: 'https://staging.api.injective.network',
  explorer: 'https://staging.api.injective.network',
}

export const endpointsPublic: NetworkEndpoints = {
  indexer: 'https://public.api.injective.network',
  grpc: 'https://public.grpc.injective.network',
  rpc: 'https://tm.injective.network',
  rest: 'https://public.lcd.injective.network',
  chronos: 'https://public.api.injective.network',
  explorer: 'https://public.api.injective.network',
}

export const endpointsTestnetK8s: NetworkEndpoints = {
  indexer: 'https://k8s.testnet.exchange.grpc-web.injective.network',
  grpc: 'https://k8s.testnet.chain.grpc-web.injective.network',
  rpc: 'https://k8s.testnet.tm.injective.network',
  rest: 'https://k8s.testnet.lcd.injective.network',
  chronos: 'https://k8s.testnet.chronos.grpc-web.injective.network',
  explorer: 'https://k8s.testnet.explorer.grpc-web.injective.network',
}

export const endpointsTestnet: NetworkEndpoints = {
  ...endpointsTestnetK8s,
}

export const endpointsTestnetOld: NetworkEndpoints = {
  indexer: 'https://testnet.api.injective.dev',
  grpc: 'https://testnet.grpc.injective.dev',
  rpc: 'https://testnet.tm.injective.dev',
  rest: 'https://testnet.lcd.injective.dev',
  chronos: 'https://testnet.api.injective.dev',
  explorer: 'https://testnet.api.injective.dev',
}

export const endpointsDevnet: NetworkEndpoints = {
  indexer: 'https://devnet.api.injective.dev',
  grpc: 'https://devnet.grpc.injective.dev',
  rpc: 'https://devnet.tm.injective.dev',
  rest: 'https://devnet.lcd.injective.dev',
  chronos: 'https://devnet.api.injective.dev',
  explorer: 'https://devnet.api.injective.dev',
}

export const endpointsDevnet1: NetworkEndpoints = {
  indexer: 'https://devnet-1.api.injective.dev',
  grpc: 'https://devnet-1.grpc.injective.dev',
  rpc: 'https://devnet-1.tm.injective.dev',
  rest: 'https://devnet-1.lcd.injective.dev',
  chronos: 'https://devnet-1.api.injective.dev',
  explorer: 'https://devnet-1.api.injective.dev',
}

export const endpointsDevnet2: NetworkEndpoints = {
  indexer: 'https://devnet-2.api.injective.dev',
  grpc: 'https://devnet-2.grpc.injective.dev',
  rpc: 'https://devnet-2.tm.injective.dev',
  rest: 'https://devnet-2.lcd.injective.dev',
  chronos: 'https://devnet-2.api.injective.dev',
  explorer: 'https://devnet-2.api.injective.dev',
}

export const endpointsLocal: NetworkEndpoints = {
  indexer: 'https://localhost:4444',
  grpc: 'http://localhost:9091',
  rpc: 'http://localhost:9091',
  rest: 'http://localhost:9091',
  chronos: 'https://localhost:4445',
  explorer: 'https://localhost:4446',
}
