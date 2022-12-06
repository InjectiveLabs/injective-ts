import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'
import { ChainInfo } from './types'

export const mainnetChainInfo: ChainInfo = {
  feeDenom: 'inj',
  chainId: ChainId.Mainnet,
  ethereumChainId: EthereumChainId.Mainnet,
  env: 'mainnet',
}

export const testnetChainInfo: ChainInfo = {
  feeDenom: 'inj',
  chainId: ChainId.Testnet,
  ethereumChainId: EthereumChainId.Goerli,
  env: 'testnet',
}

export const devnetChainInfo: ChainInfo = {
  feeDenom: 'inj',
  chainId: ChainId.Devnet,
  ethereumChainId: EthereumChainId.Goerli,
  env: 'devnet',
}

export const localChainInfo: ChainInfo = {
  feeDenom: 'inj',
  chainId: ChainId.Devnet,
  ethereumChainId: EthereumChainId.Goerli,
  env: 'local',
}
