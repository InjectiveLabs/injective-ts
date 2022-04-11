import { Network } from '@injectivelabs/networks'
import { getContractAddressesForNetworkOrThrow } from '@injectivelabs/contracts'

export const testnetSymbolToAddressMap = {
  INJ: getContractAddressesForNetworkOrThrow(Network.Testnet).injective,
}

export const devnetSymbolToAddressMap = {
  INJ: getContractAddressesForNetworkOrThrow(Network.Devnet).injective,
}

export const devnet1SymbolToAddressMap = {
  INJ: getContractAddressesForNetworkOrThrow(Network.Devnet1).injective,
}
