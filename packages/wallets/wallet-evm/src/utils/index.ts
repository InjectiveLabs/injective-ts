import { capitalize } from '@injectivelabs/utils'
import { WalletException } from '@injectivelabs/exceptions'
import {
  Wallet,
  getEvmChainConfig,
  isEvmBrowserWallet,
} from '@injectivelabs/wallet-base'
import { getRabbyProvider } from '../strategy/utils/rabby.js'
import { getOkxWalletProvider } from '../strategy/utils/Okx.js'
import { getBitGetProvider } from '../strategy/utils/bitget.js'
import { getPhantomProvider } from '../strategy/utils/phantom.js'
import { getKeplrEvmProvider } from '../strategy/utils/keplrEvm.js'
import { getMetamaskProvider } from '../strategy/utils/metamask.js'
import { getTrustWalletProvider } from '../strategy/utils/trustWallet.js'
import type { EvmChainId } from '@injectivelabs/ts-types'
import type { BrowserEip1993Provider } from '@injectivelabs/wallet-base'

export const getEvmProvider = async (
  wallet: Wallet,
): Promise<BrowserEip1993Provider> => {
  if (!isEvmBrowserWallet(wallet)) {
    throw new WalletException(
      new Error(`Evm Wallet for ${capitalize(wallet)} is not supported.`),
    )
  }

  try {
    let provider

    if (wallet === Wallet.Metamask) {
      provider = (await getMetamaskProvider()) as BrowserEip1993Provider
    }

    if (wallet === Wallet.Rabby) {
      provider = (await getRabbyProvider()) as BrowserEip1993Provider
    }

    if (wallet === Wallet.BitGet) {
      provider = (await getBitGetProvider()) as BrowserEip1993Provider
    }

    if (wallet === Wallet.Phantom) {
      provider = (await getPhantomProvider()) as BrowserEip1993Provider
    }

    if (wallet === Wallet.TrustWallet) {
      provider = (await getTrustWalletProvider()) as BrowserEip1993Provider
    }

    if (wallet === Wallet.OkxWallet) {
      provider = (await getOkxWalletProvider()) as BrowserEip1993Provider
    }

    if (wallet === Wallet.KeplrEvm) {
      provider = (await getKeplrEvmProvider()) as BrowserEip1993Provider
    }

    if (!provider) {
      throw new WalletException(
        new Error(`Please install ${capitalize(wallet)} Extension`),
      )
    }

    return provider
  } catch {
    throw new WalletException(
      new Error(`Please install ${capitalize(wallet)} Extension`),
    )
  }
}

export const updateEvmNetwork = async (wallet: Wallet, chainId: EvmChainId) => {
  if (!isEvmBrowserWallet(wallet)) {
    throw new WalletException(
      new Error(`Evm Wallet for ${capitalize(wallet)} is not supported.`),
    )
  }

  const provider = (await getEvmProvider(wallet)) as BrowserEip1993Provider

  if (!provider) {
    throw new WalletException(
      new Error(`Please install ${capitalize(wallet)} Extension`),
    )
  }

  const chainIdToHex = `0x${chainId.toString(16)}`

  const TIMEOUT_MS = 30_000

  try {
    return await Promise.race([
      provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdToHex }],
      }),
      new Promise<void>((resolve, reject) => {
        const handleChainChanged = (newChainId: string) => {
          if (newChainId.toLowerCase() === chainIdToHex.toLowerCase()) {
            cleanup()
            resolve()
          }
        }

        const timeoutId = setTimeout(() => {
          cleanup()
          reject(new Error('Chain switch timed out'))
        }, TIMEOUT_MS)

        const cleanup = () => {
          provider.removeListener('chainChanged', handleChainChanged)
          clearTimeout(timeoutId)
        }

        provider.on('chainChanged', handleChainChanged)
      }),
    ])
  } catch (switchError: any) {
    const errorCode =
      switchError?.code ?? switchError?.data?.originalError?.code

    if (errorCode === 4902) {
      const chainConfig = getEvmChainConfig(chainId)

      try {
        const rpcUrl = chainConfig.rpcUrls?.default?.http?.[0]
        const explorerUrl =
          chainConfig.blockExplorers?.default?.url || undefined

        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: chainIdToHex,
              chainName: chainConfig.name,
              nativeCurrency: chainConfig.nativeCurrency,
              rpcUrls: rpcUrl ? [rpcUrl] : [],
              blockExplorerUrls: explorerUrl ? [explorerUrl] : undefined,
            },
          ],
        })

        return
      } catch {
        throw new WalletException(
          new Error(
            `Failed to add ${chainConfig.name} network to ${capitalize(wallet)}`,
          ),
        )
      }
    }

    throw new WalletException(
      new Error(`Please update your ${capitalize(wallet)} network`),
    )
  }
}
