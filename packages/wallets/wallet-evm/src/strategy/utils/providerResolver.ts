import { Wallet } from '@injectivelabs/wallet-base'
import type {
  EIP6963ProviderDetail,
  BrowserEip1193Provider,
  WindowWithEip1193Provider,
} from '@injectivelabs/wallet-base'

const EIP6963_REQUEST_TIMEOUT = 250

type ProviderCache = Partial<Record<Wallet, BrowserEip1193Provider>>

type BrowserEip1193ProviderWithLegacyMetadata = BrowserEip1193Provider & {
  providers?: BrowserEip1193ProviderWithLegacyMetadata[]
  isBitGet?: boolean
  isBitKeep?: boolean
}

type WindowWithLegacyProviders = Omit<
  WindowWithEip1193Provider,
  'ethereum' | 'providers' | 'rabby' | 'rainbow'
> & {
  ethereum?: BrowserEip1193ProviderWithLegacyMetadata
  providers?: BrowserEip1193ProviderWithLegacyMetadata[]
  rabby?: BrowserEip1193Provider
  rainbow?: BrowserEip1193Provider
}

type ResolveProviderOptions = {
  eip6963Providers?: ProviderCache
  requestEip6963?: boolean
  timeout?: number
}

const eip6963Providers: ProviderCache = {}

const getWindow = () =>
  (typeof window === 'undefined'
    ? {}
    : window) as unknown as WindowWithLegacyProviders

const normalize = (value?: string) => value?.toLowerCase().trim() || ''

const walletProviderMetadata = {
  [Wallet.Metamask]: {
    names: ['metamask'],
    rdns: ['io.metamask', 'io.metamask.flask'],
  },
  [Wallet.Rabby]: {
    names: ['rabby', 'rabby wallet'],
    rdns: ['io.rabby'],
  },
  [Wallet.Rainbow]: {
    names: ['rainbow', 'rainbow wallet'],
    rdns: ['me.rainbow'],
  },
  [Wallet.Phantom]: {
    names: ['phantom', 'phantom wallet'],
    rdns: ['app.phantom'],
  },
  [Wallet.OkxWallet]: {
    names: ['okx', 'okx wallet', 'okxwallet'],
    rdns: ['com.okex.wallet'],
  },
  [Wallet.BitGet]: {
    names: ['bitget', 'bitget wallet', 'bitkeep'],
    rdns: ['com.bitget.web3', 'com.bitget.wallet'],
  },
  [Wallet.TrustWallet]: {
    names: ['trust', 'trust wallet', 'trustwallet'],
    rdns: ['com.trustwallet.app', 'com.trustwallet'],
  },
  [Wallet.KeplrEvm]: {
    names: ['keplr', 'keplr wallet', 'keplr-evm'],
    rdns: ['app.keplr', 'io.keplr', 'io.keplr.wallet'],
  },
} satisfies Partial<Record<Wallet, { names: string[]; rdns: string[] }>>

const legacyProviderInitializedEvents: Partial<Record<Wallet, string>> = {
  [Wallet.Metamask]: 'ethereum#initialized',
  [Wallet.Rabby]: 'rabby#initialized',
  [Wallet.Rainbow]: 'rainbow#initialized',
  [Wallet.Phantom]: 'phantom#initialized',
  [Wallet.OkxWallet]: 'okxwallet#initialized',
  [Wallet.BitGet]: 'bitkeep#initialized',
  [Wallet.TrustWallet]: 'trustwallet#initialized',
  [Wallet.KeplrEvm]: 'keplr#initialized',
}

const competingMetaMaskFlags = [
  'isRabby',
  'isRainbow',
  'isPhantom',
  'isOkxWallet',
  'isTrustWallet',
  'isTrust',
  'isKeplr',
] as const

const isSupportedEip6963Wallet = (wallet: Wallet) =>
  wallet in walletProviderMetadata

const providerHasCompetingMetaMaskFlag = (provider: BrowserEip1193Provider) =>
  competingMetaMaskFlags.some((flag) => Boolean(provider[flag]))

