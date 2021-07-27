import {
  urlEndpointsMainnet,
  urlEndpointsLocal,
  urlEndpointsStaking,
  urlEndpointsPublic,
  urlEndpointsDevnet,
} from './endpoints'
import { Network, UrlEndpoint } from './types'

export const urlEndpointUrls: { [key: string]: UrlEndpoint } = {
  mainnet: urlEndpointsMainnet,
  public: urlEndpointsPublic,
  devnet: urlEndpointsDevnet,
  staking: urlEndpointsStaking,
  local: urlEndpointsLocal,
}

export const getUrlEndpointForNetwork = (network: Network): UrlEndpoint =>
  urlEndpointUrls[network]
