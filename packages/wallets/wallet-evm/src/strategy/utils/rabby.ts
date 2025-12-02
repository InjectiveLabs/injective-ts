import { isServerSide } from '@injectivelabs/sdk-ts/utils'
import type {
  BrowserEip1993Provider,
  WindowWithEip1193Provider,
} from '@injectivelabs/wallet-base'

const $window = (isServerSide()
  ? {}
  : window) as unknown as WindowWithEip1193Provider

export async function getRabbyProvider({ timeout } = { timeout: 3000 }) {
  const provider = getRabbyFromWindow()

  if (provider) {
    return provider
  }

  return listenForRabbyInitialized({
    timeout,
  }) as Promise<BrowserEip1993Provider>
}

async function listenForRabbyInitialized({ timeout } = { timeout: 3000 }) {
  return new Promise((resolve) => {
    const handleInitialization = () => {
      resolve(getRabbyFromWindow())
    }

    $window.addEventListener('rabby#initialized', handleInitialization, {
      once: true,
    })

    setTimeout(() => {
      $window.removeEventListener('rabby#initialized', handleInitialization)
      resolve(null)
    }, timeout)
  })
}

function getRabbyFromWindow() {
  const injectedProviderExist =
    typeof window !== 'undefined' && typeof $window.ethereum !== 'undefined'

  // No injected providers exist.
  if (!injectedProviderExist) {
    return
  }

  if ($window.ethereum.isRabby) {
    return $window.ethereum
  }

  if ($window.providers) {
    return $window.providers.find((p) => p.isRabby)
  }

  return
}
