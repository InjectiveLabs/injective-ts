import { Wallet } from '@injectivelabs/wallet-base'
import { getEvmProviderWithFallback } from './providerResolver.js'
import type { BrowserEip1993Provider } from '@injectivelabs/wallet-base'

export async function getOkxWalletProvider(
  { timeout } = { timeout: 3000 },
): Promise<BrowserEip1993Provider> {
  const provider = await getEvmProviderWithFallback(Wallet.OkxWallet, {
    timeout,
  })

  if (!provider) {
    throw new Error(`Please install the ${Wallet.OkxWallet} wallet extension.`)
  }

  return provider
}
