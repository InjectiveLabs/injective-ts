import {
  devnetChainInfo,
  localChainInfo,
  mainnetChainInfo,
  testnetChainInfo,
} from './chainInfos.js'
import {
  endpointsLocal,
  endpointsDevnet,
  endpointsTestnet,
  endpointsMainnet,
  endpointsStaging,
  endpointsDevnet1,
  endpointsDevnet2,
  endpointsInternal,
  endpointsMainnetLB,
  endpointsTestnetK8s,
  endpointsTestnetOld,
  endpointsMainnetK8s,
  endpointsMainnetOld,
  endpointsMainnetSentry,
  endpointsTestnetSentry,
} from './endpoints.js'
import { Network, ChainInfo, NetworkEndpoints } from './types.js'

export const networkEndpoints: Record<Network, NetworkEndpoints> = {
  [Network.MainnetLB]: endpointsMainnetLB,
  [Network.MainnetK8s]: endpointsMainnetK8s,
  [Network.MainnetSentry]: endpointsMainnetSentry,
  [Network.MainnetOld]: endpointsMainnetOld,
  [Network.Staging]: endpointsStaging,
  [Network.Mainnet]: endpointsMainnet,
  [Network.Internal]: endpointsInternal,
  [Network.Devnet]: endpointsDevnet,
  [Network.Devnet1]: endpointsDevnet1,
  [Network.Devnet2]: endpointsDevnet2,
  [Network.Testnet]: endpointsTestnet,
  [Network.TestnetK8s]: endpointsTestnetK8s,
  [Network.TestnetOld]: endpointsTestnetOld,
  [Network.TestnetSentry]: endpointsTestnetSentry,
  [Network.Local]: endpointsLocal,
}

export const chainInfos: Record<Network, ChainInfo> = {
  [Network.MainnetLB]: mainnetChainInfo,
  [Network.MainnetK8s]: mainnetChainInfo,
  [Network.MainnetSentry]: mainnetChainInfo,
  [Network.MainnetOld]: mainnetChainInfo,
  [Network.Staging]: mainnetChainInfo,
  [Network.Mainnet]: mainnetChainInfo,
  [Network.Internal]: mainnetChainInfo,
  [Network.Devnet]: devnetChainInfo,
  [Network.Devnet1]: devnetChainInfo,
  [Network.Devnet2]: devnetChainInfo,
  [Network.Testnet]: testnetChainInfo,
  [Network.TestnetOld]: testnetChainInfo,
  [Network.TestnetK8s]: testnetChainInfo,
  [Network.TestnetSentry]: testnetChainInfo,
  [Network.Local]: localChainInfo,
}

export const getNetworkEndpoints = (network: Network): NetworkEndpoints =>
  networkEndpoints[network]

/**
 * @deprecated - use getNetworkChainInfo instead
 * @param network de
 * @returns
 */
export const getChainInfoForNetwork = (network: Network): ChainInfo =>
  chainInfos[network]

export const getNetworkChainInfo = (network: Network): ChainInfo =>
  chainInfos[network]

export const getNetworkInfo = (
  network: Network,
): ChainInfo & NetworkEndpoints => ({
  ...chainInfos[network],
  ...networkEndpoints[network],
})

export const isMainnet = (network: Network) =>
  [
    Network.Staging,
    Network.Mainnet,
    Network.MainnetOld,
    Network.MainnetK8s,
    Network.MainnetSentry,
    Network.Internal,
    Network.MainnetLB,
  ].includes(network)

export const isDevnet = (network: Network) =>
  [Network.Devnet, Network.Devnet1, Network.Devnet2, Network.Local].includes(
    network,
  )

export const isTestnet = (network: Network) =>
  [
    Network.Testnet,
    Network.TestnetOld,
    Network.TestnetK8s,
    Network.TestnetSentry,
  ].includes(network)

export const isTestnetOrDevnet = (network: Network) =>
  isDevnet(network) || isTestnet(network)
