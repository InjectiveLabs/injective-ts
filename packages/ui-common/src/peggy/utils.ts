import { contractAddresses } from '@injectivelabs/contracts'
import { Network } from '@injectivelabs/networks'
import { ChainId } from '@injectivelabs/ts-types'

export const getPeggyContractAddress = (
  chainId: ChainId,
  network: Network,
): string => {
  const contract = contractAddresses[network] || contractAddresses[chainId]

  return contract.peggy
}

export const getInjectiveContractAddress = (
  chainId: ChainId,
  network: Network,
): string => {
  const contract = contractAddresses[network] || contractAddresses[chainId]

  return contract.injective
}