export const providerMatchesWallet = (
  provider: BrowserEip1193Provider | undefined,
  wallet: Wallet,
) => {
  if (!provider) {
    return false
  }

  const legacyProvider = provider as BrowserEip1193ProviderWithLegacyMetadata

  if (wallet === Wallet.Metamask) {
    return (
      Boolean(provider.isMetaMask) &&
      !providerHasCompetingMetaMaskFlag(provider)
    )
  }

  if (wallet === Wallet.Rabby) {
    return Boolean(provider.isRabby)
  }

  if (wallet === Wallet.Rainbow) {
    return Boolean(provider.isRainbow)
  }

  if (wallet === Wallet.Phantom) {
    return Boolean(provider.isPhantom)
  }

  if (wallet === Wallet.OkxWallet) {
    return Boolean(provider.isOkxWallet)
  }

  if (wallet === Wallet.BitGet) {
    return Boolean(legacyProvider.isBitKeep || legacyProvider.isBitGet)
  }

  if (wallet === Wallet.TrustWallet) {
    return Boolean(provider.isTrustWallet || provider.isTrust)
  }

  if (wallet === Wallet.KeplrEvm) {
    return Boolean(provider.isKeplr)
  }

  return false
}

export const getWalletFromEip6963ProviderDetail = (
  detail: EIP6963ProviderDetail,
) => {
  const rdns = normalize(detail.info?.rdns)
  const name = normalize(detail.info?.name)
  const entries = Object.entries(walletProviderMetadata)
  const rdnsMatch = entries.find(([, metadata]) =>
    metadata.rdns.some((value) => normalize(value) === rdns),
  )

  if (rdnsMatch) {
    return rdnsMatch[0] as Wallet
  }

  return entries.find(([, metadata]) =>
    metadata.names.some((value) => normalize(value) === name),
  )?.[0] as Wallet | undefined
}

export const registerEip6963Provider = (
  detail: EIP6963ProviderDetail | undefined,
  providerCache?: ProviderCache,
) => {
  if (!detail?.provider) {
    return
  }

  const wallet = getWalletFromEip6963ProviderDetail(detail)

  if (!wallet) {
    return
  }

  eip6963Providers[wallet] = detail.provider

  if (providerCache) {
    providerCache[wallet] = detail.provider
  }

  return wallet
}

export const listenForEip6963Providers = (providerCache?: ProviderCache) => {
  if (typeof window === 'undefined') {
    return
  }

  const handleAnnouncement = (announcement: Event) => {
    registerEip6963Provider(
      (announcement as CustomEvent<EIP6963ProviderDetail>).detail,
      providerCache,
    )
  }

  window.addEventListener('eip6963:announceProvider', handleAnnouncement)

  return () =>
    window.removeEventListener('eip6963:announceProvider', handleAnnouncement)
}

export const requestEip6963Providers = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new Event('eip6963:requestProvider'))
}

const requestEip6963Provider = (
  wallet: Wallet,
  providerCache?: ProviderCache,
  timeout = EIP6963_REQUEST_TIMEOUT,
) => {
  if (typeof window === 'undefined' || timeout <= 0) {
    return Promise.resolve<BrowserEip1193Provider | undefined>(undefined)
  }

  return new Promise<BrowserEip1193Provider | undefined>((resolve) => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    let resolved = false
    let handleAnnouncement = (_announcement: Event) => {}

    const cleanup = () => {
      window.removeEventListener('eip6963:announceProvider', handleAnnouncement)

      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }

    const resolveProvider = (provider?: BrowserEip1193Provider) => {
      if (resolved) {
        return
      }

      resolved = true
      cleanup()
      resolve(provider)
    }

    handleAnnouncement = (announcement: Event) => {
      const announcedWallet = registerEip6963Provider(
        (announcement as CustomEvent<EIP6963ProviderDetail>).detail,
        providerCache,
      )

      if (announcedWallet === wallet) {
        resolveProvider(providerCache?.[wallet] || eip6963Providers[wallet])
      }
    }

    window.addEventListener('eip6963:announceProvider', handleAnnouncement)
    timeoutId = setTimeout(() => {
      resolveProvider(providerCache?.[wallet] || eip6963Providers[wallet])
    }, timeout)
    requestEip6963Providers()
  })
}

