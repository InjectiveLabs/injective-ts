import type {
  BrowserEip1993Provider,
  WindowWithEip1193Provider,
} from '@injectivelabs/wallet-base'

const getWindow = () =>
  (typeof window === 'undefined'
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

    const $window = getWindow()

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
  const $window = getWindow()
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
