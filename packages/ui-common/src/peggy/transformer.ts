import { contractAddresses } from '@injectivelabs/contracts'
import { ChainId } from '@injectivelabs/ts-types'
import { INJ_DENOM } from '../constants'

export const peggyDenomToContractAddress = (
  denom: string,
  chainId: ChainId,
): string => {
  const denomLowerCased = denom.toLowerCase()
  const contractAddress = denomLowerCased.replace('peggy', '')
  const injectiveContractAddress = contractAddresses[chainId].injective

  return denomLowerCased === INJ_DENOM
    ? injectiveContractAddress
    : contractAddress
}

export const getInjectiveContractAddress = (chainId: ChainId) =>
  contractAddresses[chainId].injective

export class PeggyTransformer {
  static peggyDenomToContractAddress = peggyDenomToContractAddress

  static getInjectiveContractAddress = getInjectiveContractAddress
}
