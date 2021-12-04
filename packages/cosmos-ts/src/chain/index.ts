import chains from './chains'

export const supportedChainIds = [
  'cosmoshub-4',
  'columbus-5',
  'injective-1',
  'injective-777',
  'injective-888',
  'cosmoshub-testnet',
]

export const getChainDataBasedOnChainId = (chainId: string): any | undefined =>
  chains[chainId]
