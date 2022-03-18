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
import { Network, UrlEndpoint } from './types'

export const urlEndpointUrls: Record<Network, UrlEndpoint> = {
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

export const getUrlEndpointForNetwork = (network: Network): UrlEndpoint =>
  urlEndpointUrls[network]
