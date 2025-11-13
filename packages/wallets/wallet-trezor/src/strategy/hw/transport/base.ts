import AccountManager from '../AccountManager.js'
<<<<<<< HEAD
import { loadTrezorConnect, type Manifest } from '../../lib.js'
=======
import type { Manifest } from '@trezor/connect-web'
>>>>>>> 1d5042ea2 (chore: update trezor version)

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
<<<<<<< HEAD
      await TrezorConnect.init({
        lazyLoad: true,
        manifest: TREZOR_CONNECT_MANIFEST,
        coreMode: 'popup',
=======
      console.log('🪵Initializing TrezorConnect...')
      await TrezorConnect.init({
        lazyLoad: true,
        manifest: TREZOR_CONNECT_MANIFEST,
        debug: true,
>>>>>>> 1d5042ea2 (chore: update trezor version)
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
