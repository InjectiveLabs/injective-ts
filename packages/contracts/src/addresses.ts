import { ZERO_ADDRESS } from '@injectivelabs/utils'
import { ChainId } from '@injectivelabs/ts-types'
import { ChainIdContractAddresses } from './types'

export const contractAddresses = {
  '1': {
    depositManager: '0x53f2b8cc450679d04c479a048dc3ff39a4d20d13',
    futures: ZERO_ADDRESS,
    baseCurrency: ZERO_ADDRESS,
    priceFeeder: ZERO_ADDRESS,
    peggy: '0xb68de9f5635fd6C3b075F209b8e47d06D3C7a8Af',
    injective: '0xe28b3b32b6c345a34ff64674606124dd5aceca30',
  },
  '3': {
    depositManager: ZERO_ADDRESS,
    futures: ZERO_ADDRESS,
    baseCurrency: ZERO_ADDRESS,
    priceFeeder: ZERO_ADDRESS,
    peggy: ZERO_ADDRESS,
    injective: ZERO_ADDRESS,
  },
  '4': {
    depositManager: ZERO_ADDRESS,
    futures: ZERO_ADDRESS,
    baseCurrency: ZERO_ADDRESS,
    priceFeeder: ZERO_ADDRESS,
    peggy: ZERO_ADDRESS,
    injective: ZERO_ADDRESS,
  },
  '42': {
    depositManager: ZERO_ADDRESS,
    futures: ZERO_ADDRESS,
    baseCurrency: ZERO_ADDRESS,
    priceFeeder: ZERO_ADDRESS,
    peggy: '0x9752fCE6cfB4e6802E5093dbABB09A91c644B5bE',
    injective: '0xa3a9029b8120e2f09b194df4a249a24db461e573',
  },
  '888': {
    depositManager: ZERO_ADDRESS,
    peggy: ZERO_ADDRESS,
    futures: '0x2af57c6f558d831afd901d942820b002163de4ef',
    priceFeeder: '0x1000e635cb1c7b2f9d63561b64a03285621387b3',
    baseCurrency: '0xbac42cd5af0a26648aa459605bddd4020f939cf5',
    injective: ZERO_ADDRESS,
  },
  '1337': {
    depositManager: ZERO_ADDRESS,
    peggy: '0x8d61158a366019aC78Db4149D75FfF9DdA51160D',
    futures: ZERO_ADDRESS,
    priceFeeder: ZERO_ADDRESS,
    baseCurrency: ZERO_ADDRESS,
    injective: '0x04B5dAdd2c0D6a261bfafBc964E0cAc48585dEF3',
  },
  '31337': {
    depositManager: ZERO_ADDRESS,
    peggy: '0x25B8Fe1DE9dAf8BA351890744FF28cf7dFa8f5e3',
    futures: ZERO_ADDRESS,
    priceFeeder: ZERO_ADDRESS,
    baseCurrency: ZERO_ADDRESS,
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
