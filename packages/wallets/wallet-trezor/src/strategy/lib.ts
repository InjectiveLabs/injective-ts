// We avoid importing types from @trezor/connect because it triggers a syntax error
// in the underlying @trezor/connect type definitions (there's a typo: comma instead of space).
// Instead, we define the minimal types we need inline.

type Manifest = {
  appName: string
  appIcon?: string
  appUrl: string
  email: string
}

type ConnectSettingsWeb = {
  hostLabel?: string
  coreMode?: 'auto' | 'popup' | 'iframe'
}

type ConnectSettingsPublic = {
  manifest?: Manifest
  connectSrc?: string
  debug?: boolean
  popup?: boolean
  transportReconnect?: boolean
  transports?: Array<'BridgeTransport' | 'WebUsbTransport' | 'NodeUsbTransport'>
  pendingTransportEvent?: boolean
  lazyLoad?: boolean
  interactionTimeout?: number
  trustedHost?: boolean
  binFilesBaseUrl?: string
  enableFirmwareHashCheck?: boolean
  firmwareHashCheckTimeouts?: Record<string, number>
  thp?: {
    hostName?: string
    appName?: string
    staticKey?: string
    knownCredentials?: unknown[]
    pairingMethods?: unknown[]
  }
}

// Reconstruct the init settings type without importing from @trezor/connect
type InitSettingsWithWeb = {
  manifest: Manifest
} & Partial<Omit<ConnectSettingsPublic, 'manifest'> & ConnectSettingsWeb>

// Export Manifest type so it can be used in other files
export type { Manifest }

export type TrezorConnectWithWebSettings = {
  init: (settings: InitSettingsWithWeb) => Promise<void>
  dispose?: () => void | Promise<void>
  getSettings: () => Promise<{ success: boolean; payload?: unknown }>
  // Add other methods as needed, or use a more permissive type
  [key: string]: any
}

type TrezorConnect = TrezorConnectWithWebSettings

let cachedTrezorConnect: TrezorConnect | null = null

export async function loadTrezorConnect(): Promise<TrezorConnect> {
  if (!cachedTrezorConnect) {
    const module = await import('@trezor/connect-web')
    // Handle different module export formats
    // Some bundlers may wrap the default export differently
    cachedTrezorConnect =
      ((module as any)?.default
        ?.default as unknown as TrezorConnectWithWebSettings) ||
      (module.default as unknown as TrezorConnectWithWebSettings)
  }
  return cachedTrezorConnect
}
