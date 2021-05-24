import {
  urlEndpointsMainnet,
  urlEndpointsLocal,
  urlEndpointsStaking,
  urlEndpointsInternal,
  urlEndpointsDevnet,
} from './data/rpc'
import { Network, UrlEndpoint } from './types'

export const urlEndpointUrls: { [key: string]: UrlEndpoint } = {
  mainnet: urlEndpointsMainnet,
  internal: urlEndpointsInternal,
  devnet: urlEndpointsDevnet,
  staking: urlEndpointsStaking,
  local: urlEndpointsLocal,
}

export const getUrlEndpointForNetwork = (network: Network): UrlEndpoint =>
  urlEndpointUrls[network]
