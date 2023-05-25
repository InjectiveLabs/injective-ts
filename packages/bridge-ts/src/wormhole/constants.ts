import { Network } from '@injectivelabs/networks'
import { CHAINS, CONTRACTS } from '@certusone/wormhole-sdk'

export const WORMHOLE_CONTRACT_BY_NETWORK = {
  [Network.Mainnet]: CONTRACTS.MAINNET.injective,
  [Network.MainnetK8s]: CONTRACTS.MAINNET.injective,
  [Network.MainnetLB]: CONTRACTS.MAINNET.injective,
  [Network.Public]: CONTRACTS.MAINNET.injective,
  [Network.Staging]: CONTRACTS.MAINNET.injective,
  [Network.Internal]: CONTRACTS.MAINNET.injective,
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
  [Network.Internal]: CONTRACTS.MAINNET.solana,
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
  [Network.Internal]: CONTRACTS.MAINNET.ethereum,
  [Network.Testnet]: CONTRACTS.TESTNET.ethereum,
  [Network.TestnetK8s]: CONTRACTS.TESTNET.ethereum,
  [Network.TestnetOld]: CONTRACTS.TESTNET.ethereum,
  [Network.Devnet]: CONTRACTS.TESTNET.ethereum,
  [Network.Devnet1]: CONTRACTS.TESTNET.ethereum,
  [Network.Devnet2]: CONTRACTS.TESTNET.ethereum,
  [Network.Local]: CONTRACTS.TESTNET.ethereum,
}

export const WORMHOLE_ARBITRUM_CONTRACT_BY_NETWORK = {
  [Network.Mainnet]: CONTRACTS.MAINNET.arbitrum,
  [Network.MainnetK8s]: CONTRACTS.MAINNET.arbitrum,
  [Network.MainnetLB]: CONTRACTS.MAINNET.arbitrum,
  [Network.Public]: CONTRACTS.MAINNET.arbitrum,
  [Network.Internal]: CONTRACTS.MAINNET.arbitrum,
  [Network.Staging]: CONTRACTS.MAINNET.arbitrum,
  [Network.Testnet]: CONTRACTS.TESTNET.arbitrum,
  [Network.TestnetK8s]: CONTRACTS.TESTNET.arbitrum,
  [Network.TestnetOld]: CONTRACTS.TESTNET.arbitrum,
  [Network.Devnet]: CONTRACTS.TESTNET.arbitrum,
  [Network.Devnet1]: CONTRACTS.TESTNET.arbitrum,
  [Network.Devnet2]: CONTRACTS.TESTNET.arbitrum,
  [Network.Local]: CONTRACTS.TESTNET.arbitrum,
}

export const WORMHOLE_POLYGON_CONTRACT_BY_NETWORK = {
  [Network.Mainnet]: CONTRACTS.MAINNET.polygon,
  [Network.MainnetK8s]: CONTRACTS.MAINNET.polygon,
  [Network.MainnetLB]: CONTRACTS.MAINNET.polygon,
  [Network.Public]: CONTRACTS.MAINNET.polygon,
  [Network.Internal]: CONTRACTS.MAINNET.polygon,
  [Network.Staging]: CONTRACTS.MAINNET.polygon,
  [Network.Testnet]: CONTRACTS.TESTNET.polygon,
  [Network.TestnetK8s]: CONTRACTS.TESTNET.polygon,
  [Network.TestnetOld]: CONTRACTS.TESTNET.polygon,
  [Network.Devnet]: CONTRACTS.TESTNET.polygon,
  [Network.Devnet1]: CONTRACTS.TESTNET.polygon,
  [Network.Devnet2]: CONTRACTS.TESTNET.polygon,
  [Network.Local]: CONTRACTS.TESTNET.polygon,
}

export const WORMHOLE_SUI_CONTRACT_BY_NETWORK = {
  [Network.Mainnet]: CONTRACTS.MAINNET.sui,
  [Network.MainnetK8s]: CONTRACTS.MAINNET.sui,
  [Network.MainnetLB]: CONTRACTS.MAINNET.sui,
  [Network.Public]: CONTRACTS.MAINNET.sui,
  [Network.Internal]: CONTRACTS.MAINNET.sui,
  [Network.Staging]: CONTRACTS.MAINNET.sui,
  [Network.Testnet]: CONTRACTS.TESTNET.sui,
  [Network.TestnetK8s]: CONTRACTS.TESTNET.sui,
  [Network.TestnetOld]: CONTRACTS.TESTNET.sui,
  [Network.Devnet]: CONTRACTS.TESTNET.sui,
  [Network.Devnet1]: CONTRACTS.TESTNET.sui,
  [Network.Devnet2]: CONTRACTS.TESTNET.sui,
  [Network.Local]: CONTRACTS.TESTNET.sui,
}

export const WORMHOLE_KLAYTN_CONTRACT_BY_NETWORK = {
  [Network.Mainnet]: CONTRACTS.MAINNET.klaytn,
  [Network.MainnetK8s]: CONTRACTS.MAINNET.klaytn,
  [Network.MainnetLB]: CONTRACTS.MAINNET.klaytn,
  [Network.Public]: CONTRACTS.MAINNET.klaytn,
  [Network.Internal]: CONTRACTS.MAINNET.klaytn,
  [Network.Staging]: CONTRACTS.MAINNET.klaytn,
  [Network.Testnet]: CONTRACTS.TESTNET.klaytn,
  [Network.TestnetK8s]: CONTRACTS.TESTNET.klaytn,
  [Network.TestnetOld]: CONTRACTS.TESTNET.klaytn,
  [Network.Devnet]: CONTRACTS.TESTNET.klaytn,
  [Network.Devnet1]: CONTRACTS.TESTNET.klaytn,
  [Network.Devnet2]: CONTRACTS.TESTNET.klaytn,
  [Network.Local]: CONTRACTS.TESTNET.klaytn,
}

export const WORMHOLE_APTOS_CONTRACT_BY_NETWORK = {
  [Network.Mainnet]: CONTRACTS.MAINNET.aptos,
  [Network.MainnetK8s]: CONTRACTS.MAINNET.aptos,
  [Network.MainnetLB]: CONTRACTS.MAINNET.aptos,
  [Network.Public]: CONTRACTS.MAINNET.aptos,
  [Network.Internal]: CONTRACTS.MAINNET.aptos,
  [Network.Staging]: CONTRACTS.MAINNET.aptos,
  [Network.Testnet]: CONTRACTS.TESTNET.aptos,
  [Network.TestnetK8s]: CONTRACTS.TESTNET.aptos,
  [Network.TestnetOld]: CONTRACTS.TESTNET.aptos,
  [Network.Devnet]: CONTRACTS.TESTNET.aptos,
  [Network.Devnet1]: CONTRACTS.TESTNET.aptos,
  [Network.Devnet2]: CONTRACTS.TESTNET.aptos,
  [Network.Local]: CONTRACTS.TESTNET.aptos,
}

export const WORMHOLE_CHAINS = CHAINS
export const WORMHOLE_CONTRACTS = CONTRACTS
