import { isServerSide } from '@injectivelabs/sdk-ts'
import type {
  BrowserEip1993Provider,
  WindowWithEip1193Provider,
} from '@injectivelabs/wallet-base'

const $window = (isServerSide()
  ? {}
  : window) as unknown as WindowWithEip1193Provider

export async function getRainbowProvider({ timeout } = { timeout: 3000 }) {
  const provider = getRainbowWalletFromWindow()

  if (provider) {
    return provider
  }

  return listenForRainbowWalletInitialized({
    timeout,
  }) as Promise<BrowserEip1993Provider>
}

async function listenForRainbowWalletInitialized(
  { timeout } = { timeout: 3000 },
) {
  return new Promise((resolve) => {
    const handleInitialization = () => {
      resolve(getRainbowWalletFromWindow())
    }

    $window.addEventListener('rainbow#initialized', handleInitialization, {
      once: true,
    })

    setTimeout(() => {
      $window.removeEventListener('rainbow#initialized', handleInitialization)
      resolve(null)
    }, timeout)
  })
}

function getRainbowWalletFromWindow() {
  const injectedProviderExist =
    typeof window !== 'undefined' &&
    (typeof $window.ethereum !== 'undefined' ||
      typeof $window.rainbow !== 'undefined')

  // No injected providers exist.
  if (!injectedProviderExist) {
    return
  }

  if ($window.rainbow) {
    return $window.rainbow
  }

  if ($window.ethereum.isRainbow) {
    return $window.ethereum
  }

  if ($window.providers) {
    return $window.providers.find((p) => p.isRainbow)
  }

  return
}
