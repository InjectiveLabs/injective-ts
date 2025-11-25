// We avoid importing types from @trezor/connect because it triggers a syntax error
// in the underlying @trezor/connect type definitions (there's a typo: comma instead of space).
// Instead, we define the minimal types we need inline.

export type TrezorConnectType = typeof import('@trezor/connect-web').default

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
  trustedHost: boolean
  binFilesBaseUrl?: string
  enableFirmwareHashCheck?: boolean
  firmwareHashCheckTimeouts?: Record<string, number>
  thp?: {
    hostName?: string
    appName?: string
    staticKey?: string
    knownCredentials?: unknown[]
    pairingMethods: unknown[]
  }
}

// Reconstruct the init settings type without importing from @trezor/connect
type InitSettingsWithWeb = {
  manifest: Manifest
} & Partial<Omit<ConnectSettingsPublic, 'manifest'> & ConnectSettingsWeb>

// Export Manifest type so it can be used in other files
export type { Manifest }

// Define the return type without referencing TrezorConnectType to avoid triggering
// TypeScript to parse the broken type definition in @trezor/connect
export type TrezorConnectWithWebSettings = {
  init: (settings: InitSettingsWithWeb) => Promise<void>
  // Add other methods as needed, or use a more permissive type
  [key: string]: any
}

// todo: remove logs before merging to production
export async function loadTrezorConnect() {
  console.log('🪵Loading TrezorConnect...')

  const module = await import('@trezor/connect-web')

  console.log('🪵Module:', module)

  console.log({ aa: module.default, bb: (module.default as any)?.default })

  return (module.default as any)?.default || module.default

  // return (
  //   (module as any).default.default ||
  //   ((module as any).default as unknown as TrezorConnectWithWebSettings)
  // )
}
