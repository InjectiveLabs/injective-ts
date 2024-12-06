import { WalletException } from '@injectivelabs/exceptions'
import { EthereumChainId } from '@injectivelabs/ts-types'
import { BrowserEip1993Provider } from '../../../strategies/wallet-strategy/types.js'
import { getTrustWalletProvider } from '../../../strategies/wallet-strategy/strategies/TrustWallet/utils.js'

export const updateTrustWalletNetwork = async (chainId: EthereumChainId) => {
  try {
    const provider = (await getTrustWalletProvider()) as BrowserEip1993Provider

    if (!provider) {
      throw new WalletException(
        new Error('Please install Trust Wallet Extension'),
      )
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
    throw new WalletException(
      new Error('Please update your Trust Wallet network'),
    )
  }
}
