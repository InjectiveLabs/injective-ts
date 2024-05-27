import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'
import { INJ_DENOM } from '@injectivelabs/utils'
import { ChainInfo } from './types'

export const mainnetChainInfo: ChainInfo = {
  feeDenom: INJ_DENOM,
  chainId: ChainId.Mainnet,
  ethereumChainId: EthereumChainId.Mainnet,
  env: 'mainnet',
}

export const testnetChainInfo: ChainInfo = {
  feeDenom: INJ_DENOM,
  chainId: ChainId.Testnet,
  ethereumChainId: EthereumChainId.Sepolia,
  env: 'testnet',
}

export const devnetChainInfo: ChainInfo = {
  feeDenom: INJ_DENOM,
  chainId: ChainId.Devnet,
  ethereumChainId: EthereumChainId.Sepolia,
  env: 'devnet',
}

export const localChainInfo: ChainInfo = {
  feeDenom: INJ_DENOM,
  chainId: ChainId.Mainnet,
  ethereumChainId: EthereumChainId.Mainnet,
  env: 'local',
}
