import { ZERO_ADDRESS } from '@injectivelabs/utils'
import { ChainId } from '@injectivelabs/ts-types'
import { ChainIdContractAddresses } from './types'

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
  '42': {
    peggy: '0xd6Da9dA014806Fdb64bF39b48fcA386AE3420d21',
    injective: '0xedFD23bA192966975887fA024E2b32e94AD0359a',
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
}

export const getContractAddressesForChainOrThrow = (
  chainId: ChainId,
): ChainIdContractAddresses => {
  const chainToAddresses: {
    [chainId: string]: ChainIdContractAddresses
  } = contractAddresses

  if (chainToAddresses[chainId] === undefined) {
    throw new Error(`Unknown chain id (${chainId}).`)
  }

  return { ...chainToAddresses[chainId] }
}
