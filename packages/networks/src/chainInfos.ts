import { ChainId, EvmChainId } from '@injectivelabs/ts-types'
import { ChainInfo } from './types.js'

const INJ_DENOM = 'inj'

export const mainnetChainInfo: ChainInfo = {
  feeDenom: INJ_DENOM,
  chainId: ChainId.Mainnet,
  evmChainId: EvmChainId.Mainnet,
  env: 'mainnet',
}

export const testnetChainInfo: ChainInfo = {
  feeDenom: INJ_DENOM,
  chainId: ChainId.Testnet,
  evmChainId: EvmChainId.Sepolia,
  env: 'testnet',
}

export const devnetChainInfo: ChainInfo = {
  feeDenom: INJ_DENOM,
  chainId: ChainId.Devnet,
  evmChainId: EvmChainId.Sepolia,
  env: 'devnet',
}

export const localChainInfo: ChainInfo = {
  feeDenom: INJ_DENOM,
  chainId: ChainId.Mainnet,
  evmChainId: EvmChainId.Mainnet,
  env: 'local',
}
