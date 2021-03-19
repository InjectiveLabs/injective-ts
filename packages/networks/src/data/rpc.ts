import { RpcUrls, UrlEndpointUrls } from '../types'

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

export const rpcUrlsInternal: RpcUrls = {
  america: 'https://internal-evm.injective.dev',
  europe: 'https://internal-evm.injective.dev',
  asia: 'https://internal-evm.injective.dev',
}

export const rpcUrlsLocal: RpcUrls = {
  america: 'http://localhost:1317',
  europe: 'http://localhost:1317',
  asia: 'http://localhost:1317',
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

export const wsRpcUrlsInternal: RpcUrls = {
  america: 'wss://internal-evm.injective.dev',
  europe: 'wss://internal-evm.injective.dev',
  asia: 'wss://internal-evm.injective.dev',
}

export const wsRpcUrlsLocal: RpcUrls = {
  america: 'ws://localhost:1318',
  europe: 'ws://localhost:1318',
  asia: 'ws://localhost:1318',
}

export const urlEndpointsMainnet: UrlEndpointUrls = {
  america: {
    baseUrl: 'https://testnet-api-eu.injective.dev/api',
    chainUrl: 'https://testnet-api-eu.injective.dev:44300',
    exchangeUrl: 'https://testnet-api-eu.injective.dev:44310',
    explorerUrl: 'https://testnet-explorer-api.injective.dev/v1',
  },

  europe: {
    baseUrl: 'https://testnet-api-eu.injective.dev/api',
    chainUrl: 'https://internal-evm.injective.dev',
    exchangeUrl: 'https://testnet-api-eu.injective.dev:44310',
    explorerUrl: 'https://testnet-explorer-api.injective.dev/v1',
  },

  asia: {
    baseUrl: 'https://testnet-api-eu.injective.dev/api',
    chainUrl: 'https://testnet-api-eu.injective.dev:44300',
    exchangeUrl: 'https://testnet-api-eu.injective.dev:44310',
    explorerUrl: 'https://testnet-explorer-api.injective.dev/v1',
  },
}

export const urlEndpointsStaking: UrlEndpointUrls = {
  america: {
    baseUrl: 'https://staking-api.injective.network/api',
    chainUrl: 'https://staking-evm.injective.network',
    exchangeUrl: 'https://staking-api.injective.network',
    explorerUrl: 'https://staking-explorer-api.injective.network/v1',
  },

  europe: {
    baseUrl: 'https://staking-api.injective.network/api',
    chainUrl: 'https://staking-evm.injective.network',
    exchangeUrl: 'https://staking-api.injective.network',
    explorerUrl: 'https://staking-explorer-api.injective.network/v1',
  },

  asia: {
    baseUrl: 'https://staking-api.injective.network/api',
    chainUrl: 'https://staking-evm.injective.network',
    exchangeUrl: 'https://staking-api.injective.network',
    explorerUrl: 'https://staking-explorer-api.injective.network/v1',
  },
}

export const urlEndpointsInternal: UrlEndpointUrls = {
  america: {
    baseUrl: 'https://internal-api.injective.network/api',
    chainUrl: 'https://internal-evm.injective.network',
    exchangeUrl: 'https://internal-api.injective.network',
    explorerUrl: 'https://internal-explorer-api.injective.dev',
  },

  europe: {
    baseUrl: 'https://internal-api.injective.network/api',
    chainUrl: 'https://internal-evm.injective.network',
    exchangeUrl: 'https://internal-api.injective.network',
    explorerUrl: 'https://internal-explorer-api.injective.dev',
  },

  asia: {
    baseUrl: 'https://internal-api.injective.network/api',
    chainUrl: 'https://internal-evm.injective.network',
    exchangeUrl: 'https://internal-api.injective.network',
    explorerUrl: 'https://internal-explorer-api.injective.dev',
  },
}

export const urlEndpointsLocal: UrlEndpointUrls = {
  america: {
    baseUrl: 'http://localhost:4444/api',
    chainUrl: 'http://localhost:1317',
    exchangeUrl: 'http://localhost:4444',
    explorerUrl: 'https://testnet-explorer-api.injective.dev/v1',
  },

  europe: {
    baseUrl: 'http://localhost:4444/api',
    chainUrl: 'http://localhost:1317',
    exchangeUrl: 'http://localhost:4444',
    explorerUrl: 'https://testnet-explorer-api.injective.dev/v1',
  },

  asia: {
    baseUrl: 'http://localhost:4444/api',
    chainUrl: 'http://localhost:1317',
    exchangeUrl: 'http://localhost:4444',
    explorerUrl: 'https://testnet-explorer-api.injective.dev/v1',
  },
}
