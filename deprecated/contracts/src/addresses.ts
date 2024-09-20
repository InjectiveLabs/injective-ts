import { ZERO_ADDRESS } from '@injectivelabs/utils'
import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'
import { Network } from '@injectivelabs/networks'
import { GeneralException } from '@injectivelabs/exceptions'
import {
  ContractAddressesForChainId,
  ContractAddressesForNetwork,
  ContractAddresses,
} from './types'

export const contractAddresses: ContractAddressesForChainId = {
  [EthereumChainId.Mainnet]: {
    peggy: '0xF955C57f9EA9Dc8781965FEaE0b6A2acE2BAD6f3',
    injective: '0xe28b3B32B6c345A34Ff64674606124Dd5Aceca30',
  },
  [EthereumChainId.Ropsten]: {
    peggy: ZERO_ADDRESS,
    injective: ZERO_ADDRESS,
  },
  [EthereumChainId.Rinkeby]: {
    peggy: ZERO_ADDRESS,
    injective: ZERO_ADDRESS,
  },
  [EthereumChainId.Goerli]: {
    peggy: '0xd2C6753F6B1783EF0a3857275e16e79D91b539a3',
    injective: '0xAD1794307245443B3Cb55d88e79EEE4d8a548C03',
  },
  [EthereumChainId.Kovan]: {
    peggy: ZERO_ADDRESS,
    injective: ZERO_ADDRESS,
  },
  [EthereumChainId.Injective]: {
    peggy: ZERO_ADDRESS,
    injective: ZERO_ADDRESS,
  },
  [EthereumChainId.Sepolia]: {
    peggy: '0x12e1181a741b70BE6A9D81f85af3E92B6ba41897',
    injective: '0x5512c04B6FF813f3571bDF64A1d74c98B5257332',
  },
  [EthereumChainId.Ganache]: {
    peggy: ZERO_ADDRESS,
    injective: ZERO_ADDRESS,
  },
  [EthereumChainId.HardHat]: {
    peggy: ZERO_ADDRESS,
    injective: ZERO_ADDRESS,
  },
}

export const contractAddressesByNetwork: ContractAddressesForNetwork = {
  [Network.Mainnet]: {
    peggy: '0xF955C57f9EA9Dc8781965FEaE0b6A2acE2BAD6f3',
    injective: '0xe28b3B32B6c345A34Ff64674606124Dd5Aceca30',
  },
  [Network.MainnetK8s]: {
    peggy: '0xF955C57f9EA9Dc8781965FEaE0b6A2acE2BAD6f3',
    injective: '0xe28b3B32B6c345A34Ff64674606124Dd5Aceca30',
  },
  [Network.MainnetLB]: {
    peggy: '0xF955C57f9EA9Dc8781965FEaE0b6A2acE2BAD6f3',
    injective: '0xe28b3B32B6c345A34Ff64674606124Dd5Aceca30',
  },
  [Network.MainnetSentry]: {
    peggy: '0xF955C57f9EA9Dc8781965FEaE0b6A2acE2BAD6f3',
    injective: '0xe28b3B32B6c345A34Ff64674606124Dd5Aceca30',
  },
  [Network.MainnetOld]: {
    peggy: '0xF955C57f9EA9Dc8781965FEaE0b6A2acE2BAD6f3',
    injective: '0xe28b3B32B6c345A34Ff64674606124Dd5Aceca30',
  },
  [Network.Staging]: {
    peggy: '0xF955C57f9EA9Dc8781965FEaE0b6A2acE2BAD6f3',
    injective: '0xe28b3B32B6c345A34Ff64674606124Dd5Aceca30',
  },
  [Network.Internal]: {
    peggy: '0xF955C57f9EA9Dc8781965FEaE0b6A2acE2BAD6f3',
    injective: '0xe28b3B32B6c345A34Ff64674606124Dd5Aceca30',
  },
  [Network.Testnet]: {
    peggy: '0x12e1181a741b70BE6A9D81f85af3E92B6ba41897',
    injective: '0x5512c04B6FF813f3571bDF64A1d74c98B5257332',
  },
  [Network.TestnetK8s]: {
    peggy: '0x12e1181a741b70BE6A9D81f85af3E92B6ba41897',
    injective: '0x5512c04B6FF813f3571bDF64A1d74c98B5257332',
  },
  [Network.TestnetSentry]: {
    peggy: '0x12e1181a741b70BE6A9D81f85af3E92B6ba41897',
    injective: '0x5512c04B6FF813f3571bDF64A1d74c98B5257332',
  },
  [Network.TestnetOld]: {
    peggy: '0x12e1181a741b70BE6A9D81f85af3E92B6ba41897',
    injective: '0x5512c04B6FF813f3571bDF64A1d74c98B5257332',
  },
  [Network.Devnet]: {
    peggy: '0x430544ca09F7914077a0E8F405Da62292428F49D',
    injective: '0xBe8d71D26525440A03311cc7fa372262c5354A3c',
  },
  [Network.Devnet1]: {
    peggy: '0x0AAd19327a1b90DDE4e2D12FB99Ab8ee7E4E528D',
    injective: '0xBe8d71D26525440A03311cc7fa372262c5354A3c',
  },
  [Network.Devnet2]: {
    peggy: '0x0AAd19327a1b90DDE4e2D12FB99Ab8ee7E4E528D',
    injective: '0xBe8d71D26525440A03311cc7fa372262c5354A3c',
  },
  [Network.Local]: {
    peggy: '0x3c92F7779A7845d5eEf307aEF39066Ddba04A54b',
    injective: '0x3d940951C2cdFc7091cb6064A41053FBFbD016EF',
  },
}

export const getContractAddressesForChainOrThrow = (
  chainId: ChainId,
): ContractAddresses => {
  const chainToAddresses: {
    [chainId: string]: ContractAddresses
  } = contractAddresses

  if (chainToAddresses[chainId] === undefined) {
    throw new GeneralException(new Error(`Unknown chain id (${chainId}).`))
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
    throw new GeneralException(new Error(`Unknown network (${network}).`))
  }

  return { ...chainToAddresses[network] }
}
