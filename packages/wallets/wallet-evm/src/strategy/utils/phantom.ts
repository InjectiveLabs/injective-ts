import { Wallet } from '@injectivelabs/wallet-base'
import { getEvmProviderWithFallback } from './providerResolver.js'
import type { BrowserEip1993Provider } from '@injectivelabs/wallet-base'

export async function getPhantomProvider(
  { timeout } = { timeout: 3000 },
): Promise<BrowserEip1993Provider> {
  const provider = await getEvmProviderWithFallback(Wallet.Phantom, {
    timeout,
  })

  if (!provider) {
    throw new Error(`Please install the ${Wallet.Phantom} wallet extension.`)
  }

  return provider
}
