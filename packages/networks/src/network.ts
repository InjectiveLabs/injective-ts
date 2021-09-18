import {
  urlEndpointsMainnet,
  urlEndpointsLocal,
  urlEndpointsStaking,
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
  testnet: urlEndpointsStaking,
  local: urlEndpointsLocal,
}

export const getUrlEndpointForNetwork = (network: Network): UrlEndpoint =>
  urlEndpointUrls[network]
