import { Wallet } from '@injectivelabs/wallet-base'
import { getEvmProviderWithFallback } from './providerResolver.js'
import type { BrowserEip1993Provider } from '@injectivelabs/wallet-base'

export async function getRainbowProvider(
  { timeout } = { timeout: 3000 },
): Promise<BrowserEip1993Provider> {
  return getEvmProviderWithFallback(Wallet.Rainbow, {
    timeout,
  }) as Promise<BrowserEip1993Provider>
}
