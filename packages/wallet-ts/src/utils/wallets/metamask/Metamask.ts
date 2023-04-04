import { Eip1193Provider, ethers } from 'ethers'
import detectEthereumProvider from '@metamask/detect-provider'
import { WalletException } from '@injectivelabs/exceptions'

export const getEthersProviderFromMetamask = async () => {
  try {
    const provider = await detectEthereumProvider<Eip1193Provider>({
      mustBeMetaMask: true,
    })

    if (!provider) {
      throw new WalletException(new Error('Please install Metamask Extension'))
    }

    return new ethers.BrowserProvider(provider)
  } catch (e) {
    throw new WalletException(new Error('Please install Metamask Extension'))
  }
}
