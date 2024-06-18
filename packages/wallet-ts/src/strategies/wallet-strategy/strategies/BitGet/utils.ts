import { isServerSide } from '@injectivelabs/sdk-ts'
import { BrowserEip1993Provider, WindowWithEip1193Provider } from '../../types'

const $window = (isServerSide()
  ? {}
  : window) as unknown as WindowWithEip1193Provider

export async function getBitGetProvider({ timeout } = { timeout: 3000 }) {
  const provider = getBitGetFromWindow()

  if (provider) {
    return provider
  }

  return listenForBitGetInitialized({
    timeout,
  }) as Promise<BrowserEip1993Provider>
}

async function listenForBitGetInitialized({ timeout } = { timeout: 3000 }) {
  return new Promise((resolve) => {
    const handleInitialization = () => {
      resolve(getBitGetFromWindow())
    }

    $window.addEventListener('bitkeep#initialized', handleInitialization, {
      once: true,
    })

    setTimeout(() => {
      $window.removeEventListener('bitkeep#initialized', handleInitialization)
      resolve(null)
    }, timeout)
  })
}

function getBitGetFromWindow() {
  const injectedProviderExist =
    typeof window !== 'undefined' &&
    (typeof $window.ethereum !== 'undefined' ||
      typeof $window.bitkeep !== 'undefined')

  // No injected providers exist.
  if (!injectedProviderExist) {
    return
  }

  if ($window.bitkeep && $window.bitkeep.ethereum) {
    return $window.bitkeep.ethereum
  }

  return
}
