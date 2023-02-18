import { SupportedChains } from '../types/explorer'
import { getCosmosExplorerUrl, getSolanaExplorerUrl } from './bridge'
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
    const solanaExplorerPath = getSolanaExplorerUrl(network)

    return `${solanaExplorerPath}/address/${address}`
  }

  if (Object.values(BridgingNetwork).includes(chain as BridgingNetwork)) {
    const mintscanPath = getCosmosExplorerUrl(chain as BridgingNetwork, network)

    return `${mintscanPath}/account/${address}`
  }

  if (chain === SupportedChains.Ethereum) {
    const ethereumExplorerPath = getEthereumExplorerUrl(network)

    return `${ethereumExplorerPath}/address/${address}`
  }

  return undefined
}
