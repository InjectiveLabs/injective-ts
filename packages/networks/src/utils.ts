import {
  ASSET_PRICE_URL_BY_NETWORK,
  PEGGY_GRAPH_URL_BY_NETWORK,
  CW20_SWAP_CONTRACT_BY_NETWORK,
  INCENTIVES_CONTRACT_BY_NETWORK,
  CW20_ADAPTER_CONTRACT_BY_NETWORK,
  INJ_NAME_REGISTRY_CONTRACT_BY_NETWORK,
  INJ_NAME_REVERSE_RESOLVER_CONTRACT_BY_NETWORK,
} from './constants.js'
import { isTestnet } from './network.js'
import { Network } from './types.js'

export const CW20_CODE_IDS_BY_NETWORK = (
  network: Network = Network.Mainnet,
) => {
  if (isTestnet(network)) {
    return ['25']
  }

  return ['28', '5', '42']
}

export const getCw20AdapterContractForNetwork = (
  network: Network = Network.Mainnet,
) => {
  return CW20_ADAPTER_CONTRACT_BY_NETWORK[network] !== undefined
    ? CW20_ADAPTER_CONTRACT_BY_NETWORK[network]
    : CW20_ADAPTER_CONTRACT_BY_NETWORK[Network.Mainnet]
}

export const getCw20SwapContractForNetwork = (
  network: Network = Network.Mainnet,
) => {
  return CW20_SWAP_CONTRACT_BY_NETWORK[network] !== undefined
    ? CW20_SWAP_CONTRACT_BY_NETWORK[network]
    : CW20_SWAP_CONTRACT_BY_NETWORK[Network.Mainnet]
}

export const getIncentivesContractForNetwork = (
  network: Network = Network.Mainnet,
) => {
  return INCENTIVES_CONTRACT_BY_NETWORK[network] !== undefined
    ? INCENTIVES_CONTRACT_BY_NETWORK[network]
    : INCENTIVES_CONTRACT_BY_NETWORK[Network.Mainnet]
}

export const getInjNameRegistryContractForNetwork = (
  network: Network = Network.Mainnet,
) => {
  return INJ_NAME_REGISTRY_CONTRACT_BY_NETWORK[network] !== undefined
    ? INJ_NAME_REGISTRY_CONTRACT_BY_NETWORK[network]
    : INJ_NAME_REGISTRY_CONTRACT_BY_NETWORK[Network.Mainnet]
}

export const getInjNameReverseResolverContractForNetwork = (
  network: Network = Network.Mainnet,
) => {
  return INJ_NAME_REVERSE_RESOLVER_CONTRACT_BY_NETWORK[network] !== undefined
    ? INJ_NAME_REVERSE_RESOLVER_CONTRACT_BY_NETWORK[network]
    : INJ_NAME_REVERSE_RESOLVER_CONTRACT_BY_NETWORK[Network.Mainnet]
}

export const getPeggyGraphQlEndpointForNetwork = (network: Network): string => {
  return PEGGY_GRAPH_URL_BY_NETWORK[network] !== undefined
    ? PEGGY_GRAPH_URL_BY_NETWORK[network]
    : PEGGY_GRAPH_URL_BY_NETWORK[Network.Mainnet]
}

export const getAssetPriceServiceForNetwork = (network: Network): string => {
  return ASSET_PRICE_URL_BY_NETWORK[network] !== undefined
    ? ASSET_PRICE_URL_BY_NETWORK[network]
    : ASSET_PRICE_URL_BY_NETWORK[Network.Mainnet]
}
