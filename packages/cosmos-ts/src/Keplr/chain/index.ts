import chains from './chains'

export const keplrSupportedChainIds = [
  'cosmoshub-4',
  'osmosis-1',
  'secret-3',
  'akashnet-2',
  'crypto-org-chain-mainnet-1',
  'iov-mainnet-ibc',
  'sifchain-1',
  'shentu-2.2',
  'irishub-1',
  'regen-1',
  'core-1',
  'sentinelhub-2',
  'kava-8',
  'impacthub-3',
  'emoney-3',
  'euler-6',
  'juno-1',
  'straightedge-2',
  'axelar-dojo-1',
]

export const getChainDataBasedOnChainId = (chainId: string): any | undefined =>
  chains[chainId]
