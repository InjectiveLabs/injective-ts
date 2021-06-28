import { ZERO_ADDRESS } from '@injectivelabs/utils'
import { ChainId } from '@injectivelabs/ts-types'
import { ChainIdContractAddresses } from './types'

export const contractAddresses = {
  '1': {
    depositManager: '0x53f2b8cc450679d04c479a048dc3ff39a4d20d13',
    peggy: '0xF955C57f9EA9Dc8781965FEaE0b6A2acE2BAD6f3',
    injective: '0xe28b3b32b6c345a34ff64674606124dd5aceca30',
  },
  '3': {
    depositManager: ZERO_ADDRESS,
    peggy: ZERO_ADDRESS,
    injective: ZERO_ADDRESS,
  },
  '4': {
    depositManager: ZERO_ADDRESS,
    peggy: ZERO_ADDRESS,
    injective: ZERO_ADDRESS,
  },
  '42': {
    depositManager: ZERO_ADDRESS,
    peggy: '0x9752fCE6cfB4e6802E5093dbABB09A91c644B5bE',
    injective: '0xa3a9029b8120e2f09b194df4a249a24db461e573',
  },
  '888': {
    depositManager: ZERO_ADDRESS,
    peggy: ZERO_ADDRESS,
    injective: ZERO_ADDRESS,
  },
  '1337': {
    depositManager: ZERO_ADDRESS,
    peggy: '0x8d61158a366019aC78Db4149D75FfF9DdA51160D',
    injective: '0x04B5dAdd2c0D6a261bfafBc964E0cAc48585dEF3',
  },
  '31337': {
    depositManager: ZERO_ADDRESS,
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
