import { isServerSide } from '@injectivelabs/sdk-ts'
import { BrowserEip1993Provider, WindowWithEip1193Provider } from '../../types'

const $window = (isServerSide()
  ? {}
  : window) as unknown as WindowWithEip1193Provider

export async function getMetamaskInjectedProvider(
  { timeout } = { timeout: 3000 },
) {
  const provider = getMetamaskFromWindow()

  if (provider) {
    return provider
  }

  return listenForMetamaskInitialized({ timeout })
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
  const isMetamask = (ethereum: BrowserEip1993Provider) => {
    // Identify if Metamask Wallet injected provider is present.
    const metamask = !!ethereum.isMetaMask

    return metamask
  }

  const injectedProviderExist =
    typeof window !== 'undefined' && typeof $window.ethereum !== 'undefined'

  // No injected providers exist.
  if (!injectedProviderExist) {
    return null
  }

  // Metamask Wallet was injected into $window.ethereum.
  if (isMetamask($window.ethereum)) {
    return $window.ethereum
  }

  if ($window.providers) {
    return $window.providers.find(isMetamask) ?? null
  }

  // @ts-ignore
  return window['ethereum'] ?? null
}
