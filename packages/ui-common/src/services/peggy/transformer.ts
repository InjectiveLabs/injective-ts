import { INJ_DENOM } from '../../constants'

export const peggyDenomToContractAddress = (
  denom: string,
  injectiveContractAddress: string,
): string => {
  const denomLowerCased = denom.toLowerCase()
  const contractAddress = denomLowerCased.replace('peggy', '')

  return denomLowerCased === INJ_DENOM
    ? injectiveContractAddress
    : contractAddress
}

export class PeggyTransformer {
  static peggyDenomToContractAddress = peggyDenomToContractAddress
}
