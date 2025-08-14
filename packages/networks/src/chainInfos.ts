import { ChainId, EvmChainId } from '@injectivelabs/ts-types'
import { ChainInfo } from './types.js'

const INJ_DENOM = 'inj'

export const getMainnetChainInfo = (): ChainInfo => ({
  feeDenom: INJ_DENOM,
  chainId: ChainId.Mainnet,
  evmChainId: EvmChainId.Mainnet,
  env: 'mainnet',
})

export const getTestnetChainInfo = (): ChainInfo => ({
  feeDenom: INJ_DENOM,
  chainId: ChainId.Testnet,
  evmChainId: EvmChainId.Sepolia,
  env: 'testnet',
})

export const getDevnetChainInfo = (): ChainInfo => ({
  feeDenom: INJ_DENOM,
  chainId: ChainId.Devnet,
  evmChainId: EvmChainId.Sepolia,
  env: 'devnet',
})

export const getLocalChainInfo = (): ChainInfo => ({
  feeDenom: INJ_DENOM,
  chainId: ChainId.Mainnet,
  evmChainId: EvmChainId.Mainnet,
  env: 'local',
})
