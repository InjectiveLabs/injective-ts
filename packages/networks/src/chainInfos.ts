import { ChainId, EvmChainId } from '@injectivelabs/ts-types'
import type { ChainInfo } from './types.js'

export const INJ_DENOM = 'inj'
export const WINJ_ADDRESS = '0x0000000088827d2d103ee2d9A6b781773AE03FfB'

export const getMainnetChainInfo = (): ChainInfo => ({
  feeDenom: INJ_DENOM,
  chainId: ChainId.Mainnet,
  evmChainId: EvmChainId.Mainnet,
  wInjAddress: WINJ_ADDRESS,
  env: 'mainnet',
  evmNetworkParams: {
    chainName: 'Injective EVM',
    chainId: `0x${EvmChainId.Mainnet.toString(16)}`,
    nativeCurrency: {
      name: 'Injective',
      symbol: 'INJ',
      decimals: 18,
    },
  },
})

export const getTestnetChainInfo = (): ChainInfo => ({
  feeDenom: INJ_DENOM,
  chainId: ChainId.Testnet,
  evmChainId: EvmChainId.Sepolia,
  wInjAddress: WINJ_ADDRESS,
  env: 'testnet',
  evmNetworkParams: {
    chainName: 'Sepolia',
    chainId: `0x${EvmChainId.Sepolia.toString(16)}`,
    nativeCurrency: {
      name: 'Injective',
      symbol: 'INJ',
      decimals: 18,
    },
  },
})

export const getDevnetChainInfo = (): ChainInfo => ({
  feeDenom: INJ_DENOM,
  chainId: ChainId.Devnet,
  evmChainId: EvmChainId.Sepolia,
  wInjAddress: WINJ_ADDRESS,
  env: 'devnet',
  evmNetworkParams: {
    chainName: 'Sepolia',
    chainId: `0x${EvmChainId.Sepolia.toString(16)}`,
    nativeCurrency: {
      name: 'Injective',
      symbol: 'INJ',
      decimals: 18,
    },
  },
})

export const getLocalChainInfo = (): ChainInfo => ({
  feeDenom: INJ_DENOM,
  chainId: ChainId.Mainnet,
  evmChainId: EvmChainId.Mainnet,
  wInjAddress: WINJ_ADDRESS,
  env: 'local',
  evmNetworkParams: {
    chainName: 'Localhost',
    chainId: `0x${EvmChainId.Mainnet.toString(16)}`,
    nativeCurrency: {
      name: 'Injective',
      symbol: 'INJ',
      decimals: 18,
    },
  },
})
