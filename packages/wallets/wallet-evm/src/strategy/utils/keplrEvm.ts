import { Wallet } from '@injectivelabs/wallet-base'
import { getEvmProviderWithFallback } from './providerResolver.js'
import type { BrowserEip1193Provider } from '@injectivelabs/wallet-base'

export async function getKeplrEvmProvider(
  { timeout } = { timeout: 3000 },
): Promise<BrowserEip1193Provider> {
  const provider = await getEvmProviderWithFallback(Wallet.KeplrEvm, {
    timeout,
  })

  if (!provider) {
    throw new Error(`Please install the ${Wallet.KeplrEvm} wallet extension.`)
  }

  return provider
}
