import { SupportedChains } from '../types/explorer'
import {
  getCosmosExplorerUrl,
  getPolygonExplorerUrl,
  getSolanaExplorerUrl,
} from './bridge'
import { BridgingNetwork } from '../types/bridge'
import { getEthereumExplorerUrl, getNetworkFromAddress } from './bridge'
import { Network } from '@injectivelabs/networks'

export const getSupportedNetworkFromAddress = (
  address: string,
): SupportedChains | BridgingNetwork => {
  if (address.includes('inj')) {
    return SupportedChains.Injective
  }

  if (address.startsWith('0x')) {
    return SupportedChains.Ethereum
  }

  return getNetworkFromAddress(address)
}

export const getBlockExplorerPathFromNetworkType = ({
  network,
  chain,
  address,
}: {
  network: Network
  chain: SupportedChains | BridgingNetwork
  address: string
}) => {
  if (chain === SupportedChains.Injective) {
    return undefined
  }

  if (chain === SupportedChains.Solana) {
    return `${getSolanaExplorerUrl(network)}/address/${address}`
  }

  if (chain === SupportedChains.Ethereum) {
    return `${getEthereumExplorerUrl(network)}/address/${address}`
  }

  if (chain === BridgingNetwork.EthereumWh) {
    return `${getEthereumExplorerUrl(network)}/address/${address}`
  }

  if (chain === BridgingNetwork.Polygon) {
    return `${getPolygonExplorerUrl(network)}/address/${address}`
  }

  if (Object.values(BridgingNetwork).includes(chain as BridgingNetwork)) {
    return `${getCosmosExplorerUrl(
      chain as BridgingNetwork,
      network,
    )}/account/${address}`
  }

  return undefined
}
