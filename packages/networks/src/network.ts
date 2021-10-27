import {
  urlEndpointsMainnet,
  urlEndpointsLocal,
  urlEndpointsTestnet,
  urlEndpointsPublic,
  urlEndpointsDevnet,
  urlEndpointsMainnetOld,
} from './endpoints'
import { Network, UrlEndpoint } from './types'

export const urlEndpointUrls: { [key: string]: UrlEndpoint } = {
  mainnet: urlEndpointsMainnet,
  mainnetOld: urlEndpointsMainnetOld,
  public: urlEndpointsPublic,
  devnet: urlEndpointsDevnet,
  testnet: urlEndpointsTestnet,
  local: urlEndpointsLocal,
}

export const getUrlEndpointForNetwork = (network: Network): UrlEndpoint =>
  urlEndpointUrls[network]