const uniqueProviders = (
  providers: Array<BrowserEip1193Provider | undefined>,
) => {
  const providerSet = new Set<BrowserEip1193Provider>()

  providers.forEach((provider) => {
    if (provider) {
      providerSet.add(provider)
    }
  })

  return [...providerSet]
}

const getWalletGlobalProvider = (
  wallet: Wallet,
  $window: WindowWithLegacyProviders,
) => {
  if (wallet === Wallet.Rabby) {
    return $window.rabby
  }

  if (wallet === Wallet.Rainbow) {
    return $window.rainbow
  }

  if (wallet === Wallet.Phantom) {
    return $window.phantom?.ethereum
  }

  if (wallet === Wallet.OkxWallet) {
    return $window.okxwallet
  }

  if (wallet === Wallet.BitGet) {
    return $window.bitkeep?.ethereum
  }

  if (wallet === Wallet.TrustWallet) {
    return $window.trustWallet
  }

  if (wallet === Wallet.KeplrEvm) {
    return $window.keplr?.ethereum
  }

  return undefined
}

export const getLegacyEvmProvider = (wallet: Wallet) => {
  const $window = getWindow()
  const ethereum = $window.ethereum
  const walletGlobalProvider = getWalletGlobalProvider(wallet, $window)

  if (walletGlobalProvider) {
    return walletGlobalProvider
  }

  const providerArrays = [
    ...(ethereum?.providers || []),
    ...($window.providers || []),
  ]
  const providerFromArray = uniqueProviders(providerArrays).find((provider) =>
    providerMatchesWallet(provider, wallet),
  )

  if (providerFromArray) {
    return providerFromArray
  }

  if (providerMatchesWallet(ethereum, wallet)) {
    return ethereum
  }

  return undefined
}

export const resolveEvmProvider = async (
  wallet: Wallet,
  options: ResolveProviderOptions = {},
) => {
  if (!isSupportedEip6963Wallet(wallet)) {
    return undefined
  }

  const {
    eip6963Providers: providerCache,
    requestEip6963 = true,
    timeout = EIP6963_REQUEST_TIMEOUT,
  } = options
  const cachedProvider = providerCache?.[wallet] || eip6963Providers[wallet]

  if (cachedProvider) {
    return cachedProvider
  }

  if (requestEip6963) {
    const announcedProvider = await requestEip6963Provider(
      wallet,
      providerCache,
      timeout,
    )

    if (announcedProvider) {
      return announcedProvider
    }
  }

  return getLegacyEvmProvider(wallet)
}

export const getEvmProviderWithFallback = async (
  wallet: Wallet,
  options: {
    eip6963Providers?: ProviderCache
    timeout?: number
  } = {},
) => {
  const { eip6963Providers: providerCache, timeout = 3000 } = options
  const provider = await resolveEvmProvider(wallet, {
    eip6963Providers: providerCache,
  })

  if (provider) {
    return provider
  }

  const eventName = legacyProviderInitializedEvents[wallet]

  if (typeof window === 'undefined' || !eventName) {
    return undefined
  }

  return new Promise<BrowserEip1193Provider | undefined>((resolve) => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    let handleInitialization = async () => {}

    const cleanup = () => {
      window.removeEventListener(eventName, handleInitialization)

      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }

    handleInitialization = async () => {
      cleanup()

      resolve(
        await resolveEvmProvider(wallet, {
          eip6963Providers: providerCache,
          requestEip6963: false,
        }),
      )
    }

    window.addEventListener(eventName, handleInitialization, { once: true })

    timeoutId = setTimeout(() => {
      cleanup()
      resolve(undefined)
    }, timeout)
  })
}
