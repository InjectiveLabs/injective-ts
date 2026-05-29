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

export const switchEthereumChainWithTimeout = async (
  provider: BrowserEip1993Provider,
  chainIdHex: string,
  timeoutMs = 30_000,
): Promise<void> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  let handleChainChanged: ((newChainId: string) => void) | undefined

  const cleanup = () => {
    if (handleChainChanged) {
      provider.removeListener('chainChanged', handleChainChanged)
      handleChainChanged = undefined
    }
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
      timeoutId = undefined
    }
  }

  const switchRequest = provider
    .request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    })
    .finally(cleanup)

  const chainChangedWaiter = new Promise<void>((resolve, reject) => {
    handleChainChanged = (newChainId: string) => {
      if (newChainId.toLowerCase() === chainIdHex.toLowerCase()) {
        cleanup()
        resolve()
      }
    }

    timeoutId = setTimeout(() => {
      cleanup()
      reject(new Error('Chain switch timed out'))
    }, timeoutMs)

    provider.on('chainChanged', handleChainChanged)
  })

  await Promise.race([switchRequest, chainChangedWaiter])
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
    await switchEthereumChainWithTimeout(provider, chainIdToHex, TIMEOUT_MS)
  } catch (switchError: any) {
    const rawCode = switchError?.code ?? switchError?.data?.originalError?.code
    const parsed = rawCode != null ? Number(rawCode) : NaN
    const errorCode = !isNaN(parsed) ? parsed : undefined

    // 4001 = user rejected the switch request
    if (errorCode === 4001) {
      throw new WalletException(
        new Error(`${capitalize(wallet)} chain switch was rejected`),
      )
    }

    if ((switchError as Error).message === 'Chain switch timed out') {
      throw new WalletException(new Error('Chain switch timed out'))
    }

    // 4902 = chain not found in wallet — attempt to add it
    if (errorCode !== 4902) {
      throw new WalletException(
        new Error(`Please update your ${capitalize(wallet)} network`),
      )
    }

    const chainConfig = getEvmChainConfig(chainId)
    const rpcUrl = chainConfig.rpcUrls?.default?.http?.[0]
    const explorerUrl = chainConfig.blockExplorers?.default?.url || undefined

    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: chainIdToHex,
            chainName: chainConfig.name,
            nativeCurrency: chainConfig.nativeCurrency,
            rpcUrls: rpcUrl ? [rpcUrl] : [],
            blockExplorerUrls: explorerUrl ? [explorerUrl] : [],
          },
        ],
      })
    } catch {
      throw new WalletException(
        new Error(
          `Failed to add ${chainConfig.name} network to ${capitalize(wallet)}`,
        ),
      )
    }

    let currentChainId: unknown
    try {
      currentChainId = await provider.request({ method: 'eth_chainId' })
    } catch {
      throw new WalletException(
        new Error(
          `Failed to get current chain ID from ${capitalize(wallet)} wallet`,
        ),
      )
    }

    if (
      typeof currentChainId !== 'string' ||
      !currentChainId.startsWith('0x')
    ) {
      throw new WalletException(
        new Error(
          `Invalid chain ID response from ${capitalize(wallet)}: ${String(currentChainId)}`,
        ),
      )
    }

    if (currentChainId.toLowerCase() !== chainIdToHex.toLowerCase()) {
      try {
        await switchEthereumChainWithTimeout(provider, chainIdToHex, TIMEOUT_MS)
      } catch (postAddError: any) {
        const rawCode =
          postAddError?.code ?? postAddError?.data?.originalError?.code
        const parsed = rawCode != null ? Number(rawCode) : NaN
        const postAddErrorCode = !isNaN(parsed) ? parsed : undefined

        if (postAddErrorCode === 4001) {
          throw new WalletException(
            new Error(
              `${capitalize(wallet)} chain switch after add was rejected`,
            ),
          )
        }

        throw new WalletException(
          new Error(
            `Failed to switch to ${chainConfig.name} network after adding it: ${(postAddError as Error).message}`,
          ),
        )
      }
    }
  }
}
