import AccountManager from '../AccountManager.js'
import { loadTrezorConnect, type Manifest } from '../../lib.js'

const TREZOR_CONNECT_MANIFEST = {
  email: 'contact@injectivelabs.org',
  appUrl: 'https://injectivelabs.org',
  appName: 'Injective Labs',
} as Manifest

export default class BaseTrezorTransport {
  private accountManager: AccountManager | null = null

  async connect() {
    const TrezorConnect = await loadTrezorConnect()
    const settings = await TrezorConnect.getSettings()

    if (!settings.success) {
      console.log('🪵Initializing TrezorConnect...')
      await TrezorConnect.init({
        lazyLoad: true,
        manifest: TREZOR_CONNECT_MANIFEST,
        debug: true,
        // 'auto', 'popup', 'iframe'
        coreMode: 'popup',
      })
    }

    return Promise.resolve()
  }

  async getAccountManager(): Promise<AccountManager> {
    if (!this.accountManager) {
      this.accountManager = new AccountManager()
    }

    return this.accountManager
  }
}
