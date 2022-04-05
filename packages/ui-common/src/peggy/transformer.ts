import { Network } from '@injectivelabs/networks'
import { ChainId } from '@injectivelabs/ts-types'
import { INJ_DENOM } from '../constants'
import { getInjectiveContractAddress } from './utils'

export const peggyDenomToContractAddress = (
  denom: string,
  chainId: ChainId,
  network: Network,
): string => {
  const denomLowerCased = denom.toLowerCase()
  const contractAddress = denomLowerCased.replace('peggy', '')

  const injectiveContractAddress = getInjectiveContractAddress(chainId, network)

  return denomLowerCased === INJ_DENOM
    ? injectiveContractAddress
    : contractAddress
}

export class PeggyTransformer {
  static peggyDenomToContractAddress = peggyDenomToContractAddress
}
