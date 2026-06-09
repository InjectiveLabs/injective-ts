import { capitalize } from '@injectivelabs/utils'
import { ErrorType, WalletException } from '@injectivelabs/exceptions'
import {
  Wallet,
  WalletAction,
  getEvmChainConfig,
  isEvmBrowserWallet,
  EvmWalletProviderErrorCode,
} from '@injectivelabs/wallet-base'
import { getRabbyProvider } from '../strategy/utils/rabby.js'
import { getOkxWalletProvider } from '../strategy/utils/Okx.js'
import { getBitGetProvider } from '../strategy/utils/bitget.js'
import { getPhantomProvider } from '../strategy/utils/phantom.js'
import { getKeplrEvmProvider } from '../strategy/utils/keplrEvm.js'
import { getMetamaskProvider } from '../strategy/utils/metamask.js'
import { getTrustWalletProvider } from '../strategy/utils/trustWallet.js'
import type { EvmChainId } from '@injectivelabs/ts-types'
import type { ErrorCode } from '@injectivelabs/exceptions'
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

export const extractNormalizedErrorCode = (error: unknown): number => {
  const normalizedError =
    error && typeof error === 'object'
      ? (error as {
          code?: unknown
          data?: { originalError?: { code?: unknown } }
        })
      : undefined
  const code = normalizedError?.code
  const originalCode = normalizedError?.data?.originalError?.code
  const codeNormalized = code != null ? Number(code) : undefined
  const rawCode =
    codeNormalized === EvmWalletProviderErrorCode.InternalError ||
    code === undefined ||
    code === null
      ? (originalCode ?? code)
      : code

  return rawCode != null ? Number(rawCode) : NaN
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

export const updateEvmNetwork = async (
  wallet: Wallet,
  chainId: EvmChainId,
  providerOverride?: BrowserEip1993Provider,
) => {
  if (!isEvmBrowserWallet(wallet)) {
    throw new WalletException(
      new Error(`Evm Wallet for ${capitalize(wallet)} is not supported.`),
    )
  }

  const provider = providerOverride || (await getEvmProvider(wallet))

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
    const errorCode = extractNormalizedErrorCode(switchError)

    if (errorCode === EvmWalletProviderErrorCode.UserRejectedRequest) {
      throw new WalletException(
        new Error(`${capitalize(wallet)} chain switch was rejected`),
      )
    }

    if ((switchError as Error).message === 'Chain switch timed out') {
      throw new WalletException(new Error('Chain switch timed out'))
    }

    if (errorCode !== EvmWalletProviderErrorCode.UnrecognizedChain) {
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
    } catch (addError) {
      const addErrorCode = extractNormalizedErrorCode(addError)

      if (addErrorCode === EvmWalletProviderErrorCode.UserRejectedRequest) {
        throw new WalletException(
          new Error(`${capitalize(wallet)} add chain was rejected`),
          {
            code: EvmWalletProviderErrorCode.UserRejectedRequest as ErrorCode,
            type: ErrorType.WalletError,
            contextModule: WalletAction.GetChainId,
          },
        )
      }

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
        const postAddErrorCode = extractNormalizedErrorCode(postAddError)

        if (
          postAddErrorCode === EvmWalletProviderErrorCode.UserRejectedRequest
        ) {
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
