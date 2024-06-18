import { isServerSide } from '@injectivelabs/sdk-ts'
import { BrowserEip1993Provider, WindowWithEip1193Provider } from '../../types'

const $window = (isServerSide()
  ? {}
  : window) as unknown as WindowWithEip1193Provider

export async function getPhantomProvider({ timeout } = { timeout: 3000 }) {
  const provider = getPhantomFromWindow()

  if (provider) {
    return provider
  }

  return listenForPhantomInitialized({
    timeout,
  }) as Promise<BrowserEip1993Provider>
}

async function listenForPhantomInitialized({ timeout } = { timeout: 3000 }) {
  return new Promise((resolve) => {
    const handleInitialization = () => {
      resolve(getPhantomFromWindow())
    }

    $window.addEventListener('phantom#initialized', handleInitialization, {
      once: true,
    })

    setTimeout(() => {
      $window.removeEventListener('phantom#initialized', handleInitialization)
      resolve(null)
    }, timeout)
  })
}

function getPhantomFromWindow() {
  const injectedProviderExist =
    typeof window !== 'undefined' &&
    (typeof $window.ethereum !== 'undefined' ||
      typeof $window.phantom !== 'undefined')

  // No injected providers exist.
  if (!injectedProviderExist) {
    return
  }

  if ($window.phantom) {
    return $window.phantom.ethereum
  }

  if ($window.ethereum.isPhantom) {
    return $window.ethereum
  }

  if ($window.providers) {
    return $window.providers.find((p) => p.isPhantom)
  }

  return
}
