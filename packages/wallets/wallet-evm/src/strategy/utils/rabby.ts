import { Wallet } from '@injectivelabs/wallet-base'
import { getEvmProviderWithFallback } from './providerResolver.js'
import type { BrowserEip1193Provider } from '@injectivelabs/wallet-base'

export async function getRabbyProvider(
  { timeout } = { timeout: 3000 },
): Promise<BrowserEip1193Provider> {
  const provider = await getEvmProviderWithFallback(Wallet.Rabby, {
    timeout,
  })

  if (!provider) {
    throw new Error(`Please install the ${Wallet.Rabby} wallet extension.`)
  }

  return provider
}
