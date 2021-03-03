import { RpcUrls, GraphUrl, UrlEndpointUrls } from '../types'

export const rpcUrlsMainnet: RpcUrls = {
  america: 'https://testnet-evm-us.injective.dev',
  europe: 'https://testnet-evm-eu.injective.dev',
  asia: 'https://testnet-evm-ap.injective.dev',
}

export const rpcUrlsStaking: RpcUrls = {
  america: 'https://staking-evm.injective.network',
  europe: 'https://staking-evm.injective.network',
  asia: 'https://staking-evm.injective.network',
}

export const rpcUrlsLocal: RpcUrls = {
  america: 'http://localhost:1317',
  europe: 'http://localhost:1317',
  asia: 'http://localhost:1317',
}

export const rpcUrlsDevnet: RpcUrls = {
  america: 'https://devnet-evm.injective.dev',
  europe: 'https://devnet-evm.injective.dev',
  asia: 'https://devnet-evm.injective.dev',
}

export const wsRpcUrlsMainnet: RpcUrls = {
  america: 'wss://testnet-evm-us.injective.dev',
  europe: 'wss://testnet-evm-eu.injective.dev',
  asia: 'wss://testnet-evm-ap.injective.dev',
}

export const wsRpcUrlsStaking: RpcUrls = {
  america: 'wss://staking-evm.injective.network',
  europe: 'wss://staking-evm.injective.network',
  asia: 'wss://staking-evm.injective.network',
}

export const wsRpcUrlsLocal: RpcUrls = {
  america: 'ws://localhost:1318',
  europe: 'ws://localhost:1318',
  asia: 'ws://localhost:1318',
}

export const wsRpcUrlsDevnet: RpcUrls = {
  america: 'wss://devnet-evm.injective.dev',
  europe: 'wss://devnet-evm.injective.dev',
  asia: 'wss://devnet-evm.injective.dev',
}

export const graphUrlsLocal: GraphUrl =
  'http://localhost:8000/subgraphs/name/InjectiveLabs/futures-subgraph'

export const graphUrlsDevnet: GraphUrl =
  'https://devnet-thegraph.injective.dev/subgraphs/name/InjectiveLabs/futures-subgraph'

export const graphUrlsMainnet: GraphUrl =
  'https://thegraph.injective.dev/subgraphs/name/InjectiveLabs/futures-subgraph'

export const graphUrlsStaking: GraphUrl = ''

export const urlEndpointsMainnet: UrlEndpointUrls = {
  america: {
    baseUrl: 'https://testnet-api-eu.injective.dev/api',
    chainUrl: 'https://testnet-api-eu.injective.dev:44300',
    exchangeUrl: 'https://testnet-api-eu.injective.dev:44310',
  },

  europe: {
    baseUrl: 'https://testnet-api-eu.injective.dev/api',
    chainUrl: 'https://internal-evm.injective.dev',
    exchangeUrl: 'https://testnet-api-eu.injective.dev:44310',
  },

  asia: {
    baseUrl: 'https://testnet-api-eu.injective.dev/api',
    chainUrl: 'https://testnet-api-eu.injective.dev:44300',
    exchangeUrl: 'https://testnet-api-eu.injective.dev:44310',
  },
}

export const urlEndpointsStaking: UrlEndpointUrls = {
  america: {
    baseUrl: 'https://staking-api.injective.network/api',
    chainUrl: 'https://staking-evm.injective.network',
    exchangeUrl: 'https://staking-api.injective.network',
  },

  europe: {
    baseUrl: 'https://staking-api.injective.network/api',
    chainUrl: 'https://staking-evm.injective.network',
    exchangeUrl: 'https://staking-api.injective.network',
  },

  asia: {
    baseUrl: 'https://staking-api.injective.network/api',
    chainUrl: 'https://staking-evm.injective.network',
    exchangeUrl: 'https://staking-api.injective.network',
  },
}

export const urlEndpointsLocal: UrlEndpointUrls = {
  america: {
    baseUrl: 'http://localhost:4444/api',
    chainUrl: 'http://localhost:1317',
    exchangeUrl: 'http://localhost:4444',
  },

  europe: {
    baseUrl: 'http://localhost:4444/api',
    chainUrl: 'http://localhost:1317',
    exchangeUrl: 'http://localhost:4444',
  },

  asia: {
    baseUrl: 'http://localhost:4444/api',
    chainUrl: 'http://localhost:1317',
    exchangeUrl: 'http://localhost:4444',
  },
}

export const urlEndpointsDevnet: UrlEndpointUrls = {
  america: {
    baseUrl: 'https://devnet-api.injective.dev/api',
    chainUrl: 'https://devnet-evm.injective.dev',
    exchangeUrl: 'https://devnet-api.injective.dev',
  },

  europe: {
    baseUrl: 'https://devnet-api.injective.dev/api',
    chainUrl: 'https://devnet-evm.injective.dev',
    exchangeUrl: 'https://devnet-api.injective.dev',
  },

  asia: {
    baseUrl: 'https://devnet-api.injective.dev/api',
    chainUrl: 'https://devnet-evm.injective.dev',
    exchangeUrl: 'https://devnet-api.injective.dev',
  },
}
