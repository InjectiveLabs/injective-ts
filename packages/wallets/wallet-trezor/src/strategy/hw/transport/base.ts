import AccountManager from '../AccountManager.js'
import { type Manifest, loadTrezorConnect } from '../../lib.js'

const TREZOR_CONNECT_MANIFEST = {
  email: 'contact@injectivelabs.org',
  appUrl: 'https://injectivelabs.org',
  appName: 'Injective Labs',
} as Manifest

export default class BaseTrezorTransport {
  private accountManager: AccountManager | null = null

  private static isInitialized = false
  private static initPromise: Promise<void> | null = null

  async connect() {
    // Return existing initialization promise if one is in progress
    // This prevents race conditions from multiple concurrent connect() calls
    if (BaseTrezorTransport.initPromise) {
      return BaseTrezorTransport.initPromise
    }

    // Skip if already initialized
    if (BaseTrezorTransport.isInitialized) {
      return Promise.resolve()
    }

    BaseTrezorTransport.initPromise = this.initializeTrezorConnect()

    try {
      await BaseTrezorTransport.initPromise
      BaseTrezorTransport.isInitialized = true
    } finally {
      BaseTrezorTransport.initPromise = null
    }
  }

  private async initializeTrezorConnect(): Promise<void> {
    const TrezorConnect = await loadTrezorConnect()

    try {
      // Initialize TrezorConnect with popup mode for reliable third-party app integration:
      // - WebUSB works cross-origin in popup (no Bridge dependency)
      // - More consistent behavior across different browsers
      //
      // Note: In popup mode, init() sets up the PopupManager but the actual
      // popup/handshake happens during each API call (ethereumGetPublicKey, etc.)
      await TrezorConnect.init({
        manifest: TREZOR_CONNECT_MANIFEST,
        // 'popup' mode opens a popup window on connect.trezor.io for each operation
        // This is more reliable than 'iframe' mode which requires Trezor Bridge
        coreMode: 'popup',
        // Timeout in seconds for user interactions (PIN entry, confirmations)
        interactionTimeout: 600,
      })
    } catch (error: unknown) {
      // Reset initialization state on failure so retry is possible
      BaseTrezorTransport.isInitialized = false
      throw error
    }
  }

  async getAccountManager(): Promise<AccountManager> {
    if (!this.accountManager) {
      this.accountManager = new AccountManager()
    }

    return this.accountManager
  }

  /**
   * Resets the initialization state. Call this if you need to reinitialize
   * TrezorConnect (e.g., after a connection error or when switching contexts).
   */
  static async reset(): Promise<void> {
    if (BaseTrezorTransport.isInitialized) {
      const TrezorConnect = await loadTrezorConnect()
      await TrezorConnect.dispose?.()
      BaseTrezorTransport.isInitialized = false
      BaseTrezorTransport.initPromise = null
    }
  }
}
