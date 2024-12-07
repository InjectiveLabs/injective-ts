import { ethers } from 'ethers'
import { WalletException } from '@injectivelabs/exceptions'
import { EthereumChainId } from '@injectivelabs/ts-types'
import { BrowserEip1993Provider } from '../../../strategies/wallet-strategy/types.js'
import { getBitGetProvider } from '../../../strategies/wallet-strategy/strategies/BitGet/utils.js'

export const getEthersProviderFromBitGet = async () => {
  try {
    const provider = (await getBitGetProvider()) as BrowserEip1993Provider

    if (!provider) {
      throw new WalletException(new Error('Please install BitGet Extension'))
    }

    return new ethers.BrowserProvider(provider, 'any')
  } catch (e) {
    throw new WalletException(new Error('Please install BitGet Extension'))
  }
}

export const updateBitGetNetwork = async (chainId: EthereumChainId) => {
  try {
    const provider = (await getBitGetProvider()) as BrowserEip1993Provider

    if (!provider) {
      throw new WalletException(new Error('Please install BitGet Extension'))
    }

    const chainIdToHex = chainId.toString(16)

    return await Promise.race([
      provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainIdToHex}` }],
      }),
      new Promise<void>((resolve) =>
        provider.on('change', ({ chain }: any) => {
          if (chain?.id === chainIdToHex) {
            resolve()
          }
        }),
      ),
    ])
  } catch (e) {
    throw new WalletException(new Error('Please update your BitGet network'))
  }
}
