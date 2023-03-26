import { Network } from '@injectivelabs/networks'
import { CHAINS, CONTRACTS } from '@injectivelabs/wormhole-sdk'

export const WORMHOLE_CONTRACT_BY_NETWORK = {
  [Network.Mainnet]: CONTRACTS.MAINNET.injective,
  [Network.MainnetK8s]: CONTRACTS.MAINNET.injective,
  [Network.MainnetLB]: CONTRACTS.MAINNET.injective,
  [Network.Public]: CONTRACTS.MAINNET.injective,
  [Network.Staging]: CONTRACTS.MAINNET.injective,
  [Network.Testnet]: CONTRACTS.TESTNET.injective,
  [Network.TestnetK8s]: CONTRACTS.TESTNET.injective,
  [Network.TestnetOld]: CONTRACTS.TESTNET.injective,
  [Network.Devnet]: CONTRACTS.TESTNET.injective,
  [Network.Devnet1]: CONTRACTS.TESTNET.injective,
  [Network.Devnet2]: CONTRACTS.TESTNET.injective,
  [Network.Local]: CONTRACTS.TESTNET.injective,
}

export const WORMHOLE_SOLANA_CONTRACT_BY_NETWORK = {
  [Network.Mainnet]: CONTRACTS.MAINNET.solana,
  [Network.MainnetK8s]: CONTRACTS.MAINNET.solana,
  [Network.MainnetLB]: CONTRACTS.MAINNET.solana,
  [Network.Public]: CONTRACTS.MAINNET.solana,
  [Network.Staging]: CONTRACTS.MAINNET.solana,
  [Network.Testnet]: CONTRACTS.TESTNET.solana,
  [Network.TestnetK8s]: CONTRACTS.TESTNET.solana,
  [Network.TestnetOld]: CONTRACTS.TESTNET.solana,
  [Network.Devnet]: CONTRACTS.TESTNET.solana,
  [Network.Devnet1]: CONTRACTS.TESTNET.solana,
  [Network.Devnet2]: CONTRACTS.TESTNET.solana,
  [Network.Local]: CONTRACTS.TESTNET.solana,
}

export const WORMHOLE_ETHEREUM_CONTRACT_BY_NETWORK = {
  [Network.Mainnet]: CONTRACTS.MAINNET.ethereum,
  [Network.MainnetK8s]: CONTRACTS.MAINNET.ethereum,
  [Network.MainnetLB]: CONTRACTS.MAINNET.ethereum,
  [Network.Public]: CONTRACTS.MAINNET.ethereum,
  [Network.Staging]: CONTRACTS.MAINNET.ethereum,
  [Network.Testnet]: CONTRACTS.TESTNET.ethereum,
  [Network.TestnetK8s]: CONTRACTS.TESTNET.ethereum,
  [Network.TestnetOld]: CONTRACTS.TESTNET.ethereum,
  [Network.Devnet]: CONTRACTS.TESTNET.ethereum,
  [Network.Devnet1]: CONTRACTS.TESTNET.ethereum,
  [Network.Devnet2]: CONTRACTS.TESTNET.solana,
  [Network.Local]: CONTRACTS.TESTNET.ethereum,
}

export const WORMHOLE_ARBITRUM_CONTRACT_BY_NETWORK = {
  [Network.Mainnet]: CONTRACTS.MAINNET.arbitrum,
  [Network.MainnetK8s]: CONTRACTS.MAINNET.arbitrum,
  [Network.MainnetLB]: CONTRACTS.MAINNET.arbitrum,
  [Network.Public]: CONTRACTS.MAINNET.arbitrum,
  [Network.Staging]: CONTRACTS.MAINNET.arbitrum,
  [Network.Testnet]: CONTRACTS.TESTNET.arbitrum,
  [Network.TestnetK8s]: CONTRACTS.TESTNET.arbitrum,
  [Network.TestnetOld]: CONTRACTS.TESTNET.arbitrum,
  [Network.Devnet]: CONTRACTS.TESTNET.arbitrum,
  [Network.Devnet1]: CONTRACTS.TESTNET.arbitrum,
  [Network.Devnet2]: CONTRACTS.TESTNET.solana,
  [Network.Local]: CONTRACTS.TESTNET.arbitrum,
}

export const WORMHOLE_CHAINS = CHAINS

export const WORMHOLE_CONTRACTS = CONTRACTS
