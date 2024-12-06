import { isServerSide } from '@injectivelabs/sdk-ts'
import { BrowserEip1993Provider, WindowWithEip1193Provider } from '../../types.js'

const $window = (isServerSide()
  ? {}
  : window) as unknown as WindowWithEip1193Provider

export async function getMetamaskProvider({ timeout } = { timeout: 3000 }) {
  const provider = getMetamaskFromWindow()

  if (provider) {
    return provider
  }

  return listenForMetamaskInitialized({
    timeout,
  }) as Promise<BrowserEip1993Provider>
}

async function listenForMetamaskInitialized({ timeout } = { timeout: 3000 }) {
  return new Promise((resolve) => {
    const handleInitialization = () => {
      resolve(getMetamaskFromWindow())
    }

    $window.addEventListener('ethereum#initialized', handleInitialization, {
      once: true,
    })

    setTimeout(() => {
      $window.removeEventListener('ethereum#initialized', handleInitialization)
      resolve(null)
    }, timeout)
  })
}

function getMetamaskFromWindow() {
  const injectedProviderExist =
    typeof window !== 'undefined' && typeof $window.ethereum !== 'undefined'

  // No injected providers exist.
  if (!injectedProviderExist) {
    return
  }

  if ($window.ethereum.isMetaMask) {
    return $window.ethereum
  }

  if ($window.providers) {
    return $window.providers.find((p) => p.isMetaMask)
  }

  return
}
