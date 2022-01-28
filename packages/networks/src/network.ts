import {
  urlEndpointsMainnet,
  urlEndpointsLocal,
  urlEndpointsTestnet,
  urlEndpointsPublic,
  urlEndpointsDevnet,
  urlEndpointsMainnetK8s,
  urlEndpointsMainnetStaging,
} from './endpoints'
import { Network, UrlEndpoint } from './types'

export const urlEndpointUrls: Record<Network, UrlEndpoint> = {
  [Network.MainnetK8s]: urlEndpointsMainnetK8s,
  [Network.MainnetOld]: urlEndpointsMainnet,
  [Network.MainnetStaging]: urlEndpointsMainnetStaging,
  [Network.Mainnet]: urlEndpointsMainnet,
  [Network.Public]: urlEndpointsPublic,
  [Network.Devnet]: urlEndpointsDevnet,
  [Network.Testnet]: urlEndpointsTestnet,
  [Network.Local]: urlEndpointsLocal,
}

export const getUrlEndpointForNetwork = (network: Network): UrlEndpoint =>
  urlEndpointUrls[network]
