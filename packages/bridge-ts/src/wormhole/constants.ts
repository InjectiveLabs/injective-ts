import { Network } from '@injectivelabs/networks'
import { CHAINS, CONTRACTS } from '@certusone/wormhole-sdk'

export const WORMHOLE_CONTRACT_BY_NETWORK = {
  [Network.Testnet]: CONTRACTS.TESTNET.injective,
}

export const WORMHOLE_SOLANA_CONTRACT_BY_NETWORK = {
  [Network.Testnet]: CONTRACTS.TESTNET.solana,
}

export const WORMHOLE_CHAINS = CHAINS

export const WORMHOLE_CONTRACTS = CONTRACTS
