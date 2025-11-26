import AccountManager from '../AccountManager.js'
import { type Manifest, loadTrezorConnect } from '../../lib.js'

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
      await TrezorConnect.init({
        lazyLoad: true,
        manifest: TREZOR_CONNECT_MANIFEST,
<<<<<<< HEAD
        coreMode: 'popup',
=======
        debug: true,
        // 'auto', 'popup', 'iframe'
        coreMode: 'auto',
>>>>>>> 2f6132c7a (chore: minor trezor beta)
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
