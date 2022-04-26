import {
  devnetChainInfo,
  localChainInfo,
  mainnetChainInfo,
  testnetChainInfo,
} from './chainInfos'
import {
  urlEndpointsMainnet,
  urlEndpointsLocal,
  urlEndpointsTestnet,
  urlEndpointsTestnetK8s,
  urlEndpointsPublic,
  urlEndpointsDevnet,
  urlEndpointsMainnetK8s,
  urlEndpointsMainnetStaging,
  urlEndpointsDevnet1,
} from './endpoints'
import { ChainInfo, Network, NetworkEndpoints } from './types'

export const networkEndpoints: Record<Network, NetworkEndpoints> = {
  [Network.MainnetK8s]: urlEndpointsMainnetK8s,
  [Network.MainnetOld]: urlEndpointsMainnet,
  [Network.MainnetStaging]: urlEndpointsMainnetStaging,
  [Network.Staging]: urlEndpointsMainnetStaging,
  [Network.Mainnet]: urlEndpointsMainnet,
  [Network.Public]: urlEndpointsPublic,
  [Network.Devnet]: urlEndpointsDevnet,
  [Network.Devnet1]: urlEndpointsDevnet1,
  [Network.Testnet]: urlEndpointsTestnet,
  [Network.TestnetK8s]: urlEndpointsTestnetK8s,
  [Network.Local]: urlEndpointsLocal,
}

export const chainInfos: Record<Network, ChainInfo> = {
  [Network.MainnetK8s]: mainnetChainInfo,
  [Network.MainnetOld]: mainnetChainInfo,
  [Network.MainnetStaging]: mainnetChainInfo,
  [Network.Staging]: mainnetChainInfo,
  [Network.Mainnet]: mainnetChainInfo,
  [Network.Public]: mainnetChainInfo,
  [Network.Devnet]: devnetChainInfo,
  [Network.Devnet1]: devnetChainInfo,
  [Network.Testnet]: testnetChainInfo,
  [Network.TestnetK8s]: testnetChainInfo,
  [Network.Local]: localChainInfo,
}

export const getUrlEndpointForNetwork = (network: Network): NetworkEndpoints =>
  networkEndpoints[network]

export const getEndpointsForNetwork = (network: Network): NetworkEndpoints =>
  networkEndpoints[network]

export const getChainInfoForNetwork = (network: Network): ChainInfo =>
  chainInfos[network]

export const getNetworkInfo = (
  network: Network,
): ChainInfo & NetworkEndpoints => ({
  ...chainInfos[network],
  ...networkEndpoints[network],
})
