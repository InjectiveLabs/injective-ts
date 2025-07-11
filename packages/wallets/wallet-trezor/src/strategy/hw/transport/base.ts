import AccountManager from './../AccountManager.js'
import { loadTrezorConnect } from '../../lib.js'

const TREZOR_CONNECT_MANIFEST = {
  email: 'contact@injectivelabs.org',
  appUrl: 'https://injectivelabs.org',
}

export default class BaseTrezorTransport {
  private accountManager: AccountManager | null = null

  async connect() {
    const TrezorConnect = await loadTrezorConnect()

    const settings = await TrezorConnect.getSettings()

    if (!settings.success) {
      TrezorConnect.init({
        lazyLoad: true,
        manifest: TREZOR_CONNECT_MANIFEST,
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
