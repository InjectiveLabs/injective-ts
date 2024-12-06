import { isServerSide } from '@injectivelabs/sdk-ts'
import { BrowserEip1993Provider, WindowWithEip1193Provider } from '../../types.js'

const $window = (isServerSide()
  ? {}
  : window) as unknown as WindowWithEip1193Provider

export async function getOkxWalletProvider({ timeout } = { timeout: 3000 }) {
  const provider = getOkxWalletFromWindow()

  if (provider) {
    return provider
  }

  return listenForOkxWalletInitialized({
    timeout,
  }) as Promise<BrowserEip1993Provider>
}

async function listenForOkxWalletInitialized(
  { timeout } = { timeout: 3000 },
) {
  return new Promise((resolve) => {
    const handleInitialization = () => {
      resolve(getOkxWalletFromWindow())
    }

    $window.addEventListener('okxwallet#initialized', handleInitialization, {
      once: true,
    })

    setTimeout(() => {
      $window.removeEventListener(
        'okxwallet#initialized',
        handleInitialization,
      )
      resolve(null)
    }, timeout)
  })
}

function getOkxWalletFromWindow() {
  const injectedProviderExist =
    typeof window !== 'undefined' &&
    (typeof $window.ethereum !== 'undefined' ||
      typeof $window.okxwallet !== 'undefined')

  // No injected providers exist.
  if (!injectedProviderExist) {
    return
  }

  if ($window.okxwallet) {
    return $window.okxwallet
  }

  if ($window.ethereum.isOkxWallet) {
    return $window.ethereum
  }

  if ($window.providers) {
    return $window.providers.find((p) => p.isOkxWallet)
  }

  return
}
