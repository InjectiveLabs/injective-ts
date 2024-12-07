import { ethers } from 'ethers'
import { WalletException } from '@injectivelabs/exceptions'
import { EthereumChainId } from '@injectivelabs/ts-types'
import { BrowserEip1993Provider } from '../../../strategies/wallet-strategy/types.js'
import { getOkxWalletProvider } from '../../../strategies/wallet-strategy/strategies/Okx/utils.js'

export const getEthersProviderFromOkxWallet = async () => {
  try {
    const provider = (await getOkxWalletProvider()) as BrowserEip1993Provider

    if (!provider) {
      throw new WalletException(new Error('Please install OkxWallet Extension'))
    }

    return new ethers.BrowserProvider(provider, 'any')
  } catch (e) {
    throw new WalletException(new Error('Please install OkxWallet Extension'))
  }
}

export const updateOkxWalletNetwork = async (chainId: EthereumChainId) => {
  try {
    const provider = (await getOkxWalletProvider()) as BrowserEip1993Provider

    if (!provider) {
      throw new WalletException(new Error('Please install OkxWallet Extension'))
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
    throw new WalletException(new Error('Please update your OkxWallet network'))
  }
}
