import { ethers } from 'ethers'
import { WalletException } from '@injectivelabs/exceptions'
import { EthereumChainId } from '@injectivelabs/ts-types'
import { getMetamaskProvider } from './../strategy/utils'
import { BrowserEip1993Provider } from '@injectivelabs/wallet-base'

export const getEthersProviderFromMetamask = async () => {
  try {
    const provider = (await getMetamaskProvider()) as BrowserEip1993Provider

    if (!provider) {
      throw new WalletException(new Error('Please install Metamask Extension'))
    }

    return new ethers.BrowserProvider(provider, 'any')
  } catch (e) {
    throw new WalletException(new Error('Please install Metamask Extension'))
  }
}

export const updateMetamaskNetwork = async (chainId: EthereumChainId) => {
  try {
    const provider = (await getMetamaskProvider()) as BrowserEip1993Provider

    if (!provider) {
      throw new WalletException(new Error('Please install Metamask Extension'))
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
    throw new WalletException(new Error('Please update your Metamask network'))
  }
}
