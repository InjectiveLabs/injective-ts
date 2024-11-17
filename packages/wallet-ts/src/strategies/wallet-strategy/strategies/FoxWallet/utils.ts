import { isServerSide } from '@injectivelabs/sdk-ts'
import { BrowserEip1993Provider, WindowWithEip1193Provider } from '../../types'

const $window = (isServerSide()
  ? {}
  : window) as unknown as WindowWithEip1193Provider

export async function getFoxWalletProvider({ timeout } = { timeout: 3000 }) {
  const provider = getFoxWalletFromWindow()

  if (provider) {
    return provider
  }

  return listenForFoxWalletInitialized({
    timeout,
  }) as Promise<BrowserEip1993Provider>
}

async function listenForFoxWalletInitialized(
  { timeout } = { timeout: 3000 },
) {
  return new Promise((resolve) => {
    const handleInitialization = () => {
      resolve(getFoxWalletFromWindow())
    }

    $window.addEventListener('foxwallet#initialized', handleInitialization, {
      once: true,
    })

    setTimeout(() => {
      $window.removeEventListener(
        'foxwallet#initialized',
        handleInitialization,
      )
      resolve(null)
    }, timeout)
  })
}

function getFoxWalletFromWindow() {
  const injectedProviderExist =
    typeof window !== 'undefined' &&
    (typeof $window.ethereum !== 'undefined' ||
      typeof $window.foxwallet !== 'undefined')

  // No injected providers exist.
  if (!injectedProviderExist) {
    return
  }

  if ($window.foxwallet) {
    return $window.foxwallet
  }

  if ($window.ethereum.isFoxWallet) {
    return $window.ethereum
  }

  if ($window.providers) {
    return $window.providers.find((p) => p.isFoxWallet)
  }

  return
}
