import { Network, isDevnet, isTestnet } from '@injectivelabs/networks'
import { CHAINS, CONTRACTS } from '@injectivelabs/wormhole-sdk'
import { WormholeSource } from './types'

export const WORMHOLE_CONTRACT_BY_NETWORK = (network: Network) => {
  if (isTestnet(network) || isDevnet(network)) {
    return CONTRACTS.TESTNET.injective
  }

  return CONTRACTS.MAINNET.injective
}

export const WORMHOLE_SOLANA_CONTRACT_BY_NETWORK = (network: Network) => {
  if (isTestnet(network) || isDevnet(network)) {
    return CONTRACTS.TESTNET.solana
  }

  return CONTRACTS.MAINNET.solana
}

export const WORMHOLE_ETHEREUM_CONTRACT_BY_NETWORK = (network: Network) => {
  if (isTestnet(network) || isDevnet(network)) {
    return CONTRACTS.TESTNET.ethereum
  }

  return CONTRACTS.MAINNET.ethereum
}

export const WORMHOLE_ARBITRUM_CONTRACT_BY_NETWORK = (network: Network) => {
  if (isTestnet(network) || isDevnet(network)) {
    return CONTRACTS.TESTNET.arbitrum
  }

  return CONTRACTS.MAINNET.arbitrum
}

export const WORMHOLE_POLYGON_CONTRACT_BY_NETWORK = (network: Network) => {
  if (isTestnet(network) || isDevnet(network)) {
    return CONTRACTS.TESTNET.polygon
  }

  return CONTRACTS.MAINNET.polygon
}

export const WORMHOLE_SUI_CONTRACT_BY_NETWORK = (network: Network) => {
  if (isTestnet(network) || isDevnet(network)) {
    return CONTRACTS.TESTNET.sui
  }

  return CONTRACTS.MAINNET.sui
}

export const WORMHOLE_KLAYTN_CONTRACT_BY_NETWORK = (network: Network) => {
  if (isTestnet(network) || isDevnet(network)) {
    return CONTRACTS.TESTNET.klaytn
  }

  return CONTRACTS.MAINNET.klaytn
}

export const WORMHOLE_APTOS_CONTRACT_BY_NETWORK = (network: Network) => {
  if (isTestnet(network) || isDevnet(network)) {
    return CONTRACTS.TESTNET.aptos
  }

  return CONTRACTS.MAINNET.aptos
}

export const WORMHOLE_WORMCHAIN_CONTRACT_BY_NETWORK = (network: Network) => {
  if (isTestnet(network) || isDevnet(network)) {
    return CONTRACTS.TESTNET.wormchain
  }

  return CONTRACTS.MAINNET.wormchain
}

export const WORMHOLE_WORMCHAIN_IBC_TRANSLATOR_BY_NETWORK = (
  network: Network,
) => {
  if (isTestnet(network) || isDevnet(network)) {
    return 'wormhole1ctnjk7an90lz5wjfvr3cf6x984a8cjnv8dpmztmlpcq4xteaa2xs9pwmzk'
  }

  return 'wormhole14ejqjyq8um4p3xfqj74yld5waqljf88fz25yxnma0cngspxe3les00fpjx'
}

export const WORMHOLE_CHAINS = CHAINS
export const WORMHOLE_CONTRACTS = CONTRACTS

export const WORMHOLE_NATIVE_WRAPPED_ADDRESS = (network: Network) => {
  if (isTestnet(network) || isDevnet(network)) {
    return {
      //
    }
  }

  return {
    [WormholeSource.Ethereum]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    [WormholeSource.Polygon]: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
  }
}
