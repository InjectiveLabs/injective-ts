import type {
  BrowserEip1993Provider,
  WindowWithEip1193Provider,
} from '@injectivelabs/wallet-base'

const getWindow = () =>
  (typeof window === 'undefined'
    ? {}
    : window) as unknown as WindowWithEip1193Provider

export async function getKeplrEvmProvider({ timeout } = { timeout: 3000 }) {
  const provider = getKeplrEvmFromWindow()

  if (provider) {
    return provider
  }

  return listenForKeplrEvmInitialized({
    timeout,
  }) as Promise<BrowserEip1993Provider>
}

async function listenForKeplrEvmInitialized({ timeout } = { timeout: 3000 }) {
  return new Promise((resolve) => {
    const handleInitialization = () => {
      resolve(getKeplrEvmFromWindow())
    }

    const $window = getWindow()

    $window.addEventListener('keplr#initialized', handleInitialization, {
      once: true,
    })

    setTimeout(() => {
      $window.removeEventListener('keplr#initialized', handleInitialization)
      resolve(null)
    }, timeout)
  })
}

function getKeplrEvmFromWindow() {
  const $window = getWindow()
  const injectedProviderExist =
    typeof window !== 'undefined' &&
    (typeof $window.ethereum !== 'undefined' ||
      typeof ($window as any).keplr?.ethereum !== 'undefined')

  // No injected providers exist.
  if (!injectedProviderExist) {
    return
  }

  // Keplr exposes its EVM provider via window.keplr.ethereum
  if (($window as any).keplr?.ethereum) {
    return ($window as any).keplr.ethereum as BrowserEip1993Provider
  }

  if ($window.ethereum?.isKeplr) {
    return $window.ethereum
  }

  if ($window.providers) {
    return $window.providers.find((p) => p.isKeplr)
  }

  return
}
