import { Network } from './types.js'
import {
  getLocalChainInfo,
  getDevnetChainInfo,
  getMainnetChainInfo,
  getTestnetChainInfo,
} from './chainInfos.js'
import {
  getEndpointsLocal,
  getEndpointsDevnet,
  getEndpointsStaging,
  getEndpointsDevnet1,
  getEndpointsDevnet2,
  getEndpointsDevnet3,
  getEndpointsInternal,
  getEndpointsMainnetLB,
  getEndpointsTestnetOld,
  getEndpointsTestnetK8s,
  getEndpointsMainnetOld,
  getEndpointsMainnetK8s,
  getEndpointsTestnetSentry,
  getEndpointsMainnetSentry,
} from './endpoints.js'
import type {
  ChainInfo,
  NetworkEndpoints,
  Network as NetworkType,
} from './types.js'

export const getNetworkEndpoints = (network: Network): NetworkEndpoints => {
  switch (network) {
    case Network.MainnetLB:
      return getEndpointsMainnetLB()
    case Network.MainnetK8s:
      return getEndpointsMainnetK8s()
    case Network.MainnetSentry:
    case Network.Mainnet:
      return getEndpointsMainnetSentry()
    case Network.MainnetOld:
      return getEndpointsMainnetOld()
    case Network.Staging:
      return getEndpointsStaging()
    case Network.Internal:
      return getEndpointsInternal()
    case Network.Devnet:
      return getEndpointsDevnet()
    case Network.Devnet1:
      return getEndpointsDevnet1()
    case Network.Devnet2:
      return getEndpointsDevnet2()
    case Network.Devnet3:
      return getEndpointsDevnet3()
    case Network.TestnetK8s:
      return getEndpointsTestnetK8s()
    case Network.TestnetOld:
      return getEndpointsTestnetOld()
    case Network.TestnetSentry:
    case Network.Testnet:
      return getEndpointsTestnetSentry()
    case Network.Local:
      return getEndpointsLocal()
    default:
      throw new Error(`Unknown network: ${network}`)
  }
}

/**
 * @deprecated - use getNetworkChainInfo instead
 * @param network deprecated
 * @returns
 */
export const getChainInfoForNetwork = (network: NetworkType): ChainInfo =>
  getNetworkChainInfo(network)

export const getNetworkChainInfo = (network: Network): ChainInfo => {
  if (network === Network.Local) {
    return getLocalChainInfo()
  }

  if (isTestnet(network)) {
    return getTestnetChainInfo()
  }

  if (isDevnet(network)) {
    return getDevnetChainInfo()
  }

  return getMainnetChainInfo()
}

export const getNetworkInfo = (
  network: Network,
): ChainInfo & NetworkEndpoints => ({
  ...getNetworkChainInfo(network),
  ...getNetworkEndpoints(network),
})

export const isMainnet = (network: NetworkType) =>
  (
    [
      Network.Staging,
      Network.Mainnet,
      Network.MainnetOld,
      Network.MainnetK8s,
      Network.MainnetSentry,
      Network.Internal,
      Network.MainnetLB,
    ] as NetworkType[]
  ).includes(network)

export const isDevnet = (network: Network) =>
  (
    [
      Network.Devnet,
      Network.Devnet1,
      Network.Devnet2,
      Network.Devnet3,
      Network.Local,
    ] as NetworkType[]
  ).includes(network)

export const isTestnet = (network: Network) =>
  (
    [
      Network.Testnet,
      Network.TestnetOld,
      Network.TestnetK8s,
      Network.TestnetSentry,
    ] as NetworkType[]
  ).includes(network)

export const isTestnetOrDevnet = (network: Network) =>
  isDevnet(network) || isTestnet(network)
