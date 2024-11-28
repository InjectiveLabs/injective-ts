import {
  Wallet,
  capitalize,
  BrowserEip1993Provider,
} from '@injectivelabs/wallet-base'
import { EthereumChainId } from '@injectivelabs/ts-types'
import { WalletException } from '@injectivelabs/exceptions'
import { getOkxWalletProvider } from '../strategy/utils/Okx.js'
import { getBitGetProvider } from '../strategy/utils/bitget.js'
import { getPhantomProvider } from '../strategy/utils/phantom.js'
import { getMetamaskProvider } from '../strategy/utils/metamask.js'
import { getTrustWalletProvider } from '../strategy/utils/trustWallet.js'
import { evmWallets } from '../data/index.js'

export const getEvmProvider = async (
  wallet: Wallet,
): Promise<BrowserEip1993Provider> => {
  if (!evmWallets.includes(wallet)) {
    throw new WalletException(
      new Error(`Evm Wallet for ${capitalize(wallet)} is not supported.`),
    )
  }

  try {
    let provider

    if (wallet === Wallet.Metamask) {
      provider = (await getMetamaskProvider()) as BrowserEip1993Provider
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

    if (!provider) {
      throw new WalletException(
        new Error(`Please install ${capitalize(wallet)} Extension`),
      )
    }

    return provider
  } catch (e) {
    throw new WalletException(
      new Error(`Please install ${capitalize(wallet)} Extension`),
    )
  }
}

export const updateEvmNetwork = async (
  wallet: Wallet,
  chainId: EthereumChainId,
) => {
  if (!evmWallets.includes(wallet)) {
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

  try {
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
      new Error(`Please update your ${capitalize(wallet)} network`),
    )
  }
}
