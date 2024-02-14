import { Network, isTestnet } from '@injectivelabs/networks'

export function getBonfidaContractAddress(network: Network): string {
  if (isTestnet(network)) {
    return 'inj1q79ujqyh72p43mhr2ldaly3x6d50rzp3354at3'
  }

  return 'inj1v7chmgm7vmuwldjt80utmw9c95jkrch979ps8z'
}
