import { ZERO_ADDRESS } from '@injectivelabs/utils'
import { ChainId } from '@injectivelabs/ts-types'
import { Network } from '@injectivelabs/networks'
import {
  ContractAddressesForChainId,
  ContractAddressesForNetwork,
  ContractAddresses,
} from './types'

export const contractAddresses = {
  '1': {
    peggy: '0xF955C57f9EA9Dc8781965FEaE0b6A2acE2BAD6f3',
    injective: '0xe28b3b32b6c345a34ff64674606124dd5aceca30',
  },
  '3': {
    peggy: ZERO_ADDRESS,
    injective: ZERO_ADDRESS,
  },
  '4': {
    peggy: ZERO_ADDRESS,
    injective: ZERO_ADDRESS,
  },
  '888': {
    peggy: ZERO_ADDRESS,
    injective: ZERO_ADDRESS,
  },
  '1337': {
    peggy: '0x8d61158a366019aC78Db4149D75FfF9DdA51160D',
    injective: '0x04B5dAdd2c0D6a261bfafBc964E0cAc48585dEF3',
  },
  '31337': {
    peggy: '0x25B8Fe1DE9dAf8BA351890744FF28cf7dFa8f5e3',
    injective: '0x0B1ba0af832d7C05fD64161E0Db78E85978E8082',
  },
} as ContractAddressesForChainId

export const contractAddressesByNetwork = {
  [Network.Mainnet]: {
    peggy: '0xF955C57f9EA9Dc8781965FEaE0b6A2acE2BAD6f3',
    injective: '0xe28b3b32b6c345a34ff64674606124dd5aceca30',
  },
  [Network.MainnetK8s]: {
    peggy: '0xF955C57f9EA9Dc8781965FEaE0b6A2acE2BAD6f3',
    injective: '0xe28b3b32b6c345a34ff64674606124dd5aceca30',
  },
  [Network.MainnetOld]: {
    peggy: '0xF955C57f9EA9Dc8781965FEaE0b6A2acE2BAD6f3',
    injective: '0xe28b3b32b6c345a34ff64674606124dd5aceca30',
  },
  [Network.MainnetStaging]: {
    peggy: '0xF955C57f9EA9Dc8781965FEaE0b6A2acE2BAD6f3',
    injective: '0xe28b3b32b6c345a34ff64674606124dd5aceca30',
  },
  [Network.Testnet]: {
    peggy: '0xd6Da9dA014806Fdb64bF39b48fcA386AE3420d21',
    injective: '0x96853aBD7e589D06b7dade1b9264f1a5c2d3176E',
  },
  [Network.TestnetK8s]: {
    peggy: '0xd6Da9dA014806Fdb64bF39b48fcA386AE3420d21',
    injective: '0x96853aBD7e589D06b7dade1b9264f1a5c2d3176E',
  },
  [Network.Devnet]: {
    peggy: '0xE768662CcDd434312b9097c2cF558B683B6b5dDa',
    injective: '0x87aB3B4C8661e07D6372361211B96ed4Dc36B1B5',
  },
  [Network.Devnet1]: {
    peggy: '0x3A8634160d7577593CEEcDb2cc038A3437607318',
    injective: '0x87aB3B4C8661e07D6372361211B96ed4Dc36B1B5',
  },
} as ContractAddressesForNetwork

export const getContractAddressesForChainOrThrow = (
  chainId: ChainId,
): ContractAddresses => {
  const chainToAddresses: {
    [chainId: string]: ContractAddresses
  } = contractAddresses

  if (chainToAddresses[chainId] === undefined) {
    throw new Error(`Unknown chain id (${chainId}).`)
  }

  return { ...chainToAddresses[chainId] }
}

export const getContractAddressesForNetworkOrThrow = (
  network: Network,
): ContractAddresses => {
  const chainToAddresses: {
    [network: string]: ContractAddresses
  } = contractAddressesByNetwork

  if (chainToAddresses[network] === undefined) {
    throw new Error(`Unknown network (${network}).`)
  }

  return { ...chainToAddresses[network] }
}
