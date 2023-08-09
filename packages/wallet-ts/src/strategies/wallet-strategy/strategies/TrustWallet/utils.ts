import { isServerSide } from '@injectivelabs/sdk-ts'
import { BrowserEip1993Provider, WindowWithEip1193Provider } from '../../types'

const $window = (isServerSide()
  ? {}
  : window) as unknown as WindowWithEip1193Provider

export async function getTrustWalletInjectedProvider(
  { timeout } = { timeout: 3000 },
) {
  const provider = getTrustWalletFromWindow()

  if (provider) {
    return provider
  }

  return listenForTrustWalletInitialized({ timeout })
}

async function listenForTrustWalletInitialized(
  { timeout } = { timeout: 3000 },
) {
  return new Promise((resolve) => {
    const handleInitialization = () => {
      resolve(getTrustWalletFromWindow())
    }

    $window.addEventListener('trustwallet#initialized', handleInitialization, {
      once: true,
    })

    setTimeout(() => {
      $window.removeEventListener(
        'trustwallet#initialized',
        handleInitialization,
      )
      resolve(null)
    }, timeout)
  })
}

function getTrustWalletFromWindow() {
  const isTrustWallet = (ethereum: BrowserEip1993Provider) => {
    // Identify if Trust Wallet injected provider is present.
    const trustWallet = !!ethereum.isTrust

    return trustWallet
  }

  const injectedProviderExist =
    typeof window !== 'undefined' && typeof $window.ethereum !== 'undefined'

  // No injected providers exist.
  if (!injectedProviderExist) {
    return null
  }

  // Trust Wallet was injected into $window.ethereum.
  if (isTrustWallet($window.ethereum)) {
    return $window.ethereum
  }

  // Trust Wallet provider might be replaced by another
  // injected provider, check the providers array.
  if ($window.providers) {
    // ethereum.providers array is a non-standard way to
    // preserve multiple injected providers. Eventually, EIP-5749
    // will become a living standard and we will have to update this.
    return $window.providers.find(isTrustWallet) ?? null
  }

  // Trust Wallet injected provider is available in the global scope.
  // There are cases that some cases injected providers can replace $window.ethereum
  // without updating the ethereum.providers array. To prevent issues where
  // the TW connector does not recognize the provider when TW extension is installed,
  // we begin our checks by relying on TW's global object.
  // @ts-ignore
  return window['trustwallet'] ?? null
}
