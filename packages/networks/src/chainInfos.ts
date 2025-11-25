import { ChainId, EvmChainId } from '@injectivelabs/ts-types'
import type { ChainInfo } from './types.js'

export const INJ_DENOM = 'inj'
export const WINJ_ADDRESS = '0x0000000088827d2d103ee2d9A6b781773AE03FfB'

export const getMainnetChainInfo = (): ChainInfo => ({
  feeDenom: INJ_DENOM,
  chainId: ChainId.Mainnet,
  evmChainId: EvmChainId.Mainnet,
  env: 'mainnet',
  injectiveEvmNetworkParams: {
    wInjAddress: WINJ_ADDRESS,
    chainName: 'Injective EVM',
    chainId: `0x${EvmChainId.MainnetEvm.toString(16)}`,
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
  env: 'testnet',
  injectiveEvmNetworkParams: {
    wInjAddress: WINJ_ADDRESS,
    chainName: 'Injective EVM Testnet',
    chainId: `0x${EvmChainId.MainnetEvm.toString(16)}`,
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
  env: 'devnet',
  injectiveEvmNetworkParams: {
    wInjAddress: WINJ_ADDRESS,
    chainName: 'Injective EVM Devnet',
    chainId: `0x${EvmChainId.DevnetEvm.toString(16)}`,
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
  evmChainId: EvmChainId.Sepolia,
  env: 'local',
  injectiveEvmNetworkParams: {
    wInjAddress: WINJ_ADDRESS,
    chainName: 'Localhost',
    chainId: `0x${EvmChainId.MainnetEvm.toString(16)}`,
    nativeCurrency: {
      name: 'Injective',
      symbol: 'INJ',
      decimals: 18,
    },
  },
})
